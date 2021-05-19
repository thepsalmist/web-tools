import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { discoverSourceSitemaps, abandonPreviewSourceSitemaps, retryPreviewSourceSitemaps,
  cancelPreviewSourceSitemaps, approvePreviewSourceSitemaps, rejectPreviewSourceSitemaps,
  downloadPreviewSourceSitemaps } from '../../../../actions/sourceActions';
import { updateFeedback } from '../../../../actions/appActions';
import AppButton from '../../../common/AppButton';
import ConfirmationDialog from '../../../common/ConfirmationDialog';
import IngestCardSuccess from './IngestCardSuccess';
import IngestCardPending from './IngestCardPending';
import IngestCardFail from './IngestCardFail';
import AbandonedIngestsTable from './AbandonedIngestsTable';
import SuccessfulIngestsTable from './SuccessfulIngestsTable';

const MSG_NAMESPACE = 'source.feeds.sitemaps';
const localMessages = {
  discover: { id: `${MSG_NAMESPACE}.discover`, defaultMessage: 'Discover New Sitemaps' },
  rejectDialogTitle: { id: `${MSG_NAMESPACE}.rejectDialogTitle`, defaultMessage: 'Reject Sitemap' },
  rejectDialogOk: { id: `${MSG_NAMESPACE}.rejectDialogOk`, defaultMessage: 'Reject Sitemap Ingest' },
  rejectDialogLabel: { id: `${MSG_NAMESPACE}.rejectDialogLabel`, defaultMessage: 'Tell us why this sitemap is rejected' },
  noPreviouslySuccessfulIngests: { id: `${MSG_NAMESPACE}.noPreviouslySuccessfulIngests`, defaultMessage: 'No previously successful ingests' },
  noPreviouslyAbandonedIngests: { id: `${MSG_NAMESPACE}.noPreviouslyAbandonedIngests`, defaultMessage: 'No abandoned ingests' },
  previouslySuccessfulIngestsTitle: { id: `${MSG_NAMESPACE}.previouslySuccessfulIngestsTitle`, defaultMessage: 'Previously Successful Ingests' },
  abandonedIngestsTitle: { id: `${MSG_NAMESPACE}.abandonedIngestsTitle`, defaultMessage: 'Abandoned Ingest Attempts' },
  pendingIngestsTitle: { id: `${MSG_NAMESPACE}.pendingIngestsTitle`, defaultMessage: 'Pending Sitemap Ingest' },
  downloadPreviewError: { id: `${MSG_NAMESPACE}.downloadPreviewError`, defaultMessage: 'Error downloading sitemap preview. Try again.' },
  rejectPreviewError: { id: `${MSG_NAMESPACE}.rejectPreviewError`, defaultMessage: 'Error rejecting sitemap preview. Try again.' },
  approvePreviewError: { id: `${MSG_NAMESPACE}.approvePreviewError`, defaultMessage: 'Error approving sitemap preview. Try again.' },
  cancelPreviewError: { id: `${MSG_NAMESPACE}.cancelPreviewError`, defaultMessage: 'Error canceling sitemap preview. Try again.' },
  retryPreviewError: { id: `${MSG_NAMESPACE}.retryPreviewError`, defaultMessage: 'Error retrying sitemap preview. Try again.' },
  abandonPreviewError: { id: `${MSG_NAMESPACE}.abandonPreviewError`, defaultMessage: 'Error abandoning sitemap preview. Try again.' },
  discoverPreviewError: { id: `${MSG_NAMESPACE}.discoverPreviewError`, defaultMessage: 'Error discoverying sitemap preview. Try again.' },
};

const STATUSES = {
  previewSuccess: 'preview_success',
  previewProcessing: 'preview_processing',
  previewFailed: 'preview_failed',
  ingestSuccess: 'ingest_success',
  ingestAbandoned: 'ingest_abandoned',
};

class SourceSitemapsContainer extends React.Component {
  state = {
    confirmRejectOpen: false,
    rejectedFeedId: undefined,
    rejectedReason: undefined,
  };

  handleDiscoverClick = () => {
    this.props.discoverSourceSitemaps();
  };

