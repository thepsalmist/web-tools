import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../../common/hocs/IntlForm';
import OpenWebSummary from './openWeb/OpenWebSummary';
// import RetweetPartisanshipSummary from './retweetPartisanship/RetweetPartisanshipSummary';
// import TopCountriesSummary from './topCountries/TopCountriesSummary';
import { goToCreatePlatformStep } from '../../../../actions/topicActions';
import { PLATFORM_OPEN_WEB /* PLATFORM_REDDIT, PLATFORM_TWITTER */ } from '../../../../lib/platformTypes';
import AppButton from '../../../common/AppButton';
import messages from '../../../../resources/messages';

const localMessages = {
  title: { id: 'focus.create.confirm.title', defaultMessage: 'Step 4: Confirm Your Subtopic Changes' },
  focalTechnique: { id: 'focus.create.confirm.focalTechnique', defaultMessage: '<b>Technique</b>: {name}' },
  addAnotherFocus: { id: 'focus.create.generateSnapshot', defaultMessage: 'Save and Add More' },
  focalSetSaved: { id: 'focalSet.saved', defaultMessage: 'We saved your new Set.' },
  focalSetNotSaved: { id: 'focus.notSaved', defaultMessage: 'Sorry, we couldn\'t save your new Set' },
  focusSaved: { id: 'focus.create.saved', defaultMessage: 'We saved your new Subtopic.' },
  focusNotSaved: { id: 'focus.create.notSaved', defaultMessage: 'That didn\'t work! Make sure you have a unique Subtopic name?' },
};

const Platform4ConfirmContainer = (props) => {
  const { topicId, formValues, initialValues, handlePreviousStep, handleSubmit, finishStep, submitting } = props;
  const { formatMessage } = props.intl;
  let content = null;
  switch (formValues.focalTechnique) {
    case PLATFORM_OPEN_WEB:
      content = (
        <OpenWebSummary topicId={topicId} formValues={formValues} initialValues={initialValues} />
      );
      break;
    /* case PLATFORM_REDDIT:
      content = (
        <RedditSummary topicId={topicId} formValues={formValues} initialValues={initialValues} />
      );
      break;
    case PLATFORM_TWITTER:
      content = (
        <TwitterSummary topicId={topicId} formValues={formValues} initialValues={initialValues} />
      );
      break;
    */
    default:
      content = <FormattedMessage {...messages.unimplemented} />;
  }
  return (
    <form className="focus-confirm" name="snapshotFocusConfirm" onSubmit={handleSubmit(finishStep.bind(this))}>
      <Grid>
        <Row>
          <Col lg={12}>
            <h2><FormattedMessage {...localMessages.title} values={{ name: formValues.platformName }} /></h2>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <h3><FormattedHTMLMessage {...localMessages.platform} values={{ name: formValues.platform }} /></h3>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            {content}
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <br /><br />
            <AppButton variant="outlined" color="secondary" label={formatMessage(messages.previous)} onClick={handlePreviousStep} />
            &nbsp; &nbsp;
            <AppButton
              disabled={submitting}
              primary
              label={formatMessage(localMessages.addAnotherPlatform)}
              type="submit"
            />
          </Col>
        </Row>
      </Grid>
    </form>
  );
};

Platform4ConfirmContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  onDone: PropTypes.func.isRequired,
  // form context
  intl: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  // from state
  formValues: PropTypes.object.isRequired,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  handlePreviousStep: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formValues: state.form.snapshotFocus.values,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handlePreviousStep: () => {
    dispatch(goToCreatePlatformStep(2));
  },
  saveFocus: (topicId, values) => ownProps.onDone(topicId, values),
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return { ...stateProps, ...dispatchProps, ...ownProps, finishStep: values => dispatchProps.saveFocus(ownProps.topicId, values) };
}

function validate() {
  const errors = {};
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
        Platform4ConfirmContainer
      )
    )
  )
);
