import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import withIntlForm from '../../../common/hocs/IntlForm';
import withAsyncData from '../../../common/hocs/AsyncDataContainer';
import AppButton from '../../../common/AppButton';
import messages from '../../../../resources/messages';
import ConfirmationDialog from '../../../common/ConfirmationDialog';
import { fetchFocalSetDefinitions, deleteFocalSetDefinition, deleteFocusDefinition, setTopicNeedsNewSnapshot, updateAndCreateNewTopicVersion, updateTopicVersionSubtopics }
  from '../../../../actions/topicActions';
import { updateFeedback } from '../../../../actions/appActions';
import FocalSetDefinitionSummary from './FocalSetDefinitionSummary';
import BackLinkingControlBar from '../../BackLinkingControlBar';
import FocusIcon from '../../../common/icons/FocusIcon';
import { getUserRoles, hasPermissions, PERMISSION_ADMIN } from '../../../../lib/auth';
import TopicVersionInfo from '../../TopicVersionInfo';

const localMessages = {
  focalSetsManageAbout: { id: 'focalSets.manage.about',
    defaultMessage: 'Every Subtopic is part of a Set. All the Subtopics within a Set share the same Technique. Our tools lets you compare Subtopics with a Set, but they don\'t let you easily compare Subtopics in different Sets.' },
  removeFocalSetTitle: { id: 'focalSets.manage.remove.title', defaultMessage: 'Really Remove this Set?' },
  removeFocalSetAbout: { id: 'focalSets.manage.remove.about', defaultMessage: '<p>Removing a Set means that the next Version you make will NOT include it.  This will NOT remove the Set from this Version.</p><p>Are you sure you want to remove this Set? All the Subtopic that are part of it will be removed from the next Snapshot as well.</p>' },
  removeOk: { id: 'focalSets.manage.remove.ok', defaultMessage: 'Remove It' },
  removeFocalSetSucceeded: { id: 'focalSets.manage.remove.succeeded', defaultMessage: 'Removed the Set' },
  removeFocalSetFailed: { id: 'focalSets.manage.remove.failed', defaultMessage: 'Sorry, but removing the Set failed :-(' },
  removeFocusSucceeded: { id: 'focus.remove.succeeded', defaultMessage: 'Removed the Subtopic' },
  removeFocusFailed: { id: 'focus.remove.failed', defaultMessage: 'Sorry, but removing the Subtopic failed :-(' },
  backToTopic: { id: 'backToTopic', defaultMessage: 'back to the topic' },
  createVersionAndStartSpider: { id: 'focalSets.manage.about', defaultMessage: 'Generate New Version' },
  updateTopicVersionSubtopics: { id: 'focalSets.manage.about', defaultMessage: 'Generate Into Current Version' },
};

class ManageFocalSetsContainer extends React.Component {
  state = {
    removeDialogOpen: false,
    idToRemove: null,
  };

  onFocusDefinitionDelete = (focusDef) => {
    const { topicId, handleDeleteFocusDefinition } = this.props;
    handleDeleteFocusDefinition(topicId, focusDef.focus_definitions_id);
  }

  onCancelDeleteFocalSetDefinition = () => {
    this.setState({ removeDialogOpen: false, idToRemove: null });
  }

  onDeleteFocalSetDefinition = () => {
    const { topicId, handleDeleteFocalSetDefinition } = this.props;
    handleDeleteFocalSetDefinition(topicId, this.state.idToRemove);
    this.setState({ removeDialogOpen: false, idToRemove: null });
  }

  handleDelete = (focalSetDef) => {
    this.setState({ removeDialogOpen: true, idToRemove: focalSetDef.focal_set_definitions_id });
  }

  render() {
    const { topicId, topicInfo, currentVersion, focalSetDefinitions, focalSetAll, user, handleCreateVersionAndStartSpider, handleGenerateIntoSameVersion } = this.props;
    const { formatMessage } = this.props.intl;
    let startSpideringOption = null;

    if (focalSetDefinitions.length !== focalSetAll.length) {
      startSpideringOption = (
        <div>
          <h3>Placeholder: Your topic has new subtopics - as an admin, you can either generate a brand new version, or generate these subtopics into the same version)</h3>
          <Link to={`/topics/${topicId}/summary/`}>
            <AppButton
              type="submit"
              label={formatMessage(localMessages.createVersionAndStartSpider)}
              onClick={() => handleCreateVersionAndStartSpider(topicId)}
              primary
            />
            {hasPermissions(getUserRoles(user), PERMISSION_ADMIN)
              && (
                <AppButton
                  label={formatMessage(localMessages.updateTopicVersionSubtopics)}
                  onClick={() => handleGenerateIntoSameVersion(topicId, currentVersion)}
                />
              )
            }
          </Link>
        </div>
      );
    }

