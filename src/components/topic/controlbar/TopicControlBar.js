import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl } from 'react-intl';
// import ActiveFiltersContainer from './ActiveFiltersContainer';
// import FilterSelectorContainer from './FilterSelectorContainer';
import LinkWithFilters from '../LinkWithFilters';
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

  filterTopic: { id: 'topic.filter', defaultMessage: 'Filter this Topic' },
  startedSpider: { id: 'topic.startedSpider', defaultMessage: 'Started a new spidering job for this topic' },
  summaryMessage: { id: 'snapshot.required', defaultMessage: 'You have made some changes that you can only see if you generate a new Snapshot. <a href="{url}">Generate one now</a>.' },
  topicHomepage: { id: 'topic.homepage', defaultMessage: 'Topic Summary' },
  jumpToExplorer: { id: 'topic.controlBar.jumpToExplorer', defaultMessage: 'Query on Explorer' },
};

const TopicControlBar = (props) => {
  const { topicId, sideBarContent, setupJumpToExplorer, goToUrl } = props;
  const { formatMessage } = props.intl;

  return (
    <div className="controlbar controlbar-topic">
      <div className="main">
        <Grid>
          <Row>
            <Col lg={6} className="left">
              <LinkWithFilters to={`/topics/${topicId}/summary`}>
                <HomeButton />
                <b><FormattedMessage {...localMessages.topicHomepage} /></b>
              </LinkWithFilters>
              <AboutTopicDialog />
              <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
                <EditButton
                  label={formatMessage(localMessages.settings)}
                  description={formatMessage(localMessages.changeSettingsDetails)}
                  onClick={() => goToUrl(`/topics/${topicId}/edit`)}
                  id="modify-topic-settings"
                />
                <EditButton
                  label={formatMessage(localMessages.permissions)}
                  description={formatMessage(localMessages.changePermissionsDetails)}
                  onClick={() => goToUrl(`/topics/${topicId}/edit`)}
                  id="modify-topic-settings"
                />
              </Permissioned>
              {setupJumpToExplorer}
            </Col>
            {sideBarContent}
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
  goToUrl: (url) => {
    dispatch(push(url));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    TopicControlBar
  )
);
