import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../../common/hocs/IntlForm';
import AppButton from '../../../common/AppButton';
import PlatformDescriptionForm from './PlatformDescriptionForm';
import { goToCreatePlatformStep } from '../../../../actions/topicActions';
import { PLATFORM_OPEN_WEB /*, PLATFORM_REDDIT, PLATFORM_TWITTER */ } from '../../../../lib/platformTypes';
import messages from '../../../../resources/messages';
import PlatformForm from './PlatformForm';

const formSelector = formValueSelector('snapshotFocus');

const localMessages = {
  title: { id: 'focus.create.setup3.title', defaultMessage: 'Step 3: Describe Your Subtopic' },
  retweetIntro: { id: 'focus.create.setup3.retweetIntro', defaultMessage: 'This will create a set with one subtopic for each of the partisan quintiles.  For example, any story from a media source in the "center left" group will be put into the "center left" subtopic in this set.  Name thet set and we will create the subtopics within it.  Give it a name that makes these subtopics easy to identify later.' },
  topCountriesIntro: { id: 'focus.create.setup3.title', defaultMessage: 'This will create a subtopic containing the stories mentioning the top most tagged countries' },
  nytThemeIntro: { id: 'focus.create.setup3.nytTheme.title', defaultMessage: 'This will create a subtopic containing the stories tagged by New York Times Themes' },
  mediaTypeIntro: { id: 'focus.create.setup3.mediaType.title', defaultMessage: 'This will create a subtopic containing the stories tagged by media type' },
  duplicateName: { id: 'focus.create.setup3.duplicateName', defaultMessage: 'Duplicate Name' },
};

const Platform3DescribeContainer = (props) => {
  const { topicId, handleSubmit, finishStep, goToStep, initialValues, platforms, formData } = props;
  const { formatMessage } = props.intl;
  let introContent;
  

  let content;
  switch (formData.focalTechnique) {
    case PLATFORM_OPEN_WEB:
      content = (
        <PlatformDescriptionForm
          topicId={topicId}
          initialValues={initialValues}
          platform={formData.platform}
          keywords={formData.keywords}
        />
      );
      break;
    case PLATFORM_REDDIT:
      introContent = (
        <p><FormattedMessage {...localMessages.retweetIntro} /></p>
      );
      content = (
        <Row>
          <Col lg={10}>
            <PlatformForm
              initialValues={includeDefsInitialValues}
              introContent={introContent}
              platform={formData.platform}
              fullWidth
            />
          </Col>
        </Row>
      );
      break;
    case PLATFORM_TWITTER:
      introContent = (
        <p><FormattedMessage {...localMessages.topCountriesIntro} /></p>
      );
      content = (
        <Row>
          <Col lg={10}>
            <FocalSetForm
              initialValues={includeDefsInitialValues}
              introContent={introContent}
              focalTechnique={formData.focalTechnique}
              fullWidth
            />
          </Col>
        </Row>
      );
      break;
    default:
      content = <FormattedMessage {...messages.unimplemented} />;
  }
  return (
    <Grid>
      <form className="platform-create-details" name="platform" onSubmit={handleSubmit(finishStep.bind(this))}>
        <Row>
          <Col lg={10}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
          </Col>
        </Row>
        {content}
        <Row>
          <Col lg={12}>
            <AppButton variant="outlined" color="secondary" label={formatMessage(messages.previous)} onClick={() => goToStep(1)} />
            &nbsp; &nbsp;
            <AppButton type="submit" label={formatMessage(messages.next)} primary />
          </Col>
        </Row>
      </form>
    </Grid>
  );
};

FocusForm3DescribeContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  // form composition
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderSelect: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  platforms: PropTypes.array.isRequired,
  formData: PropTypes.object,
  // from dispatch
  goToStep: PropTypes.func.isRequired,
  finishStep: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  platforms: state.topics.selected.focalSets.definitions.list,
  fetchStatus: state.topics.selected.focalSets.definitions.fetchStatus,
  formData: formSelector(state, 'platforms'),
});

const mapDispatchToProps = dispatch => ({
  goToStep: (step) => {
    dispatch(goToCreatePlatformStep(step));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return { ...stateProps,
    ...dispatchProps,
    ...ownProps,
    finishStep: () => {
      dispatchProps.goToStep(3);
    } };
}

function validate(values, props) {
  const errors = {};
  // TODO: figure out if we need to do more validation here, because in theory the
  // subforms components have already done it

  return errors;
}

const reduxFormConfig = {
  form: 'snapshotFocus', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      connect(mapStateToProps, mapDispatchToProps, mergeProps)(
        Platform3DescribeContainer
      )
    )
  )
);
