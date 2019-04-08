import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import AppButton from '../../../common/AppButton';
import { needsNewVersion } from '../../versions/NeedsNewVersionWarning';
import FocalSetSummary from './FocalSetSummary';
import FocalSetDefinitionSummary from './FocalSetDefinitionSummary';
import { topicSnapshotSpider } from '../../../../actions/topicActions';
import { PERMISSION_ADMIN } from '../../../../lib/auth';
import Permissioned from '../../../common/Permissioned';
import TabbedChip from '../../../common/TabbedChip';
import { updateFeedback } from '../../../../actions/appActions';

const localMessages = {
  createVersionAndStartSpider: { id: 'focalSets.manage.about', defaultMessage: 'Generate New Version' },
  updateTopicVersionSubtopics: { id: 'focalSets.manage.about', defaultMessage: 'Generate Into Current Version' },
  versionDiffTitle: { id: 'focalSets.list.versionDiffTitle', defaultMessage: 'You\'ve Made Changes' },
  applyChanges: { id: 'focalSets.list.applyChanges', defaultMessage: 'apply your changes' },
  failed: { id: 'focalSets.save.failed', defaultMessage: 'Sorry, something went wrong!' },
  worked: { id: 'focalSets.save.worked', defaultMessage: 'We started generating the version' },
};

const NewVersionFociComparisonContainer = ({ topicId, usingLatest, newDefinitions, latestVersionRunning, currentFocalSets, selectedSnapshot, focalSetDefinitions, handleNewVersionAndSpider }) => {
  if (needsNewVersion(usingLatest, newDefinitions, latestVersionRunning)) {
    return (
      <React.Fragment>
        <Row>
          <Col lg={12}>
            <h2><FormattedMessage {...localMessages.versionDiffTitle} /></h2>
          </Col>
        </Row>
        <Row>
          <Col lg={5}>
            <FocalSetSummary focalSets={currentFocalSets} snapshot={selectedSnapshot} faded />
          </Col>
          <Col lg={2}>
            <span style={{ display: 'block', fontSize: '56px', marginTop: '120px', textAlign: 'center' }}>➡</span>
          </Col>
          <Col lg={5}>
            <FocalSetDefinitionSummary focalSetDefs={focalSetDefinitions} snapshot={selectedSnapshot} />
            <AppButton
              label={localMessages.createVersionAndStartSpider}
              onClick={() => handleNewVersionAndSpider(topicId, null)}
              primary
            />
            <TabbedChip warning message={localMessages.applyChanges} />
            <Permissioned onlyRole={PERMISSION_ADMIN}>
              <AppButton
                label={localMessages.updateTopicVersionSubtopics}
                onClick={() => handleNewVersionAndSpider(topicId, selectedSnapshot.snapshots_id)}
              />
              (admin only)
            </Permissioned>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
  return '';
};

NewVersionFociComparisonContainer.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  // from state
  topicId: PropTypes.number.isRequired,
  focalSetDefinitions: PropTypes.array,
  currentFocalSets: PropTypes.array,
  usingLatest: PropTypes.bool.isRequired,
  newDefinitions: PropTypes.bool.isRequired,
  latestVersionRunning: PropTypes.bool.isRequired,
  selectedSnapshot: PropTypes.object,
  // from dispatch
  handleNewVersionAndSpider: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  focalSetDefinitions: state.topics.selected.focalSets.definitions.list,
  currentFocalSets: state.topics.selected.focalSets.all.list,
  usingLatest: state.topics.selected.snapshots.usingLatest,
  newDefinitions: state.topics.selected.focalSets.all.newDefinitions,
  latestVersionRunning: state.topics.selected.snapshots.latestVersionRunning,
  selectedSnapshot: state.topics.selected.snapshots.selected,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleNewVersionAndSpider: (topicId, existingSnapshotId) => {
    // if currentVersion is null this will make a new versionn
    dispatch(topicSnapshotSpider(topicId, existingSnapshotId))
      .then((results) => {
        if (results.error) {
          return dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.failed) }));
        }
        // let them know it worked
        dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.worked) }));
        return dispatch(push(`/topics/${results.topics_id}/versions`));
      });
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    NewVersionFociComparisonContainer
  )
);
