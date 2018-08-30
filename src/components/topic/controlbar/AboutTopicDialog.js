import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Link from 'react-router/lib/Link';
import messages from '../../../resources/messages';
import AppButton from '../../common/AppButton';
import { HelpButton } from '../../common/IconButton';
import TopicInfo from './TopicInfo';

const localMessages = {
  aboutTopic: { id: 'topic.controlBar.about', defaultMessage: 'About this Topic' },
};

class AboutTopicDialog extends React.Component {

  state = {
    open: false,
  };

  handleClick = (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    this.setState({ open: true });
  };

  handleRemoveDialogClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { topicInfo } = this.props;
    const { formatMessage } = this.props.intl;
    const dialogActions = [
      <AppButton
        label={formatMessage(messages.ok)}
        onTouchTap={this.handleRemoveDialogClose}
      />,
    ];
    return (
      <div className="about-topic">
        <HelpButton
          onClick={this.handleModifyClick}
          tooltip={formatMessage(localMessages.aboutTopic)}
        />
        <Link to={`${formatMessage(localMessages.aboutTopic)}`} onClick={this.handleClick}>
          <b><FormattedMessage {...localMessages.aboutTopic} /></b>
        </Link>
        <Dialog
          open={this.state.open}
          onClose={this.handleRemoveDialogClose}
        >
          <DialogTitle><FormattedMessage {...localMessages.aboutTopic} /></DialogTitle>
          <DialogContent>
            <TopicInfo topic={topicInfo} />
          </DialogContent>
          <DialogActions>{dialogActions}</DialogActions>
        </Dialog>
      </div>
    );
  }

}

AboutTopicDialog.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from state
  topicInfo: PropTypes.object,
};

const mapStateToProps = state => ({
  topicInfo: state.topics.selected.info,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      AboutTopicDialog
    )
  );
