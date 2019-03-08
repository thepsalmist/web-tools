import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import SourceOrCollectionChip from '../common/SourceOrCollectionChip';
import messages from '../../resources/messages';

const localMessages = {
  storyCount: { id: 'topic.versionInfo.story.count', defaultMessage: 'Seed Stories' },
};
const TopicVersionInfo = (props) => {
  const { topicInfo } = props;
  const { formatMessage } = props.intl;
  return (
    <React.Fragment>
      <p>
        <b><FormattedMessage {...messages.topicPublicProp} /></b>: { topicInfo.is_public ? formatMessage(messages.yes) : formatMessage(messages.no) }
        <br />
        <b><FormattedMessage {...messages.topicStartDateProp} /></b>: {topicInfo.start_date}
        <br />
        <b><FormattedMessage {...messages.topicEndDateProp} /></b>: {topicInfo.end_date}
        <br />
        <b><FormattedMessage {...localMessages.storyCount} /></b>: {topicInfo.storyCount}
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicQueryProp} /></b>: <code>{topicInfo.solr_seed_query}</code>
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicSourceCollectionsProp} /></b>:
      </p>
      {topicInfo.sourcesAndCollections.map(object => (
        <SourceOrCollectionChip key={object.tags_id || object.media_id} object={object} />
      ))}
    </React.Fragment>
  );
};

TopicVersionInfo.propTypes = {
  intl: PropTypes.object.isRequired,
  topicInfo: PropTypes.object.isRequired,
};

export default injectIntl(TopicVersionInfo);
