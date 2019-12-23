import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../../../common/AppButton';
import withIntlForm from '../../../../common/hocs/IntlForm';
import messages from '../../../../../resources/messages';
import OpenWebPreview from './OpenWebPreview';
import { notEmptyString } from '../../../../../lib/formValidators';
import MediaPickerDialog from '../../../../common/mediaPicker/MediaPickerDialog';
import OpenWebMediaFieldArray from '../../../../common/form/OpenWebMediaFieldArray';

const formSelector = formValueSelector('platform');

const localMessages = {
  title: { id: 'platform.create.edit.title', defaultMessage: 'Step 1: Configure Your Open Web platform' },
  intro: { id: 'platform.create.edit.intro', defaultMessage: 'Step 1: intro' },
  about: { id: 'platform.create.edit.about',
    defaultMessage: 'This Platform is driven by an open web seed query.  Any stories that match the query you create will be included in the Platform.' },
  errorNoKeywords: { id: 'platform.error', defaultMessage: 'You need to specify a query.' },
  SandC: { id: 'platform.create.edit.sandC',
    defaultMessage: 'Media' },
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
    const { change, currentQuery, currentPlatformType } = this.props;
    change('currentPlatformType', currentPlatformType);
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
    const { topicId, initialValues, handleMediaChange, renderTextField, handleSubmit, finishStep, location } = this.props;
    const { formatMessage } = this.props.intl;
    let mediaPicker = null;
    const selectedMedia = initialValues.media ? initialValues.media : [];
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    const mediaLabel = <label htmlFor="media"><FormattedMessage {...localMessages.SandC} /></label>;
    mediaPicker = (
      <MediaPickerDialog
        initMedia={selectedMedia} // {selected.media ? selected.media : cleanedInitialValues.media}
        onConfirmSelection={selections => handleMediaChange(selections)}
      />
    );
    let previewContent = null;
    let nextButtonDisabled = true;
    if ((this.state.query !== null) && (this.state.query !== undefined) && (this.state.query.length > 0)) {
      nextButtonDisabled = false;
      previewContent = (
        <div>
          <OpenWebPreview topicId={topicId} topicInfo={initialValues.topicInfo} query={this.state.query} location={location} />
        </div>
      );
    }
    return (
      <Grid>
        <form className="platform-create-edit-keyword" name="platform" onSubmit={handleSubmit(finishStep.bind(this))}>
          <Row>
            <Col lg={10}>
              <h2><FormattedMessage {...localMessages.title} /></h2>
              <p>
                <FormattedMessage {...localMessages.about} />
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={8} xs={12}>
              <Field
                name="query"
                component={renderTextField}
                placeholder={messages.searchByKeywords}
                fullWidth
                onKeyDown={this.handleKeyDown}
              />
            </Col>
            <Col lg={2} xs={12}>
              <AppButton
                id="open-web-preview-button"
                label={formatMessage(messages.search)}
                style={{ marginTop: 33 }}
                onClick={this.updateQuery}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <div className="media-field-wrapper">
                {mediaLabel}
                <OpenWebMediaFieldArray
                  formatMessage={formatMessage}
                  className="query-field"
                  form="platform"
                  destroyOnUnmount={false}
                  fieldName="sourcesAndCollections"
                  initialValues={initialValues.sourcesAndCollections} // to and from MediaPicker
                  allowRemoval
                />
                {mediaPicker}
              </div>
            </Col>
          </Row>
          { previewContent }
          <Row>
            <Col lg={8} xs={12}>
              <AppButton disabled={nextButtonDisabled} type="submit" label={formatMessage(messages.next)} primary />
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
  currentPlatformType: PropTypes.string,
  currentPlatformInfo: PropTypes.object,
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
  currentPlatformType: formSelector(state, 'currentPlatformType'),
  currentPlatformInfo: state.topics.selected.platforms.selected.platformDetails,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleMediaChange: (sourceAndCollections) => {
    // take selections from mediaPicker and push them back into topicForm
    ownProps.change('sourcesAndCollections', sourceAndCollections); // redux-form change action
  },
  handleMediaDelete: () => null, // in create mode we don't need to update the values
  finishStep: (values) => {
    const customProps = {
      query: values.query,
    };
    ownProps.onNextStep(customProps);
  },
});

function validate(values) {
  const errors = {};
  if (!notEmptyString(values.query)) {
    errors.query = true; // localMessages.errorNoKeywords;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'platform', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  enableReinitialize: true,
  validate,
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
