import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../../common/hocs/AsyncContainer';
import { fetchStoryCountByQuery } from '../../../../actions/topicActions';
import withDescription from '../../../common/hocs/DescribedDataCard';
import DataCard from '../../../common/DataCard';
import BubbleRowChart from '../../../vis/BubbleRowChart';
import { getBrandDarkColor } from '../../../../styles/colors';
import messages from '../../../../resources/messages';
import { updateFeedback } from '../../../../actions/appActions';
import { WarningNotice } from '../../../common/Notice';
import { MAX_RECOMMENDED_STORIES, WARNING_LIMIT_RECOMMENDED_STORIES, MIN_RECOMMENDED_STORIES } from '../../../../lib/formValidators';
import { hasPermissions, getUserRoles, PERMISSION_ADMIN } from '../../../../lib/auth';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-keyword-preview-story-total';


const localMessages = {
  title: { id: 'topic.create.preview.storyCount.title', defaultMessage: 'Seed Stories' },
  descriptionIntro: { id: 'topic.create.preview.storyCount.help.into',
    defaultMessage: "Your topic can include up to 100,000 stories. This includes the stories we already have, and the stories we will spider once you create the topic. Spidering can add anywhere from 0 to 4 times the total number of stories, so be careful that you don't include too many seed stories.",
  },
  totalRolloverLabel: { id: 'topic.create.preview.storyCount.total', defaultMessage: 'All Stories: {limit} stories' },
  filteredLabel: { id: 'topic.create.preview.storyCount.matching', defaultMessage: 'Queried Seed Stories' },
  totalLabel: { id: 'topic.create.preview.storyCount.total', defaultMessage: 'Max {limit} Total Stories' },
  adminTotalLabel: { id: 'topic.create.preview.storyCount.adminTotal', defaultMessage: 'Maximum Stories' },
  notEnoughStories: { id: 'topic.create.notenough', defaultMessage: 'You need to select a minimum of 500 seed stories.' },
  tooManyStories: { id: 'topic.create.toomany', defaultMessage: 'You need to select less than {limit} seed stories. Go back and make a more focused query, choose a shorter timespan, or fewer media sources.' },
  warningLimitStories: { id: 'topic.create.warningLimit', defaultMessage: 'With this many seed stories, it is likely that the spidering will cause you to run into your 100,000 story limit. Try searching over a narrower time period, or for more specific keywords.' },
};

class TopicStoryCountPreview extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { query, fetchData, user } = this.props;
    if (nextProps.query !== query) {
      fetchData(nextProps.query, user);
    }
  }
  render() {
    const { count, user, query } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    const maxStories = parseInt(query.max_stories, 10);
    let bubbleText;
    let bubbleRolloverText;
    if (hasPermissions(getUserRoles(user), PERMISSION_ADMIN)) {
      bubbleText = formatMessage(localMessages.adminTotalLabel, { limit: maxStories });
      bubbleRolloverText = formatMessage(localMessages.totalRolloverLabel, { limit: maxStories });
    } else {
      bubbleText = formatMessage(localMessages.totalLabel, { limit: MAX_RECOMMENDED_STORIES });
      bubbleRolloverText = formatNumber(localMessages.totalRolloverLabel, { limit: MAX_RECOMMENDED_STORIES });
    }
    let content = null;
    let storySizeWarning = null;
    if (count !== null) {
      const data = [  // format the data for the bubble chart help
        {
          value: count,
          fill: getBrandDarkColor(),
          aboveText: formatMessage(localMessages.filteredLabel),
          aboveTextColor: 'rgb(255,255,255)',
          rolloverText: `${formatMessage(localMessages.filteredLabel)}: ${formatNumber(count)} stories`,
        },
        {
          value: maxStories,
          aboveText: bubbleText,
          rolloverText: bubbleRolloverText,
        },
      ];

      if (count > MAX_RECOMMENDED_STORIES && !hasPermissions(getUserRoles(user), PERMISSION_ADMIN)) { // ADMIN CHECK
        storySizeWarning = (<WarningNotice><FormattedHTMLMessage {...localMessages.tooManyStories} values={{ limit: MAX_RECOMMENDED_STORIES }} /></WarningNotice>);
      } else if (count > maxStories && hasPermissions(getUserRoles(user), PERMISSION_ADMIN)) { // ADMIN CHECK
        storySizeWarning = (<WarningNotice><FormattedHTMLMessage {...localMessages.tooManyStories} values={{ limit: maxStories }} /></WarningNotice>);
      } else if (count > 0.75 * MAX_RECOMMENDED_STORIES) {
        storySizeWarning = (<WarningNotice><FormattedHTMLMessage {...localMessages.warningLimitStories} /></WarningNotice>);
      } else if ((count < MIN_RECOMMENDED_STORIES) && !hasPermissions(getUserRoles(user), PERMISSION_ADMIN)) {
        storySizeWarning = (<WarningNotice><FormattedHTMLMessage {...localMessages.notEnoughStories} /></WarningNotice>);
      }
      content = (<BubbleRowChart
        data={data}
        padding={30}
        domId={BUBBLE_CHART_DOM_ID}
        width={750}
      />);
    }
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
        </h2>
        {storySizeWarning}
        {content}
      </DataCard>
    );
  }
}

TopicStoryCountPreview.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  query: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  count: PropTypes.number,
  fetchStatus: PropTypes.string.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.create.preview.matchingStoryCounts.fetchStatus,
  count: state.topics.create.preview.matchingStoryCounts.count,
  user: state.user,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (query, user) => {
    const infoForQuery = {
      q: query.solr_seed_query,
      start_date: query.start_date,
      end_date: query.end_date,
    };
    infoForQuery['collections[]'] = [];
    infoForQuery['sources[]'] = [];

    if ('sourcesAndCollections' in query) {  // in FieldArrays on the form
      infoForQuery['collections[]'] = query.sourcesAndCollections.map(s => s.tags_id);
      infoForQuery['sources[]'] = query.sourcesAndCollections.map(s => s.media_id);
    }
    dispatch(fetchStoryCountByQuery(infoForQuery))
      .then((result) => {
        if (!hasPermissions(getUserRoles(user), PERMISSION_ADMIN)) {  // only apply checks to non-admins
          if (result.count > MAX_RECOMMENDED_STORIES) {
            dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(localMessages.tooManyStories) }));
          } else if (result.count < MAX_RECOMMENDED_STORIES && result.count > WARNING_LIMIT_RECOMMENDED_STORIES) {
            dispatch(updateFeedback({ classes: 'warning-notice', open: true, message: ownProps.intl.formatMessage(localMessages.warningLimitStories) }));
          } else if (result.count < MIN_RECOMMENDED_STORIES) {
            dispatch(updateFeedback({
              classes: 'error-notice',
              open: true,
              message: ownProps.intl.formatMessage(localMessages.notEnoughStories),
            }));
          }
        }
      });
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.query, stateProps.user);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
       withDescription(localMessages.descriptionIntro, [messages.storyCountHelpText])(
        withAsyncFetch(
          TopicStoryCountPreview
        )
      )
    )
  );
