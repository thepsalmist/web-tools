import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import messages from '../../../resources/messages';
import SourceOrCollectionWidget from '../../common/SourceOrCollectionWidget';

const localMessages = {
  title: { id: 'topic.info.title', defaultMessage: 'Version {versionNumber}: Seed Query' },
  seedQueryCount: { id: 'topic.info.seedQueryCount', defaultMessage: 'Your seed query matches {storyCount} stories already in our database.' },
  dates: { id: 'topic.info.dates', defaultMessage: 'Dates:' },
  datesData: { id: 'topic.info.datesData', defaultMessage: '{startDate} to {endDate}' },
};

const SeedQuerySummary = (props) => {
  const { topic, snapshot, currentVersion, intl } = props;
  let sourcesAndCollections = topic.media ? [...topic.media] : [];
  sourcesAndCollections = topic.media_tags ? [...sourcesAndCollections, ...topic.media_tags] : sourcesAndCollections;
  return (
    <div className="topic-info-sidebar">
      <h2><FormattedMessage {...localMessages.title} values={{ versionNumber: currentVersion }} /></h2>
      <p><FormattedMessage {...localMessages.seedQueryCount} values={{ storyCount: intl.formatNumber(topic.seed_query_story_count) }} /></p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicQueryProp} /></b>
        <code>{topic.solr_seed_query}</code>
      </p>
      <p>
        <b><FormattedMessage {...localMessages.dates} /></b>
        <br />
        <FormattedMessage {...localMessages.datesData} values={{ startDate: topic.start_date, endDate: topic.end_date }} />
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicSourceCollectionsProp} /></b>
      </p>
      {sourcesAndCollections.map(o => (
        <SourceOrCollectionWidget
          key={o.id || o.tags_id || o.media_id}
          object={o}
        />
      ))}
    </div>
  );
};

SeedQuerySummary.propTypes = {
  topic: PropTypes.object.isRequired,
  snapshot: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SeedQuerySummary);
