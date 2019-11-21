import slugify from 'slugify';
import { serializeSearchTags } from '../../lib/explorerUtil';
import { PLATFORM_OPEN_WEB, PLATFORM_REDDIT, PLATFORM_TWITTER } from '../../lib/platformTypes';

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

export const formatTopicPreviewQuery = (topicQuery) => ({
  q: topicQuery.solr_seed_query,
  start_date: topicQuery.start_date,
  end_date: topicQuery.end_date,
  ...formatTopicOpenWebSourcesForQuery(topicQuery.sourcesAndCollections),
});

// while creating a topic, this can format the under-construction topic params propertly for a preview request

// while creating a topic, this can format the under-construction topic params propertly for a preview request
export const formatTopicPlatformPreviewQuery = (topicQuery, platform, query) => ({
  current_platform_type: platform,
  platform_query: query,
  start_date: topicQuery.start_date,
  end_date: topicQuery.end_date,
});

export const formatTopicOpenWebPreviewQuery = (topicQuery, query) => ({
  ...formatTopicPlatformPreviewQuery(topicQuery, PLATFORM_OPEN_WEB, query),
  source: 'mediacloud',
  channel: { ...formatTopicOpenWebSourcesForQuery(topicQuery.sourcesAndCollections) },
});

export const formatTopicRedditPreviewForQuery = (topicQuery) => ({
  ...formatTopicPlatformPreviewQuery(topicQuery, PLATFORM_REDDIT, topicQuery.currentQuery),
  source: PLATFORM_REDDIT, // TODO change
  channel: topicQuery.channel,
});

export const formatTopicTwitterPreviewForQuery = (topicQuery) => ({
  ...formatTopicPlatformPreviewQuery(topicQuery, PLATFORM_TWITTER, topicQuery.currentQuery),
  source: PLATFORM_TWITTER, // TODO change
  channel: topicQuery.channel,
});

export const TEMP = 'temp';
