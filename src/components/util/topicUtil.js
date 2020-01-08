import slugify from 'slugify';
import { serializeSearchTags } from '../../lib/explorerUtil';
import { PLATFORM_OPEN_WEB, PLATFORM_REDDIT } from '../../lib/platformTypes';

export const topicDownloadFilename = (topicName, filters) => (
  `${slugify(topicName)}-${filters.snapshotId}-${filters.timespanId}-${filters.focusId}`
);

export const formatPlatformOpenWebChannelData = (formValues) => {
  let data = {};
  if (formValues) {
    data = {
      'collections[]': formValues.media.filter(s => s.tags_id !== undefined).map(s => s.tags_id),
      'sources[]': formValues.media.filter(s => s.media_id !== undefined).map(s => s.media_id),
      'searches[]': serializeSearchTags(formValues.media.filter(s => s.customColl === true)),
    };
  } else {
    data = {
      'collections[]': [],
      'sources[]': [],
      'searches[]': [],
    };
  }
  return data;
};

// TODO: remove this and replace with formatPlatformOpenWebChasdfnnelData?
export const formatTopicOpenWebSourcesForQuery = (topicSourcesAndCollections) => {
  if (topicSourcesAndCollections) {
    return {
      channel: {
        'collections[]': topicSourcesAndCollections.map(s => s.tags_id),
        'sources[]': topicSourcesAndCollections.map(s => s.media_id),
        'searches[]': serializeSearchTags(topicSourcesAndCollections.filter(s => s.customColl === true)),
      },
    };
  }
  return {
    channel: {
      'collections[]': [],
      'sources[]': [],
      'searches[]': [],
    },
  };
};

export const formatTopicPreviewQuery = (topicQuery) => ({
  q: topicQuery.solr_seed_query,
  start_date: topicQuery.start_date,
  end_date: topicQuery.end_date,
  ...formatTopicOpenWebSourcesForQuery(topicQuery.sourcesAndCollections),
});

// while creating a topic, this can format the under-construction topic params propertly for a preview request
export const formatTopicPlatformPreviewQuery = (topicQuery, platform, query) => ({
  topics_id: topicQuery.topics_id,
  current_platform_type: platform,
  platform_query: query,
  start_date: topicQuery.start_date, // for querying purposes
  end_date: topicQuery.end_date,
  channel: topicQuery.channel,
});

export const formatTopicOpenWebPreviewQuery = (topicQuery) => {
  const channel = JSON.stringify(formatTopicOpenWebSourcesForQuery(topicQuery.channel));
  return {
    ...formatTopicPlatformPreviewQuery(topicQuery, PLATFORM_OPEN_WEB, topicQuery.query),
    channel,
    source: 'mediacloud',
  };
};

export const formatTopicRedditPreviewForQuery = (topicQuery) => ({
  ...formatTopicPlatformPreviewQuery(topicQuery, PLATFORM_REDDIT, topicQuery.query),
  source: 'pushshift', // TODO change - not sure what it should be
});

export const formatPlatformRedditChannelData = (formValues) => ({
  channel: formValues.channel.split(','),
});

export const formatPlatformTwitterChannelData = (formValues) => ({
  channel: formValues.crimson_hexagon_id,
});

export const timespanForDate = (date, timespans, period) => timespans.filter(t => t.period === period).find(t => date >= t.startDateObj && date <= t.endDateObj);

export const TEMP = 'temp';
