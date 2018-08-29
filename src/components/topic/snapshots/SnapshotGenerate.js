import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import BackLinkingControlBar from '../BackLinkingControlBar';
import SnapshotGenerateForm from './GenerateSnapshotForm';
import messages from '../../../resources/messages';
import { generateSnapshot, fetchTopicSummary } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';
import SnapshotIcon from '../../common/icons/SnapshotIcon';
import { SOURCE_SCRAPE_STATE_QUEUED, SOURCE_SCRAPE_STATE_RUNNING } from '../../../reducers/sources/sources/selected/sourceDetails';
import UpdateForStorySearchWarning from '../UpdateForStorySearchWarning';

const localMessages = {
  title: { id: 'snapshot.builder.title', defaultMessage: 'Generate Snapshot' },
  aboutText: { id: 'snapshot.builder.about', defaultMessage: '<p>A Snapshot includes all the content in your Topic at one point in time.  You can\'t change the content within a Snapshot.  Anything you want to change within a Topic requires a new Snapshot to be made.  This doesn\'t take a long time, but it isn\'t instant either.</p>' },
  snapshotFailed: { id: 'snapshot.generate.failed', defaultMessage: 'Sorry, but we failed to start generating the snapshot' },
  backToTopicLink: { id: 'snapshot.builder.backToTopic.link', defaultMessage: 'back to Topic' },
};

const SnapshotGenerate = props => (
  <div className="snapshot-builder-home">
    <BackLinkingControlBar message={localMessages.backToTopicLink} linkTo={`/topics/${props.topicId}/summary`} />
    <Grid>
      <Row>
        <Col lg={10}>
          <h1><SnapshotIcon /><FormattedMessage {...localMessages.title} /></h1>
          <FormattedHTMLMessage {...localMessages.aboutText} />
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          {(props.topicInfo.is_story_index_ready === false) && (<UpdateForStorySearchWarning />)}
        </Col>
      </Row>
      <SnapshotGenerateForm onGenerate={props.handleGenerateSnapshotRequest} />
    </Grid>
  </div>
);

SnapshotGenerate.propTypes = {
  intl: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  children: PropTypes.node,
  // from state
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
  // from dispatch
  handleGenerateSnapshotRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
  topicInfo: state.topics.selected.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleGenerateSnapshotRequest: values => (
    dispatch(generateSnapshot(ownProps.params.topicId, { note: values.note }))
      .then((results) => {
        if ((results.job_state.state === SOURCE_SCRAPE_STATE_QUEUED) ||
          (results.job_state.state === SOURCE_SCRAPE_STATE_RUNNING)) {
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(messages.snapshotGenerating) }));
          dispatch(fetchTopicSummary(ownProps.params.topicId))  // update the topic so that we see the msg that a new snapshot is being generated up top
            .then(() => dispatch(push(`/topics/${ownProps.params.topicId}/summary`)));
        } else {
          // was completed far too quickly, or was an error
          dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(localMessages.snapshotFailed) }));
        }
      })
  ),
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SnapshotGenerate
    )
  );