  handleRejectReasonChanged = (e) => {
    this.setState({
      rejectedReason: e.target.value,
    });
  }

  handleReject = (feedsId) => {
    this.setState({
      confirmRejectOpen: true,
      rejectedReason: undefined,
      rejectedFeedId: feedsId,
    });
  };

  handleRejectConfirm = () => {
    const { rejectedFeedId, rejectedReason } = this.state;
    this.props.rejectIngest(rejectedFeedId, rejectedReason);
    this.setState({
      confirmRejectOpen: false,
      rejectedFeedId: undefined,
      rejectedReason: undefined,
    });
  };

  handleRejectCancel = () => {
    this.setState({
      confirmRejectOpen: false,
      rejectedFeedId: undefined,
      rejectedReason: undefined,
    });
  };

  handleDownload = (feedsId) => {
    this.props.downloadIngest(feedsId);
  };

  handleApprove = (feedsId) => {
    this.props.approveIngest(feedsId);
  };

  handelAbandon = (feedsId) => {
    this.props.abandonIngest(feedsId);
  };

  handleRetry = (feedsId) => {
    this.props.retryIngest(feedsId);
  };

  handleCancel = (feedsId) => {
    this.props.cancelIngest(feedsId);
  };

  render() {
    const { feeds } = this.props;
    const { formatMessage } = this.props.intl;
    const feedsByStatus = {};
    Object.keys(STATUSES).forEach(key => {
      feedsByStatus[STATUSES[key]] = feeds.filter(f => f.status === STATUSES[key]);
    });
    return (
      <>
        <ConfirmationDialog
          open={this.state.confirmRejectOpen}
          title={formatMessage(localMessages.rejectDialogTitle)}
          okText={formatMessage(localMessages.rejectDialogOk)}
          onOk={this.handleRejectConfirm}
          onCancel={this.handleRejectCancel}
        >
          <Grid container item>
            <TextField
              rows={4}
              label={formatMessage(localMessages.rejectDialogLabel)}
              variant="outlined"
              value={this.state.rejectedReason}
              onChange={this.handleRejectReasonChanged}
              multiline
              fullWidth
              required
            />
          </Grid>
        </ConfirmationDialog>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AppButton onClick={this.handleDiscoverClick}>
              <FormattedMessage {...localMessages.discover} />
            </AppButton>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12}>
              <h2><FormattedMessage {...localMessages.pendingIngestsTitle} /></h2>
            </Grid>
            <Grid container spacing={3} item xs={12}>
              {feedsByStatus[STATUSES.previewSuccess].map(feed => (
                <Grid item md={4} sm={6} xs={12} key={`preview-success-${feed.last_attempted_download_time}`}>
                  <IngestCardSuccess
                    onReject={() => this.handleReject(feed.feeds_id)}
                    onApprove={() => this.handleApprove(feed.feeds_id)}
                    onDownload={() => this.handleDownload(feed.feeds_id)}
                    date={feed.created_time}
                    lastFoundDate={feed.last_new_story_time}
                  />
                </Grid>
              ))}
              {feedsByStatus[STATUSES.previewProcessing].map(feed => (
                <Grid item md={4} sm={6} xs={12} key={`preview-processing-${feed.last_attempted_download_time}`}>
                  <IngestCardPending
                    onCancel={() => this.handleCancel(feed.feeds_id)}
                    date={feed.created_time}
                  />
                </Grid>
              ))}
              {feedsByStatus[STATUSES.previewFailed].map(feed => (
                <Grid item md={4} sm={6} xs={12} key={`preview-failed-${feed.last_attempted_download_time}`}>
                  <IngestCardFail
                    onAbandon={() => this.handelAbandon(feed.feeds_id)}
                    onRetry={() => this.handleRetry(feed.feeds_id)}
                    date={feed.created_time}
                    errorDetails={feed.status_details}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <h2><FormattedMessage {...localMessages.previouslySuccessfulIngestsTitle} /></h2>
            {feedsByStatus[STATUSES.ingestSuccess] && <SuccessfulIngestsTable rows={feedsByStatus[STATUSES.ingestSuccess]} />}
            {!feedsByStatus[STATUSES.ingestSuccess] && <Alert severity="info"><FormattedMessage {...localMessages.noPreviouslySuccessfulIngests} /></Alert>}
          </Grid>
          <Grid item xs={12}>
            <h2><FormattedMessage {...localMessages.abandonedIngestsTitle} /></h2>
            {feedsByStatus[STATUSES.ingestAbandoned] && <AbandonedIngestsTable rows={feedsByStatus[STATUSES.ingestAbandoned]} />}
            {!feedsByStatus[STATUSES.ingestSuccess] && <Alert severity="info"><FormattedMessage {...localMessages.noPreviouslyAbandonedIngests} /></Alert>}
          </Grid>
        </Grid>
      </>
    );
  }
}

SourceSitemapsContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  abandonIngest: PropTypes.func.isRequired,
  downloadIngest: PropTypes.func.isRequired,
  approveIngest: PropTypes.func.isRequired,
  rejectIngest: PropTypes.func.isRequired,
  cancelIngest: PropTypes.func.isRequired,
  retryIngest: PropTypes.func.isRequired,
  discoverSourceSitemaps: PropTypes.func.isRequired,
  sourceId: PropTypes.number.isRequired,
  feeds: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  sourceId: ownProps.sourceId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  downloadIngest: (feedId) => {
    dispatch(downloadPreviewSourceSitemaps(feedId)).then((results) => {
      if (results.feeds) {
        alert(results.status);
      } else {
        dispatch(
          updateFeedback({
            classes: 'error-notice',
            open: true,
            message: ownProps.props.intl.formatMessage(localMessages.downloadPreviewError),
          })
        );
      }
    });
  },
  approveIngest: (feedId) => {
    dispatch(approvePreviewSourceSitemaps(feedId)).then((results) => {
      if (results.feeds) {
        alert(results.status);
      } else {
        dispatch(
          updateFeedback({
            classes: 'error-notice',
            open: true,
            message: ownProps.props.intl.formatMessage(localMessages.approvePreviewError),
          })
        );
      }
    });
  },
  rejectIngest: (feedId, reason) => {
    dispatch(rejectPreviewSourceSitemaps(feedId, reason)).then((results) => {
      if (results.feeds) {
        alert(results.status);
      } else {
        dispatch(
          updateFeedback({
            classes: 'error-notice',
            open: true,
            message: ownProps.props.intl.formatMessage(localMessages.rejectPreviewError),
          })
        );
      }
    });
  },
  cancelIngest: (feedId) => {
    dispatch(cancelPreviewSourceSitemaps(feedId)).then((results) => {
      if (results.feeds) {
        alert(results.status);
      } else {
        dispatch(
          updateFeedback({
            classes: 'error-notice',
            open: true,
            message: ownProps.props.intl.formatMessage(localMessages.cancelPreviewError),
          })
        );
      }
    });
  },
  abandonIngest: (feedId) => {
    dispatch(abandonPreviewSourceSitemaps(feedId)).then((results) => {
      if (results.feeds) {
        alert(results.status);
      } else {
        dispatch(
          updateFeedback({
            classes: 'error-notice',
            open: true,
            message: ownProps.props.intl.formatMessage(localMessages.abandonPreviewError),
          })
        );
      }
    });
  },
  retryIngest: (feedId) => {
    dispatch(retryPreviewSourceSitemaps(feedId)).then((results) => {
      if (results.feeds) {
        alert(results.status);
      } else {
        dispatch(
          updateFeedback({
            classes: 'error-notice',
            open: true,
            message: ownProps.props.intl.formatMessage(localMessages.retruPreviewError),
          })
        );
      }
    });
  },
  discoverSourceSitemaps: () => {
    dispatch(discoverSourceSitemaps(ownProps.sourceId)).then((results) => {
      if (results.feeds) {
        alert(results.status);
      } else {
        dispatch(
          updateFeedback({
            classes: 'error-notice',
            open: true,
            message: ownProps.props.intl.formatMessage(localMessages.discoverPreviewError),
          })
        );
      }
    });
  },
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(SourceSitemapsContainer)
);
