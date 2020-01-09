import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../../../common/AppButton';
import withIntlForm from '../../../../common/hocs/IntlForm';
import messages from '../../../../../resources/messages';
import PlatformPreview from '../preview/PlatformPreview';
import MediaPickerDialog from '../../../../common/mediaPicker/MediaPickerDialog';
import { formatPlatformOpenWebChannelData } from '../../../../util/topicUtil';
import OpenWebMediaFieldArray from '../../../../common/form/OpenWebMediaFieldArray';
import { platformNameMessage, sourceNameMessage, platformDescriptionMessage } from '../../AvailablePlatform';

const formSelector = formValueSelector('platform');

const localMessages = {
  title: { id: 'platform.create.edit.title', defaultMessage: 'Step 1: Configure Your Platform: ' },
};

class EditOpenWebContainer extends React.Component {
  constructor(props) {
    // Track this in local React state because we don't need it anywhere else.
    // We can't read out of the form state becase we need to know when they click "search",
    // but that is updated live as they type.
    super(props);
    this.state = { query: null };
  }

  updateQuery = () => {
    const { change, currentQuery, currentPlatform } = this.props;
    change('platform', currentPlatform.platform);
    this.setState({ query: currentQuery });
  }

  handleKeyDown = (event) => {
    switch (event.key) {
      case 'Enter':
        this.updateKeywords();
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  render() {
    const { initialValues, handleMediaChange, renderTextField, handleSubmit, finishStep, currentPlatform, intl } = this.props;
    const cleanedInitialValues = {
      ...initialValues,
      media: initialValues.media_tags,
    };
    const queryExists = (this.state.query !== null) && (this.state.query !== undefined) && (this.state.query.length > 0);
    return (
      <Grid>
        <form className="platform-create-edit-keyword platform-edit-open-web" name="platform" onSubmit={handleSubmit(finishStep.bind(this))}>
          <Row>
            <Col lg={10}>
              <h2>
                <FormattedMessage {...localMessages.title} />
                <FormattedHTMLMessage {...platformNameMessage(currentPlatform.platform, currentPlatform.source)} />
                &nbsp;
                ( <FormattedHTMLMessage {...sourceNameMessage(currentPlatform.source)} /> )
              </h2>
              <p>
                <FormattedHTMLMessage {...platformDescriptionMessage(currentPlatform.platform, currentPlatform.source)} />
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <label htmlFor="query"><FormattedMessage {...messages.query} /></label>
              <Field
                name="query"
                component={renderTextField}
                fullWidth
                multiline
                rows="3"
                variant="outlined"
                onKeyDown={this.handleKeyDown}
              />
            </Col>
            <Col lg={6}>
              <div className="media-field-wrapper">
                <label htmlFor="media"><FormattedMessage {...messages.topicSourceCollectionsProp} /></label>
                <OpenWebMediaFieldArray
                  formatMessage={intl.formatMessage}
                  className="query-field"
                  form="platform"
                  enableReinitialize
                  keepDirtyOnReinitialize
                  destroyOnUnmount={false}
                  fieldName="media"
                  initialValues={cleanedInitialValues} // to and from MediaPicker
                  allowRemoval
                />
                <MediaPickerDialog
                  initMedia={cleanedInitialValues.media} // {selected.media ? selected.media : cleanedInitialValues.media}
                  onConfirmSelection={selections => handleMediaChange(selections)}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={2} xs={12}>
              <AppButton
                id="preview-search-button"
                label={messages.search}
                style={{ marginTop: 33 }}
                onClick={this.updateQuery}
              />
            </Col>
          </Row>
          { queryExists && (
            <PlatformPreview topic={cleanedInitialValues} query={this.state.query} formatPlatformChannelData={formatPlatformOpenWebChannelData} />
          ) }
          <Row>
            <Col lg={8} xs={12}>
              <AppButton className="platform-builder-next" disabled={!queryExists} type="submit" label={messages.next} primary />
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }
}

EditOpenWebContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  onNextStep: PropTypes.func.isRequired,
  handleMediaChange: PropTypes.func.isRequired,
  // from state
  currentPlatform: PropTypes.object,
  currentQuery: PropTypes.string,
  change: PropTypes.func.isRequired,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  // from compositional helper
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  renderTextField: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentQuery: formSelector(state, 'query'),
  currentPlatform: state.topics.selected.platforms.selected,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleMediaChange: (sourceAndCollections) => {
    // take selections from mediaPicker and push them back into topicForm
    ownProps.change('media', sourceAndCollections); // redux-form change action
  },
  handleMediaDelete: () => null, // in create mode we don't need to update the values
  finishStep: (values) => {
    const customProps = {
      query: values.query,
    };
    ownProps.onNextStep(customProps);
  },
});

const reduxFormConfig = {
  form: 'platform', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  enableReinitialize: true,
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      connect(mapStateToProps, mapDispatchToProps)(
        EditOpenWebContainer
      )
    )
  )
);
