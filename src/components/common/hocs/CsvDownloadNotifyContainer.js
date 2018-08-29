import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import messages from '../../../resources/messages';
import { updateFeedback } from '../../../actions/appActions';

/**
 * Wrap any component that wants to show a notification about a CSV download starting. This passes
 * a `notifyOfCsvDownload` helper to the child component, which can accept a URL to link to. If that url
 * is passed in, the notification shows that as a link for more details about the download.
 */
const withCsvDownloadNotifyContainer = (ChildComponent) => {
  const CsvDownloadNotifyContainer = props => (
    <div className="csv-download-notifier">
      <ChildComponent {...props} notifyOfCsvDownload={props.notifyOfCsvDownload} />
    </div>
  );

  CsvDownloadNotifyContainer.propTypes = {
    intl: PropTypes.object.isRequired,
    notifyOfCsvDownload: PropTypes.func.isRequired,
  };

  const mapDispatchToProps = (dispatch, ownProps) => ({
    notifyOfCsvDownload: (urlToDetails) => {  // can handle case with no URL to show for details about the download
      const htmlMessage = ownProps.intl.formatMessage(messages.currentlyDownloadingCsv);
      dispatch(updateFeedback({
        classes: 'info-notice',
        open: true,
        message: htmlMessage,
        action: (urlToDetails) ? ownProps.intl.formatHTMLMessage(messages.learnMoreAboutColumnsCsv) : undefined,
        onActionClick: (urlToDetails) ? () => {
          const win = window.open(urlToDetails, '_blank');
          win.focus();
        } : undefined,
      }));
    },
  });

  return connect(null, mapDispatchToProps)(
    injectIntl(
      CsvDownloadNotifyContainer
    )
  );
};

export default withCsvDownloadNotifyContainer;
