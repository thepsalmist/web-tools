import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DataCard from '../../../common/DataCard';
import { DeleteButton, AddButton } from '../../../common/IconButton';
import messages from '../../../../resources/messages';
import AppButton from '../../../common/AppButton';

const localMessages = {
  info: { id: 'source.suggestion.info', defaultMessage: 'Suggested as "{name}" by {user} on {date} because "{reason}".' },
  suggestedCollections: { id: 'source.suggestion.collections', defaultMessage: 'Suggested for collections: "{collections}".' },
  markSummary: { id: 'source.suggestion.markSummary', defaultMessage: 'Marked as {status} by {user} on {date} because "{reason}".' },
  notMarked: { id: 'source.suggestion.notMarked', defaultMessage: 'Not reviewed yet.' },
  reject: { id: 'source.suggestion.reject', defaultMessage: 'Reject' },
  approve: { id: 'source.suggestion.accept', defaultMessage: 'Approve' },
  approveTitle: { id: 'source.suggestion.approve.title', defaultMessage: 'Approve' },
  approveIntro: { id: 'source.suggestion.approve.intro', defaultMessage: 'Make a note of why you are approving {url}. This will be emailed to {email}.' },
  rejectTitle: { id: 'source.suggestion.reject.title', defaultMessage: 'Reject' },
  rejectIntro: { id: 'source.suggestion.reject.intro', defaultMessage: 'Make a note of why you are rejecting {url}. This will be emailed to {email}.' },
  reasonHintText: { id: 'source.suggestion.reasonHintText', defaultMessage: 'Note why you\'re making this decision' },
};

class SourceSuggestion extends React.Component {
  state = {
    showApproveDialog: false,
    showRejectDialog: false,
  }

  render() {
    const { suggestion, onReject, onApprove, markable } = this.props;
    const { formatDate, formatMessage } = this.props.intl;
    let reviewContent = null;
    if (suggestion.mark_auth_users_id) {
      reviewContent = (
        <p>
          <FormattedMessage
            {...localMessages.markSummary}
            values={{
              status: suggestion.status,
              user: suggestion.mark_auth_users_id,
              reason: suggestion.mark_reason,
              date: formatDate(suggestion.dateMarked),
            }}
          />
        </p>
      );
    } else {
      reviewContent = (<p><FormattedMessage {...localMessages.notMarked} /></p>);
    }
    const rejectReasonInputId = `rejectReason-${suggestion.media_suggestions_id}`;
    const approveReasonInputId = `approveReason-${suggestion.media_suggestions_id}`;
    let actions = null;
    let dialogs = null;
    if (markable) {
      actions = (
        <div className="actions">
          <DeleteButton
            tooltip={formatMessage(localMessages.reject)}
            onClick={(evt) => { evt.preventDefault(); this.setState({ showRejectDialog: true }); }}
          />
          <AddButton
            tooltip={formatMessage(localMessages.approve)}
            onClick={(evt) => { evt.preventDefault(); this.setState({ showApproveDialog: true }); }}
          />
        </div>
      );
      dialogs = (
        <div className="source-suggestion-confirmation">
          <Dialog
            className="app-dialog"
            modal="false"
            open={this.state.showApproveDialog}
            onClose={() => this.setState({ showApproveDialog: false })}
          >
            <DialogTitle><FormattedMessage {...localMessages.approveTitle} /></DialogTitle>
            <DialogContent>
              <FormattedMessage {...localMessages.approveIntro} values={{ url: suggestion.url, email: suggestion.email }} />
              <TextField
                name="rejectReason"
                id={approveReasonInputId}
                fullWidth
                hintText={formatMessage(localMessages.reasonHintText)}
              />
            </DialogContent>
            <DialogActions>
              <AppButton
                label={formatMessage(messages.cancel)}
                onClick={() => this.setState({ showApproveDialog: false })}
              />
              <AppButton
                label={formatMessage(localMessages.approve)}
                primary
                onClick={() => {
                  this.setState({ showApproveDialog: false });
                  onApprove(suggestion, document.getElementById(approveReasonInputId).value);
                }}
              />
            </DialogActions>
          </Dialog>
          <Dialog
            className="app-dialog"
            modal="false"
            open={this.state.showRejectDialog}
            onClose={() => this.setState({ showRejectDialog: false })}
          >
            <DialogTitle><FormattedMessage {...localMessages.rejectTitle} /></DialogTitle>
            <DialogContent>
              <FormattedMessage {...localMessages.rejectIntro} values={{ url: suggestion.url, email: suggestion.email }} />
              <TextField
                name="rejectReason"
                id={rejectReasonInputId}
                fullWidth
                hintText={formatMessage(localMessages.reasonHintText)}
              />
            </DialogContent>
            <DialogActions>
              <AppButton
                label={formatMessage(messages.cancel)}
                onClick={() => this.setState({ showRejectDialog: false })}
              />
              <AppButton
                label={formatMessage(localMessages.reject)}
                primary
                onClick={() => {
                  this.setState({ showRejectDialog: false });
                  onReject(suggestion, document.getElementById(rejectReasonInputId).value);
                }}
              />
            </DialogActions>
          </Dialog>
        </div>
      );
    }
    return (
      <div className="source-suggestion">
        <DataCard className={`source-suggestion source-suggestion-${suggestion.status}`}>
          {actions}
          <h2>{suggestion.url}</h2>
          <p>
            <b>{suggestion.status}</b> | <small><FormattedDate value={suggestion.dateMarked} /></small>
          </p>
          {(suggestion.tags_ids && suggestion.tags_ids.length > 0)
             && (
             <p>
               <FormattedMessage
                 {...localMessages.suggestedCollections}
                 values={{
                   collections: suggestion.tags_ids.map(tagId => tagId.label).join(', '),
                 }}
               />
             </p>
)}
          <p>
            <FormattedMessage
              {...localMessages.info}
              values={{
                name: suggestion.name,
                user: suggestion.email,
                date: formatDate(suggestion.dateSubmitted),
                reason: suggestion.reason,
              }}
            />
          </p>
          {reviewContent}
        </DataCard>
        {dialogs}
      </div>
    );
  }
}

SourceSuggestion.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  suggestion: PropTypes.object.isRequired,
  markable: PropTypes.bool.isRequired,
  onReject: PropTypes.func,
  onApprove: PropTypes.func,
};

export default
injectIntl(
  SourceSuggestion
);
