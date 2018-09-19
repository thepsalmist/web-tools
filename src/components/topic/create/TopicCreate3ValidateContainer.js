import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../common/hocs/IntlForm';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import AppButton from '../../common/AppButton';
import StoryFeedbackRow from './StoryFeedbackRow';
import { WarningNotice } from '../../common/Notice';
import { goToCreateTopicStep, fetchStorySampleByQuery } from '../../../actions/topicActions';

const NUM_TO_SHOW = 30;
const VALIDATION_CUTOFF = 0.9;

const localMessages = {
  title: { id: 'topic.create.validate.title', defaultMessage: 'Step 3: Validate 30 Random Stories' },
  about: { id: 'topic.create.validate.about',
    defaultMessage: 'To make sure the stories that match your seed query are relevant to your research, you need to review this random sample to see if these are the kinds of stories you want. For each story, click "yes" if it is about the topic you are interested in.  Click "no" if it is not about the topic you are intereseted in.' },
  warning: { id: 'topic.create.validate.warning',
    defaultMessage: 'At least 90% of the random stories we\'ve shown you must be relevant for the topic to work well. Please go back and modify your seed query to try and eliminate the irrelevant stories.' },
  randomStory: { id: 'topic.create.validate.randomStory', defaultMessage: 'Random Story' },
  usefulStory: { id: 'topic.create.validate.randomStory', defaultMessage: 'Is this Relevant?' },
  prev: { id: 'topic.create.preview.prev', defaultMessage: 'back to preview' },
  next: { id: 'topic.create.preview.next', defaultMessage: 'review and confirm' },
};

class TopicCreate3ValidateContainer extends React.Component {
  state = {
    matchCount: 0,
    showWarning: false,
  };

  handleYesClick = (options, prevSelection) => {
    if (prevSelection === options.match) {
      this.setState(prevState => ({ matchCount: prevState.matchCount - 1 }));
    } else {
      this.setState(prevState => ({ matchCount: prevState.matchCount + 1 }));
    }
  }

  handleNoClick = (options, prevSelection) => {
    if (prevSelection === options.match) {
      this.setState(prevState => ({ matchCount: prevState.matchCount - 1 }));
    }
  }

  handleConfirm = () => {
    const { handleNextStep, total } = this.props;
    if (this.state.matchCount >= (VALIDATION_CUTOFF * total)) {
      this.setState({ showWarning: false });
      handleNextStep();
    } else {
      this.setState({ showWarning: true });
    }
  }

  render = () => {
    const { handlePreviousStep, stories } = this.props;
    const { formatMessage } = this.props.intl;

    let warningContent;
    if (this.state.showWarning) {
      warningContent = (
        <WarningNotice>
          <FormattedHTMLMessage {...localMessages.warning} />
        </WarningNotice>
      );
    } else {
      warningContent = (<div />);
    }

    return (
      <Grid>
        <h1>
          <FormattedHTMLMessage {...localMessages.title} />
        </h1>
        <p>
          <FormattedHTMLMessage {...localMessages.about} />
        </p>
        <br />
        <Row start="lg" className="topic-create-sample-story-table">
          <Col lg={12}>
            <Row start="lg" className="topic-create-sample-story-table-header">
              <Col lg={8} className="topic-create-story-title-col">
                <b><FormattedMessage {...localMessages.randomStory} /></b>
              </Col>
              <Col lg={4} className="topic-create-match-col">
                <b><FormattedMessage {...localMessages.usefulStory} /></b>
              </Col>
            </Row>
          </Col>
          <Col lg={12}>
            <Row start="lg" className="topic-create-sample-story-container">
              <Col lg={12}>
                {stories.map(story => (
                  <StoryFeedbackRow
                    key={story.stories_id}
                    story={story}
                    maxTitleLength={85}
                    handleYesClick={this.handleYesClick}
                    handleNoClick={this.handleNoClick}
                  />
                ))}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            { warningContent }
          </Col>
        </Row>
        <br />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <AppButton flat label={formatMessage(localMessages.prev)} onClick={() => handlePreviousStep()} />
            &nbsp; &nbsp;
            <AppButton type="submit" label={formatMessage(localMessages.next)} primary onClick={this.handleConfirm} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

TopicCreate3ValidateContainer.propTypes = {
  // from parent
  location: PropTypes.object.isRequired,
  // form composition
  intl: PropTypes.object.isRequired,
  // from state
  currentStep: PropTypes.number,
  fetchStatus: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  stories: PropTypes.array.isRequired,
  // from dispatch
  handlePreviousStep: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from form
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form.topicForm.values,
  currentStep: state.topics.create.preview.workflow.currentStep,
  fetchStatus: state.topics.create.preview.matchingStories.fetchStatus,
  total: state.topics.create.preview.matchingStories.total,
  stories: state.topics.create.preview.matchingStories.list,
});

const mapDispatchToProps = dispatch => ({
  handlePreviousStep: () => {
    dispatch(goToCreateTopicStep(1));
  },
  handleNextStep: () => {
    dispatch(goToCreateTopicStep(3));
  },
  fetchData: (query) => {
    const infoForQuery = {
      q: query.solr_seed_query,
      start_date: query.start_date,
      end_date: query.end_date,
      rows: NUM_TO_SHOW,
    };
    infoForQuery['collections[]'] = [];
    infoForQuery['sources[]'] = [];

    if ('sourcesAndCollections' in query) { // in FieldArrays on the form
      infoForQuery['collections[]'] = query.sourcesAndCollections.map(s => s.tags_id);
      infoForQuery['sources[]'] = query.sourcesAndCollections.map(s => s.media_id);
    }
    dispatch(fetchStorySampleByQuery(infoForQuery));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.formData);
    },
  });
}

export default
injectIntl(
  withIntlForm(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      withAsyncFetch(
        TopicCreate3ValidateContainer
      )
    )
  )
);
