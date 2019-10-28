import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../../common/hocs/IntlForm';
import PlatformSelector from './PlatformSelector';
import AppButton from '../../../common/AppButton';
import { goToCreatePlatformStep } from '../../../../actions/topicActions';
import messages from '../../../../resources/messages';

const localMessages = {
  title: { id: 'platform.create.setup.title', defaultMessage: 'Step 1: Pick a Platform' },
  about: { id: 'platform.create.setup.about',
    defaultMessage: 'Creating a Platform' },
};

const formSelector = formValueSelector('platform');

const Platform1Container = (props) => {
  const { handleSubmit, finishStep, submitting, currentPlatform } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <form className="platform-create-setup" name="platform" onSubmit={handleSubmit(finishStep.bind(this))}>
        <Row>
          <Col lg={10} md={10} sm={10}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
            <p>
              <FormattedMessage {...localMessages.about} />
            </p>
          </Col>
        </Row>
        <PlatformSelector currentPlatform={0} />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <AppButton
              disabled={(currentPlatform === undefined) || submitting}
              type="submit"
              label={formatMessage(messages.next)}
              primary
            >
              {formatMessage(messages.next)}
            </AppButton>
          </Col>
        </Row>
      </form>
    </Grid>
  );
};

Platform1Container.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  // form composition
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderSelect: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  // from state
  currentPlatform: PropTypes.string,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  // pull the focal set id out of the form so we know when to show the focal set create sub form
  currentPlatform: formSelector(state, 'currentPlatform'),
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
      dispatchProps.goToStep(1);
    } };
}

function validate() {
  const errors = {};
  // TODO: figure out if we need to do more validation here, because in theory the
  // subforms components have already done it
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
      connect(mapStateToProps, mapDispatchToProps, mergeProps)(
        Platform1Container
      )
    )
  )
);
