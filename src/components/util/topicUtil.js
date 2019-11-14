import slugify from 'slugify';
import { serializeSearchTags } from '../../lib/explorerUtil';

export const topicDownloadFilename = (topicName, filters) => (
  `${slugify(topicName)}-${filters.snapshotId}-${filters.timespanId}-${filters.focusId}`
);

export const formatTopicOpenWebSourcesForQuery = (topicSourcesAndCollections) => {
  if (topicSourcesAndCollections) {
    return {
      'collections[]': topicSourcesAndCollections.map(s => s.tags_id),
      'sources[]': topicSourcesAndCollections.map(s => s.media_id),
      'searches[]': serializeSearchTags(topicSourcesAndCollections.filter(s => s.customColl === true)),
    };
  }
  return {
    'collections[]': [],
    'sources[]': [],
    'searches[]': [],
  };
};

// while creating a topic, this can format the under-construction topic params propertly for a preview request
export const formatTopicPreviewQuery = (topicQuery) => ({
  q: topicQuery.solr_seed_query,
  start_date: topicQuery.start_date,
  end_date: topicQuery.end_date,
  ...formatTopicOpenWebSourcesForQuery(topicQuery.sourcesAndCollections),
});

// while creating a topic, this can format the under-construction topic params propertly for a preview request
export const formatTopicPlatformPreviewQuery = (topicQuery, platform, query, source) => ({
  current_platform_type: platform,
  platform_query: query,
  start_date: topicQuery.start_date,
  end_date: topicQuery.end_date,
  source,
});

export const TEMP = 'temp';
