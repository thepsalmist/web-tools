import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Link from 'react-router/lib/Link';
import BackLinkingControlBar from '../BackLinkingControlBar';
import AppButton from '../../common/AppButton';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';
import { generateSnapshot, fetchTopicSummary } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';
import ComingSoon from '../../common/ComingSoon';
import SnapshotIcon from '../../common/icons/SnapshotIcon';
import { SOURCE_SCRAPE_STATE_QUEUED, SOURCE_SCRAPE_STATE_RUNNING } from '../../../reducers/sources/sources/selected/sourceDetails';

const localMessages = {
  title: { id: 'snapshot.builder.title', defaultMessage: 'Snapshot Builder' },
  aboutText: { id: 'snapshot.builder.about', defaultMessage: '<p>A Snapshot includes all the content in your Topic at one point in time.  You can\'t change the content within a Snapshot.  Anything you want to change within a Topic requires a new Snapshot to be made.  This doesn\'t take a long time, but it isn\'t instant either.</p><p>Use this Snapshot Builder to change Subtopics, Timespans, and any other parts of your Topic.  When you\'re ready to generate your new Snapshot, click the <b>Generate My Snapshot</b> button!' },
  fociLink: { id: 'snapshot.builder.foci.link', defaultMessage: 'Build Subtopics' },
  timespanLink: { id: 'snapshot.builder.timespans.link', defaultMessage: 'Build Timespans' },
  backToTopicLink: { id: 'snapshot.builder.backToTopic.link', defaultMessage: 'back to Topic' },
  summaryTitle: { id: 'snapshot.summary.title', defaultMessage: 'Summary of Your New Snapshot' },
  summaryMessage: { id: 'snapshot.summary.text', defaultMessage: 'You have made some changes that you can only see if you generate a new Snapshot.  Here\'s a summary of those changes:' },
  snapshotFailed: { id: 'snapshot.generate.failed', defaultMessage: 'Sorry, but we failed to start generating the snapshot' },
};

const SnapshotHome = props => (
  <div className="snapshot-builder-home">
    <BackLinkingControlBar message={localMessages.backToTopicLink} linkTo={`/topics/${props.params.topicId}/summary`} />
    <Grid>
      <Row>
        <Col lg={10}>
          <h1><SnapshotIcon /><FormattedMessage {...localMessages.title} /></h1>
          <FormattedHTMLMessage {...localMessages.aboutText} />
        </Col>
      </Row>
      <Row>
        <Col lg={3} xs={12}>
          <br />
          <Link to={`/topics/${props.params.topicId}/snapshot/foci`}>
            <AppButton label={props.intl.formatMessage(localMessages.fociLink)} primary />
          </Link>
          <br />
          <br />
          <Link to={`/topics/${props.params.topicId}/snapshot/timespans`}>
            <AppButton label={props.intl.formatMessage(localMessages.timespanLink)} primary />
          </Link>
        </Col>
        <Col lg={7} xs={12}>
          <DataCard inline>
            <h2><FormattedMessage {...localMessages.summaryTitle} /></h2>
            <p><FormattedHTMLMessage {...localMessages.summaryMessage} /></p>
            <ComingSoon />
            <AppButton label={props.intl.formatMessage(messages.snapshotGenerate)} primary onClick={props.handleGenerateSnapshotRequest} />
          </DataCard>
        </Col>
      </Row>
    </Grid>
  </div>
);

SnapshotHome.propTypes = {
  intl: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  children: PropTypes.node,
  // from state
  topicId: PropTypes.number.isRequired,
  // from dispatch
  handleGenerateSnapshotRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleGenerateSnapshotRequest: () => {
    dispatch(generateSnapshot(ownProps.params.topicId))
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
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SnapshotHome
    )
  );
