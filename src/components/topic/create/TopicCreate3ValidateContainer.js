import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import withIntlForm from '../../common/hocs/IntlForm';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import AppButton from '../../common/AppButton';
import StoryFeedbackRow from './StoryFeedbackRow';
import { goToCreateTopicStep, fetchStorySampleByQuery } from '../../../actions/topicActions';

const NUM_TO_SHOW = 30;
const VALIDATION_CUTOFF = 0.9;

const localMessages = {
  title: { id: 'topic.create.validate.title', defaultMessage: 'Step 3: Validate 30 Random Stories' },
  about: { id: 'topic.create.validate.about',
    defaultMessage: 'To make sure the stories that match your seed query are relevant to your research, you need to review this random sample to see if these are the kinds of stories you want. For each story, click "yes" if it is about the topic you are interested in.  Click "no" if it is not about the topic you are intereseted in.' },
  warningTitle: { id: 'topic.create.validate.warningTitle', defaultMessage: 'Relevance Low' },
  warning: { id: 'topic.create.validate.warning',
    defaultMessage: 'It seems that not enough of the stories are relevant to the topic you\'re researching. We recommend at least 90% of stories from the list presented must be relevant for the topic to work well. We suggest going back to your query and try either changing the search terms (to narrow in a bit more), your time period (to focus around any key events), or media sources (to specify media from the place you care about). If you\'re unable to generate relevant stories after that, please feel free to reach us at support@mediacloud.org for help.' },
  randomStory: { id: 'topic.create.validate.randomStory', defaultMessage: 'Random Story' },
  usefulStory: { id: 'topic.create.validate.randomStory', defaultMessage: 'Is this Relevant?' },
  prev: { id: 'topic.create.warning.prev', defaultMessage: 'back to preview' },
  next: { id: 'topic.create.warning.next', defaultMessage: 'review and confirm' },
  warningIgnore: { id: 'topic.create.warning.warningIgnore', defaultMessage: 'Ignore and Create Topic Anway' },
  warningOk: { id: 'topic.create.warning.warningOk', defaultMessage: 'I\'ll edit my seed query' },
};

class TopicCreate3ValidateContainer extends React.Component {
  state = {
    matchCount: 0,
    warningOpen: false,
  };

  handleWarningOk = () => {
    const { handleEditSeedQueryRequest } = this.props;
    this.setState({ warningOpen: false });
    handleEditSeedQueryRequest();
  }

  handleWarningIgnore = () => {
    const { handleNextStep } = this.props;
    handleNextStep();
  }

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
      handleNextStep();
    } else {
      this.setState({ warningOpen: true });
    }
  }

  render = () => {
    const { handlePreviousStep, stories } = this.props;
    const { formatMessage } = this.props.intl;

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
        <br />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <AppButton label={formatMessage(localMessages.prev)} onClick={() => handlePreviousStep()} />
            &nbsp; &nbsp;
            <AppButton
              type="submit"
              label={formatMessage(localMessages.next)}
              primary
              onClick={this.handleConfirm}
            />
          </Col>
        </Row>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          aria-labelledby="confirmation-dialog-title"
          open={this.state.warningOpen}
          onClose={this.handleWarningOk}
        >
          <DialogTitle id="confirmation-dialog-title">
            <FormattedMessage {...localMessages.warningTitle} />
          </DialogTitle>
          <DialogContent>
            <p>
              <FormattedMessage {...localMessages.warning} />
            </p>
          </DialogContent>
          <DialogActions>
            <AppButton onClick={this.handleWarningIgnore}>
              <FormattedMessage {...localMessages.warningIgnore} />
            </AppButton>
            <AppButton onClick={this.handleWarningOk} primary>
              <FormattedMessage {...localMessages.warningOk} />
            </AppButton>
          </DialogActions>
        </Dialog>
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
  handleEditSeedQueryRequest: PropTypes.func.isRequired,
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
  handleEditSeedQueryRequest: () => {
    dispatch(goToCreateTopicStep(0));
  },
  handlePreviousStep: () => {
    dispatch(goToCreateTopicStep(1));
  },
  handleNextStep: () => {
    dispatch(goToCreateTopicStep(3));
  },
});

const fetchAsyncData = (dispatch, { formData }) => {
  const infoForQuery = {
    q: formData.solr_seed_query,
    start_date: formData.start_date,
    end_date: formData.end_date,
    rows: NUM_TO_SHOW,
  };
  infoForQuery['collections[]'] = [];
  infoForQuery['sources[]'] = [];

  if ('sourcesAndCollections' in formData) { // in FieldArrays on the form
    infoForQuery['collections[]'] = formData.sourcesAndCollections.map(s => s.tags_id);
    infoForQuery['sources[]'] = formData.sourcesAndCollections.map(s => s.media_id);
  }
  dispatch(fetchStorySampleByQuery(infoForQuery));
};

export default
injectIntl(
  withIntlForm(
    connect(mapStateToProps, mapDispatchToProps)(
      withAsyncData(fetchAsyncData)(
        TopicCreate3ValidateContainer
      )
    )
  )
);
