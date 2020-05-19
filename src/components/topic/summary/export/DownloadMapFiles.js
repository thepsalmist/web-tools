import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import withSummary from '../../../common/hocs/SummarizedVizualization';
import LinkWithFilters from '../../LinkWithFilters';
import messages from '../../../../resources/messages';

const localMessages = {
  title: { id: 'topic.summary.mapDownload.title', defaultMessage: 'Download Media Link Maps' },
  helpIntro: { id: 'topic.summary.mapDownload.help.intro', defaultMessage: '<p>Anayzing the content in this topic as a network can help reveal clusters of content all using the same narrative.  Links Maps show how media sources are linking to each other.</p>' },
  helpTextDetails: { id: 'topic.summary.mapDownload.help.details', defaultMessage: '<p>Link maps are generated automatically by our system. If you don\'t see any here, make a small change and create a new version. That new version will include link maps for each timespan automatically.</p>' },
  none: { id: 'topic.summary.mapDownload.none', defaultMessage: '<p><b>No maps available for this timespan.</b></p>' },
  unsupported: { id: 'topic.summary.mapDownload.unsupported', defaultMessage: 'Sorry, but we can\'t generate link maps when you are using a query filter.  Remove your "{q}" query filter if you want to generate these maps.' },
  link: { id: 'topic.summary.mapDownload.link', defaultMessage: ' in {format} format ({size}MB) - ' },
  // user-friendly names for different type of maps
  rename_partisan_retweet: { id: 'topic.summary.partisan_retweet.name', defaultMessage: 'Colored by US partisanship' },
  rename_community: { id: 'topic.summary.community.name', defaultMessage: 'Colored by community detection' },
};

export const urlToMediaMap = (topicId, timespanId, mmf) => `/api/topics/${topicId}/map-files/${mmf.timespan_maps_id}?timespanId=${timespanId}`;

const DownloadMapFiles = (props) => {
  const { topicId, filters, files, intl } = props;
  let content;
  if (filters.q) {
    // maps generated with a q filter are not what people expect them to be, so don't support it
    content = (<FormattedMessage {...localMessages.unsupported} values={{ q: filters.q }} />);
  } else if (files.length === 0) {
    content = (
      <>
        <FormattedHTMLMessage {...localMessages.none} />
        <FormattedHTMLMessage {...localMessages.helpTextDetails} />
      </>
    );
  } else {
    content = (
      <ul>
        {files.map(mmf => (
          <li key={mmf.timespan_maps_id}>
            {localMessages[`rename_${mmf.options.color_by}`] ? (<FormattedMessage {...localMessages[`rename_${mmf.options.color_by}`]} />) : mmf.options.color_by }
            <FormattedMessage
              {...localMessages.link}
              values={{
                type: mmf.options.color_by,
                format: mmf.format,
                size: intl.formatNumber(mmf.content_length / 1000000, { maximumFractionDigits: 2 }),
              }}
            />
            &nbsp; &nbsp;
            <a href={urlToMediaMap(topicId, filters.timespanId, mmf)}><FormattedMessage {...messages.download} /></a>
            &nbsp; &nbsp;
            {(mmf.format === 'gexf') && (
              <LinkWithFilters to={`/topics/${topicId}/media-map/${mmf.timespan_maps_id}`}>
                <FormattedMessage {...messages.view} />
              </LinkWithFilters>
            )}
            {(mmf.format === 'svg') && (
              <a href={`${urlToMediaMap(topicId, filters.timespanId, mmf)}&download=0`} target="_new">
                <FormattedMessage {...messages.view} />
              </a>
            )}
          </li>
        ))}
      </ul>
    );
  }
  return content;
};

DownloadMapFiles.propTypes = {
  // from parent
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  files: PropTypes.array,
};

export default
injectIntl(
  withSummary(localMessages.title, localMessages.helpIntro, localMessages.helpTextDetails)(
    DownloadMapFiles
  )
);
