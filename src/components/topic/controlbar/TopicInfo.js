import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { PERMISSION_TOPIC_ADMIN } from '../../../lib/auth';
import messages from '../../../resources/messages';
import Permissioned from '../../common/Permissioned';
import SourceOrCollectionChip from '../../common/SourceOrCollectionChip';

const localMessages = {
  state: { id: 'topic.state', defaultMessage: 'State' },
  timespan: { id: 'topic.summary.timespan', defaultMessage: '<b>Timespan</b>: {start} to {end} ({period})' },
};

const TopicInfo = (props) => {
  const { topic } = props;
  const { formatMessage } = props.intl;
  let stateMessage = '';
  if (topic.state !== 'error') {
    stateMessage = topic.message; // show details to everyone if in normal state
  } else {
    // only show error ugly stack trace to admin users
    stateMessage = (<Permissioned onlyTopic={PERMISSION_TOPIC_ADMIN}>{topic.message}</Permissioned>);
  }
  let sourcesAndCollections = topic.media ? [...topic.media] : [];
  sourcesAndCollections = topic.media_tags ? [...sourcesAndCollections, ...topic.media_tags] : sourcesAndCollections;
  return (
    <React.Fragment>
      <p>{topic.description}</p>
      <p>
        <b><FormattedMessage {...localMessages.state} /></b>: {topic.state }
        <br />
        {stateMessage}
        <br />
        <b><FormattedMessage {...messages.topicPublicProp} /></b>: { topic.is_public ? formatMessage(messages.yes) : formatMessage(messages.no) }
        <br />
        <b><FormattedMessage {...messages.topicStartDateProp} /></b>: {topic.start_date}
        <br />
        <b><FormattedMessage {...messages.topicEndDateProp} /></b>: {topic.end_date}
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicQueryProp} /></b>
        <code>{topic.solr_seed_query}</code>
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicSourceCollectionsProp} /></b>
      </p>
      {sourcesAndCollections.map(object =>
        <SourceOrCollectionChip key={object.tags_id || object.media_id} object={object} autoLink />)
      }
      <p>
        <b><FormattedHTMLMessage {...messages.topicValidationProp} /></b>
        <code>{topic.pattern}</code>
      </p>
    </React.Fragment>
  );
};

TopicInfo.propTypes = {
  topic: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(TopicInfo);
