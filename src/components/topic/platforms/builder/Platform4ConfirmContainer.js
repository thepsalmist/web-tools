import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../../common/hocs/IntlForm';
import OpenWebSummary from './openWeb/OpenWebSummary';
import RedditSummary from './reddit/RedditSummary';
import { goToCreatePlatformStep } from '../../../../actions/topicActions';
import { PLATFORM_OPEN_WEB, PLATFORM_REDDIT, PLATFORM_TWITTER } from '../../../../lib/platformTypes';
import AppButton from '../../../common/AppButton';
import messages from '../../../../resources/messages';

const localMessages = {
  title: { id: 'platform.create.confirm.title', defaultMessage: 'Step 4: Confirm Your Platform Changes' },
  addAnotherPlatform: { id: 'platform.create.new', defaultMessage: 'Save and Add More' },
  platform: { id: 'platform.create', defaultMessage: 'Platform' },
};

const Platform4ConfirmContainer = (props) => {
  const { topicId, formValues, initialValues, handlePreviousStep, handleSubmit, finishStep, submitting } = props;
  const { formatMessage } = props.intl;
  let content = null;
  switch (formValues.currentPlatformType) {
    case PLATFORM_OPEN_WEB:
      content = (
        <OpenWebSummary topicId={topicId} formValues={formValues} initialValues={initialValues} />
      );
      break;
    case PLATFORM_REDDIT:
      content = (
        <RedditSummary topicId={topicId} formValues={formValues} initialValues={initialValues} />
      );
      break;
    case PLATFORM_TWITTER:
      content = (
        <TwitterSummary topicId={topicId} formValues={formValues} initialValues={initialValues} />
      );
      break;
    default:
      content = <FormattedMessage {...messages.unimplemented} />;
  }
  return (
    <form className="platform-confirm" name="platformValidation" onSubmit={handleSubmit(finishStep.bind(this))}>
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
  formValues: state.form.platform.values,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handlePreviousStep: () => {
    dispatch(goToCreatePlatformStep(1));
  },
  savePlatform: (topicId, values) => ownProps.onDone(topicId, values),
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return { ...stateProps, ...dispatchProps, ...ownProps, finishStep: values => dispatchProps.savePlatform(ownProps.topicId, values) };
}

function validate() {
  const errors = {};
  return errors;
}

const reduxFormConfig = {
  form: 'platform', // make sure this matches the sub-components and other wizard steps
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
