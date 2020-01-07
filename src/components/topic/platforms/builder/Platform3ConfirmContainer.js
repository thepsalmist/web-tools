import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../../common/hocs/IntlForm';
// import OpenWebSummary from './openWeb/OpenWebSummary';
import EnabledPlatformSummary from '../EnabledPlatformSummary';
import { goToCreatePlatformStep } from '../../../../actions/topicActions';
import { PLATFORM_OPEN_WEB, PLATFORM_REDDIT, PLATFORM_TWITTER } from '../../../../lib/platformTypes';
import AppButton from '../../../common/AppButton';
import messages from '../../../../resources/messages';

const localMessages = {
  title: { id: 'platform.create.confirm.title', defaultMessage: 'Step 4: Confirm Your Platform Changes' },
  addAnotherPlatform: { id: 'platform.create.new', defaultMessage: 'Save and Add More' },
  platform: { id: 'platform.create', defaultMessage: 'Platform' },
};

const Platform3ConfirmContainer = (props) => {
  const { topicId, formValues, currentPlatformType, initialValues, handlePreviousStep, handleSubmit, finishStep, submitting } = props;
  const { formatMessage } = props.intl;
  let content = null;
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
            <EnabledPlatformSummary platform={formValues} />
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

Platform3ConfirmContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  onDone: PropTypes.func.isRequired,
  currentPlatformType: PropTypes.string.isRequired,
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
  currentPlatformType: state.topics.selected.platforms.selected.platform,
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
        Platform3ConfirmContainer
      )
    )
  )
);