    const removeConfirmationDialog = (
      <ConfirmationDialog
        open={this.state.removeDialogOpen}
        title={formatMessage(localMessages.removeFocalSetTitle)}
        okText={formatMessage(localMessages.removeOk)}
        onCancel={this.onCancelDeleteFocalSetDefinition}
        onOk={this.onDeleteFocalSetDefinition}
      >
        <FormattedHTMLMessage {...localMessages.removeFocalSetAbout} />
      </ConfirmationDialog>
    );
    return (
      <div className="manage-focal-sets">
        <BackLinkingControlBar message={localMessages.backToTopic} linkTo={`/topics/${topicId}/summary`} />
        <Grid>
          <Row>
            <Col lg={12}>
              <h1><FocusIcon /><FormattedMessage {...messages.manageFoci} /></h1>
            </Col>
          </Row>
          <Row>
            <Col lg={10} xs={12}>
              <p>
                <FormattedMessage {...localMessages.focalSetsManageAbout} />
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <form className="topic-version-subtopic-start-spider" name="topicVersionSpiderOrNotForm">
                {startSpideringOption}
              </form>
            </Col>
          </Row>
          <Row>
            <div className="topic-container">
              <TopicVersionInfo topicInfo={topicInfo} />
            </div>
          </Row>
          <Row>
            <Col lg={10} xs={12}>
              <div className="focal-set-definition-list">
                {focalSetDefinitions.map(focalSetDef => (
                  <FocalSetDefinitionSummary
                    key={focalSetDef.focal_set_definitions_id}
                    focalSetDefinition={focalSetDef}
                    onDelete={this.handleDelete}
                    onFocusDefinitionDelete={this.onFocusDefinitionDelete}
                    topicId={topicId}
                  />
                ))}
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <div id="create-foci-button">
                <Link to={`/topics/${topicId}/snapshot/foci/create`}>
                  <AppButton primary label={formatMessage(messages.addFocus)}>{formatMessage(messages.addFocus)}</AppButton>
                </Link>
              </div>
            </Col>
          </Row>
        </Grid>
        {removeConfirmationDialog}
      </div>
    );
  }
}

ManageFocalSetsContainer.propTypes = {
  // from composition
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  focalSetDefinitions: PropTypes.array.isRequired,
  focalSetAll: PropTypes.array.isRequired,
  currentVersion: PropTypes.number,
  user: PropTypes.object.isRequired,
  // from dispatch
  handleDeleteFocalSetDefinition: PropTypes.func.isRequired,
  handleDeleteFocusDefinition: PropTypes.func.isRequired,
  handleCreateVersionAndStartSpider: PropTypes.func.isRequired,
  handleGenerateIntoSameVersion: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
  topicInfo: state.topics.selected.info,
  focalSetDefinitions: state.topics.selected.focalSets.definitions.list,
  focalSetAll: state.topics.selected.focalSets.all.list,
  fetchStatus: state.topics.selected.focalSets.definitions.fetchStatus,
  currentVersion: state.topics.selected.snapshots.selected,
  user: state.user,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleDeleteFocalSetDefinition: (topicId, focalSetDefinitionId) => {
    dispatch(deleteFocalSetDefinition(topicId, focalSetDefinitionId))
      .then((results) => {
        if (results.success === 0) {
          dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(localMessages.removeFocalSetFailed) }));
        } else {
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.removeFocalSetSucceeded) }));
          dispatch(setTopicNeedsNewSnapshot(true));
          dispatch(fetchFocalSetDefinitions(topicId));
        }
      });
  },
  handleDeleteFocusDefinition: (topicId, focusDefinitionId) => {
    dispatch(deleteFocusDefinition(topicId, focusDefinitionId))
      .then((results) => {
        if (results.success === 0) {
          dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(localMessages.removeFocusFailed) }));
        } else {
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.removeFocusSucceeded) }));
          dispatch(setTopicNeedsNewSnapshot(true));
          dispatch(fetchFocalSetDefinitions(topicId));
        }
      });
  },
  handleCreateVersionAndStartSpider: (topicId) => {
    dispatch(updateAndCreateNewTopicVersion(topicId));
  },
  handleGenerateIntoSameVersion: (topicId, currentVersion) => {
    dispatch(updateTopicVersionSubtopics(topicId, currentVersion));
  },
});

const fetchAsyncData = (dispatch, { topicId }) => {
  dispatch(fetchFocalSetDefinitions(topicId));
};

export default
withIntlForm(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      ManageFocalSetsContainer
    )
  )
);
