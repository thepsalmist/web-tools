import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../../common/hocs/IntlForm';
import AppButton from '../../../common/AppButton';
import PlatformForm from './PlatformForm';
import { goToCreatePlatformStep } from '../../../../actions/topicActions';
import { PLATFORM_OPEN_WEB, PLATFORM_REDDIT, PLATFORM_TWITTER } from '../../../../lib/platformTypes';
import messages from '../../../../resources/messages';

const formPSelector = formValueSelector('currentPlatformType');
const formPESelector = formValueSelector('platformEditKeywordForm');

const localMessages = {
  title: { id: 'platform.create.setup3.title', defaultMessage: 'Step 3: Describe Your Platform' },
  redditIntro: { id: 'platform.create.setup3.retweetIntro', defaultMessage: 'This will create a platform' },
  twitterIntro: { id: 'platform.create.setup3.title', defaultMessage: 'This will create a platform containing the stories from Reddit' },
  openWebIntro: { id: 'platform.create.setup3.nytTheme.title', defaultMessage: 'This will create a platform containing the stories captured from Twitter' },
};

const Platform3DescribeContainer = (props) => {
  const { topicId, handleSubmit, finishStep, goToStep, initialValues, currentPlatform, currentQuery } = props;
  const { formatMessage } = props.intl;
  let introContent;

  let content;
  switch (currentPlatform) {
    case PLATFORM_OPEN_WEB:
      content = (
        <PlatformForm
          topicId={topicId}
          initialValues={initialValues}
          platform={currentPlatform}
          query={currentQuery}
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
              introContent={introContent}
              platform={currentPlatform}
              fullWidth
            />
          </Col>
        </Row>
      );
      break;
    case PLATFORM_TWITTER:
      introContent = (
        <p><FormattedMessage {...localMessages.twitterIntro} /></p>
      );
      content = (
        <Row>
          <Col lg={10}>
            <PlatformForm
              introContent={introContent}
              platform={currentPlatform}
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

Platform3DescribeContainer.propTypes = {
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
  currentPlatform: PropTypes.object,
  currentQuery: PropTypes.object,
  // from dispatch
  goToStep: PropTypes.func.isRequired,
  finishStep: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  platforms: state.topics.selected.platforms.all.list || {},
  currentPlatform: formPSelector(state, 'currentPlatform'),
  fetchStatus: state.topics.selected.platforms.all.fetchStatus,
  currentQuery: formPESelector(state, 'currentQuery'),
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

function validate() {
  const errors = {};
  // TODO: figure out if we need to do more validation here, because in theory the
  // subforms components have already done it

  return errors;
}

const reduxFormConfig = {
  form: 'platformValidation', // make sure this matches the sub-components and other wizard steps
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
