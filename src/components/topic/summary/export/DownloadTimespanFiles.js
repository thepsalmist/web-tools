import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import withSummary from '../../../common/hocs/SummarizedVizualization';
import messages from '../../../../resources/messages';

const localMessages = {
  title: { id: 'topic.summary.timespanDownload.title', defaultMessage: 'Download Timespan Files' },
  helpIntro: { id: 'topic.summary.timespanDownload.help.intro', defaultMessage: '<p>Quickly download CSVs of all the content in this timespan. This will respect the version, timespan, and subtopic you have selected. It will ignore any Story Filter you might be using. These files are automatically generated when you make a new version, so they download quickly.</p>' },
  none: { id: 'topic.summary.timespanDownload.none', defaultMessage: '<p><b>No files available for this timespan. Make a new version to generate some</b></p>' },
  unsupported: { id: 'topic.summary.timespanDownload.unsupported', defaultMessage: 'Your "{q}" query filter is not respected in these files.' },
  link: { id: 'topic.summary.timespanDownload.link', defaultMessage: '{name} - in {format} format ({size}MB) - ' },
  // user-friendly names for different type of maps
  rename_stories: { id: 'topic.summary.stories.name', defaultMessage: 'All Stories' },
  rename_media: { id: 'topic.summary.media.name', defaultMessage: 'All Media' },
  rename_story_links: { id: 'topic.summary.story_links.name', defaultMessage: 'Links between stories' },
  rename_medium_links: { id: 'topic.summary.medium_links.name', defaultMessage: 'Links between media' },
};

const DownloadTimespanFiles = ({ filters, files }) => {
  if (files.length === 0) {
    return <FormattedHTMLMessage {...localMessages.none} />;
  }
  return (
    <>
      {filters.q && (<FormattedMessage {...localMessages.unsupported} values={{ q: filters.q }} />)}
      <ul>
        {files.map((f, idx) => (
          <li key={idx}>
            {localMessages[`rename_${f.name}`] ? (<FormattedMessage {...localMessages[`rename_${f.name}`]} />) : f.name }
            &nbsp; &nbsp;
            <a target="_new" href={f.url}><FormattedMessage {...messages.download} /></a>
          </li>
        ))}
      </ul>
    </>
  );
};

DownloadTimespanFiles.propTypes = {
  // from parent
  filters: PropTypes.object.isRequired,
  files: PropTypes.array,
};

export default
injectIntl(
  withSummary(localMessages.title, localMessages.helpIntro)(
    DownloadTimespanFiles
  )
);
