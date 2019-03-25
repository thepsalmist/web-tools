import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl } from 'react-intl';
import LinkWithFilters from '../LinkWithFilters';
import { filteredLinkTo } from '../../util/location';
import { HomeButton, EditButton } from '../../common/IconButton';
import TabbedChip from '../../common/TabbedChip';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import { TOPIC_SNAPSHOT_STATE_COMPLETED, TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING,
  TOPIC_SNAPSHOT_STATE_ERROR, TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED } from '../../../reducers/topics/selected/snapshots';

const localMessages = {
  permissions: { id: 'topic.changePermissions', defaultMessage: 'Permissions' },
  changePermissionsDetails: { id: 'topic.changePermissions.details', defaultMessage: 'Control who else can see and/or change this topic' },
  settings: { id: 'topic.changeSettings', defaultMessage: 'Settings' },
  changeSettingsDetails: { id: 'topic.changeSettings.details', defaultMessage: 'Edit this topic\'s configuration and visibility' },
  versionList: { id: 'topic.changeSettings', defaultMessage: 'Versions' },
  viewVersionLists: { id: 'topic.changeSettings', defaultMessage: 'View Versions' },
  filterTopic: { id: 'topic.filter', defaultMessage: 'Filter this Topic' },
  startedSpider: { id: 'topic.startedSpider', defaultMessage: 'Started a new spidering job for this topic' },
  summaryMessage: { id: 'snapshot.required', defaultMessage: 'You have made some changes that you can only see if you generate a new Snapshot. <a href="{url}">Generate one now</a>.' },
  topicHomepage: { id: 'topic.homepage', defaultMessage: 'Summary' },
  jumpToExplorer: { id: 'topic.controlBar.jumpToExplorer', defaultMessage: 'Query on Explorer' },

  latestNeedsAttention: { id: 'topic.version.latestNeedsAttention', defaultMessage: 'needs attention' },
  latestRunning: { id: 'topic.version.latestNeedsAttention', defaultMessage: 'running' },
  newerData: { id: 'topic.version.latestNeedsAttention', defaultMessage: 'newer data' },
};

const mostRecentSnapshotIs = (snapshots, topic, states) => {
  if (snapshots.length === 0) {
    return states.includes(topic.state);
  }
  return states.includes(snapshots[snapshots.length - 1].state);
};

const TopicControlBar = ({ filters, sideBarContent, topic, setupJumpToExplorer, goToUrl, snapshots, intl, selectedSnapshot }) => (
  <div className="controlbar controlbar-topic">
    <div className="main">
      <Grid>
        <Row>
          <Col lg={8} className="control-bar-settings left">
            <div className="controlbar-item">
              <LinkWithFilters to={`/topics/${topic.topics_id}/summary`}>
                <HomeButton />
                <b><FormattedMessage {...localMessages.topicHomepage} /></b>
              </LinkWithFilters>
            </div>
            <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
              <div className="controlbar-item">
                <LinkWithFilters to={`/topics/${topic.topics_id}/settings`}>
                  <EditButton
                    label={intl.formatMessage(localMessages.settings)}
                    description={intl.formatMessage(localMessages.changeSettingsDetails)}
                    onClick={() => goToUrl(`/topics/${topic.topics_id}/settings`, filters)}
                    id="modify-topic-settings"
                  />
                  <b><FormattedMessage {...localMessages.settings} /></b>
                </LinkWithFilters>
              </div>
              <div className="controlbar-item">
                <LinkWithFilters to={`/topics/${topic.topics_id}/permissions`} className="permissions">
                  <EditButton
                    label={intl.formatMessage(localMessages.permissions)}
                    description={intl.formatMessage(localMessages.changePermissionsDetails)}
                    onClick={() => goToUrl(`/topics/${topic.topics_id}/permissions`)}
                    id="modify-topic-permissions"
                  />
                  <b><FormattedMessage {...localMessages.permissions} /></b>
                </LinkWithFilters>
              </div>
              { setupJumpToExplorer && <div className="controlbar-item">{setupJumpToExplorer}</div> }
              <div className="controlbar-item">
                <LinkWithFilters to={`/topics/${topic.topics_id}/versions`}>
                  <EditButton
                    label={intl.formatMessage(localMessages.versionList)}
                    description={intl.formatMessage(localMessages.viewVersionLists)}
                    onClick={() => goToUrl(`/topics/${topic.topics_id}/versions`)}
                    id="modify-topic-permissions"
                  />
                  <b><FormattedMessage {...localMessages.versionList} /></b>
                  {mostRecentSnapshotIs(snapshots, topic, [TOPIC_SNAPSHOT_STATE_ERROR, TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED]) && (
                    <TabbedChip error message={localMessages.latestNeedsAttention} />
                  )}
                  {mostRecentSnapshotIs(snapshots, topic, [TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING]) && (
                    <TabbedChip message={localMessages.latestRunning} />
                  )}
                  {(selectedSnapshot)
                    && (selectedSnapshot.snapshots_id !== snapshots[snapshots.length - 1].snapshots_id)
                    && mostRecentSnapshotIs(snapshots, topic, [TOPIC_SNAPSHOT_STATE_COMPLETED])
                    && (<TabbedChip warning message={localMessages.newerData} />)
                  }
                </LinkWithFilters>
              </div>
            </Permissioned>
          </Col>
          <Col lg={4}>
            {sideBarContent}
          </Col>
        </Row>
      </Grid>
    </div>
  </div>
);

TopicControlBar.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  location: PropTypes.object,
  // from parent
  sideBarContent: PropTypes.node,
  setupJumpToExplorer: PropTypes.func,
  // from dispatch
  goToUrl: PropTypes.func,
  // from state
  topic: PropTypes.object,
  filters: PropTypes.object.isRequired,
  snapshots: PropTypes.array,
  selectedSnapshot: PropTypes.object,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topic: state.topics.selected.info,
  snapshots: state.topics.selected.snapshots.list,
  selectedSnapshot: state.topics.selected.snapshots.selected,
});

const mapDispatchToProps = dispatch => ({
  goToUrl: (url, filters) => {
    dispatch(push(filteredLinkTo(url, filters)));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    TopicControlBar
  )
);
