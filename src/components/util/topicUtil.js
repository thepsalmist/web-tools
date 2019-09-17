import slugify from 'slugify';
import { serializeSearchTags } from '../../lib/explorerUtil';

export const topicDownloadFilename = (topicName, filters) => (
  `${slugify(topicName)}-${filters.snapshotId}-${filters.timespanId}-${filters.focusId}`
);

// while creating a topic, this can format the under-construction topic params propertly for a preview request
export const formatTopicPreviewQuery = (topicQuery) => {
  const infoForQuery = {
    q: topicQuery.solr_seed_query,
    start_date: topicQuery.start_date,
    end_date: topicQuery.end_date,
  };
  infoForQuery['collections[]'] = [];
  infoForQuery['sources[]'] = [];
  infoForQuery['searches[]'] = [];
  if ('sourcesAndCollections' in topicQuery) { // in FieldArrays on the form
    infoForQuery['collections[]'] = topicQuery.sourcesAndCollections.map(s => s.tags_id);
    infoForQuery['sources[]'] = topicQuery.sourcesAndCollections.map(s => s.media_id);
    infoForQuery['searches[]'] = serializeSearchTags(topicQuery.sourcesAndCollections.filter(s => s.customColl === true));
  }
  return infoForQuery;
};

export const TEMP = 'temp';
