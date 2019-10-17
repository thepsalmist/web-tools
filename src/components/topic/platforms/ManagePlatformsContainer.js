import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import AppButton from '../../common/AppButton';
import messages from '../../../resources/messages';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import { deleteTopicPlatform, setTopicNeedsNewSnapshot, fetchTopicPlatforms } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';
// import BackLinkingControlBar from '../BackLinkingControlBar';
import NeedsNewVersionWarning from '../versions/NeedsNewVersionWarning';
import LinkWithFilters from '../LinkWithFilters';
// import { filteredLinkTo } from '../../util/location';

const localMessages = {
  listTitle: { id: 'platform.list.title', defaultMessage: 'Subtopic Details' },
  platformManageAbout: { id: 'platform.manage.about',
    defaultMessage: 'empty' },
  removePlatform: { id: 'platform.manage.remove', defaultMessage: 'Remove Platform' },
  removeOk: { id: 'platform.manage.remove.ok', defaultMessage: 'Remove It' },
  removePlatformSucceeded: { id: 'platform.manage.remove.succeeded', defaultMessage: 'Removed the Platform' },
  removePlatformFailed: { id: 'platform.manage.remove.failed', defaultMessage: 'Sorry, but removing the platform failed :-(' },
  backToTopic: { id: 'backToTopic', defaultMessage: 'back to the topic' },
};

class ManagePlatformsContainer extends React.Component {
  state = {
    removeDialogOpen: false,
    // idToEdit: null,
    idToRemove: null,
  };

  onCancelDeletePlatform = () => {
    this.setState({ removeDialogOpen: false, idToRemove: null });
  }

  onDeletePlatform = () => {
    const { topicId, handleDeletePlatform } = this.props;
    handleDeletePlatform(topicId, this.state.idToRemove);
    this.setState({ removeDialogOpen: false, idToRemove: null });
  }

  onEditPlatform = () => {
    // filteredLinkTo link to edit wizard
  }

  onNewPlatform = () => {
    // filteredLinkTo link to edit wizard
  }

  handleDelete = (platformId) => {
    this.setState({ removeDialogOpen: true, idToRemove: platformId });
  }

  render() {
    const { topicId, platforms } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <>
        <NeedsNewVersionWarning />
        <div className="manage-focal-sets">
          <Grid>
            <Row>
              <Col lg={10} xs={12}>
                <p>
                  <FormattedMessage {...localMessages.platformManageAbout} />
                </p>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <div id="create-foci-button">
                  <LinkWithFilters to={`/topics/${topicId}/snapshot/foci/create`}>
                    <AppButton primary label={messages.addFocus} />
                  </LinkWithFilters>
                </div>
              </Col>
            </Row>
          </Grid>
          <ConfirmationDialog
            open={this.state.removeDialogOpen}
            title={formatMessage(localMessages.removePlatform)}
            okText={formatMessage(localMessages.removeOk)}
            onCancel={this.onCancelDeletePlatform}
            onOk={this.onDeletePlatform}
          >
            <FormattedHTMLMessage {...localMessages.removePlatform} />
          </ConfirmationDialog>
        </div>
      </>
    );
  }
}

ManagePlatformsContainer.propTypes = {
  // from composition
  topicId: PropTypes.number.isRequired,
  intl: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  platforms: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  handleDeletePlatform: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
  platforms: state.topics.selected.platforms.all.list,
  fetchStatus: state.topics.selected.platforms.all.fetchStatus,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleDeletePlatform: (topicId, platformId) => {
    dispatch(deleteTopicPlatform(topicId, platformId))
      .then((results) => {
        if (results.success === 0) {
          dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(localMessages.removePlatformFailed) }));
        } else {
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.removePlatformSucceeded) }));
          dispatch(setTopicNeedsNewSnapshot(true));
          dispatch(fetchTopicPlatforms(topicId));
        }
      });
  },
});

const fetchAsyncData = (dispatch, { topicId }) => {
  dispatch(fetchTopicPlatforms(topicId));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      ManagePlatformsContainer
    )
  )
);
