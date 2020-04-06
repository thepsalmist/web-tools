import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import withSummary from '../../../common/hocs/SummarizedVizualization';
import messages from '../../../../resources/messages';

const localMessages = {
  title: { id: 'topic.summary.snapshotDownload.title', defaultMessage: 'Download Snapshot Files (admin only)' },
  helpIntro: { id: 'topic.summary.snapshotDownload.help.intro', defaultMessage: '<p>Get snapshot files. All your subtopic, filter query, and timespan filters will be ignored.</p>' },
  helpTextDetails: { id: 'topic.summary.snapshotDownload.help.details', defaultMessage: '<p>Automatically generated.</p>' },
  none: { id: 'topic.summary.snapshotDownload.none', defaultMessage: '<p><b>No files available for this snapshot. Make a new version to generate some.</b></p>' },
};

const DownloadSnapshotFiles = ({ files }) => {
  if (files.length === 0) {
    return <FormattedHTMLMessage {...localMessages.none} />;
  }
  return (
    <ul>
      {files.map((f, idx) => (
        <li key={idx}>
          {f.name}
          &nbsp; &nbsp;
          <a target="_new" href={f.url}><FormattedMessage {...messages.download} /></a>
        </li>
      ))}
    </ul>
  );
};

DownloadSnapshotFiles.propTypes = {
  // from parent
  files: PropTypes.array,
};

export default
injectIntl(
  withSummary(localMessages.title, localMessages.helpIntro, localMessages.helpTextDetails)(
    DownloadSnapshotFiles
  )
);
