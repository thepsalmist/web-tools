import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl } from 'react-intl';
// import ActiveFiltersContainer from './ActiveFiltersContainer';
// import FilterSelectorContainer from './FilterSelectorContainer';
import LinkWithFilters from '../LinkWithFilters';
import { filteredLinkTo } from '../../util/location';
import { HomeButton, EditButton /* FilterButton */ } from '../../common/IconButton';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
// import TimespanSelectorContainer from './timespans/TimespanSelectorContainer';
// import { REMOVE_FOCUS } from './FocusSelector';
import AboutTopicDialog from './AboutTopicDialog';

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
  topicHomepage: { id: 'topic.homepage', defaultMessage: 'Topic Summary' },
  jumpToExplorer: { id: 'topic.controlBar.jumpToExplorer', defaultMessage: 'Query on Explorer' },
};

const TopicControlBar = (props) => {
  const { topicId, filters, sideBarContent, setupJumpToExplorer, goToUrl } = props;
  const { formatMessage } = props.intl;

  return (
    <div className="controlbar controlbar-topic">
      <div className="main">
        <Grid>
          <Row>
            <Col lg={8} className="control-bar-settings left">
              <LinkWithFilters to={`/topics/${topicId}/summary`}>
                <HomeButton />
                <b><FormattedMessage {...localMessages.topicHomepage} /></b>
              </LinkWithFilters>
              <AboutTopicDialog />
              <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
                <LinkWithFilters to={`/topics/${topicId}/settings`}>
                  <EditButton
                    label={formatMessage(localMessages.settings)}
                    description={formatMessage(localMessages.changeSettingsDetails)}
                    onClick={() => goToUrl(`/topics/${topicId}/settings`, filters)}
                    id="modify-topic-settings"
                  />
                  <b><FormattedMessage {...localMessages.settings} /></b>
                </LinkWithFilters>
                <LinkWithFilters to={`/topics/${topicId}/permissions`} className="permissions">
                  <EditButton
                    label={formatMessage(localMessages.permissions)}
                    description={formatMessage(localMessages.changePermissionsDetails)}
                    onClick={() => goToUrl(`/topics/${topicId}/permissions`)}
                    id="modify-topic-permissions"
                  />
                  <b><FormattedMessage {...localMessages.permissions} /></b>
                </LinkWithFilters>
                <LinkWithFilters to={`/topics/${topicId}/versions`}>
                  <EditButton
                    label={formatMessage(localMessages.versionList)}
                    description={formatMessage(localMessages.viewVersionLists)}
                    onClick={() => goToUrl(`/topics/${topicId}/versions`)}
                    id="modify-topic-permissions"
                  />
                  <b><FormattedMessage {...localMessages.versionList} /></b>
                </LinkWithFilters>
              </Permissioned>
              {setupJumpToExplorer}
            </Col>
            <Col lg={4}>
              {sideBarContent}
            </Col>
          </Row>
        </Grid>
      </div>
    </div>
  );
};

TopicControlBar.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number,
  topic: PropTypes.object,
  location: PropTypes.object,
  filters: PropTypes.object.isRequired,
  sideBarContent: PropTypes.node,
  setupJumpToExplorer: PropTypes.func,
  goToUrl: PropTypes.func,
};


const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  topicInfo: state.topics.selected.info,
  topicId: parseInt(ownProps.topicId, 10),
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
