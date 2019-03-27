import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../../common/AppButton';
import { needsNewVersion } from '../../versions/NeedsNewVersionWarning';
import FocalSetSummary from './FocalSetSummary';
import FocalSetDefinitionSummary from './FocalSetDefinitionSummary';
import { updateAndCreateNewTopicVersion, updateTopicVersionSubtopics } from '../../../../actions/topicActions';
import { PERMISSION_ADMIN } from '../../../../lib/auth';
import Permissioned from '../../../common/Permissioned';

const localMessages = {
  createVersionAndStartSpider: { id: 'focalSets.manage.about', defaultMessage: 'Generate New Version' },
  updateTopicVersionSubtopics: { id: 'focalSets.manage.about', defaultMessage: 'Generate Into Current Version' },
};

const NewVersionFociComparisonContainer = ({ topicId, usingLatest, newDefinitions, latestVersionRunning, currentFocalSets, selectedSnapshot, focalSetDefinitions, handleGenerateIntoSameVersion, handleCreateVersionAndStartSpider }) => {
  if (needsNewVersion(usingLatest, newDefinitions, latestVersionRunning)) {
    return (
      <React.Fragment>
        <Row>
          <Col lg={5}>
            <FocalSetSummary focalSets={currentFocalSets} snapshot={selectedSnapshot} />
          </Col>
          <Col lg={2}>
            <span style={{ display: 'block', fontSize: '56px', marginTop: '120px', textAlign: 'center' }}>➡</span>
          </Col>
          <Col lg={5}>
            <FocalSetDefinitionSummary focalSetDefs={focalSetDefinitions} snapshot={selectedSnapshot} />
            <AppButton
              label={localMessages.createVersionAndStartSpider}
              onClick={() => handleCreateVersionAndStartSpider(topicId)}
              primary
            />
            <Permissioned onlyRole={PERMISSION_ADMIN}>
              <AppButton
                label={localMessages.updateTopicVersionSubtopics}
                onClick={() => handleGenerateIntoSameVersion(topicId, selectedSnapshot)}
              />
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
  handleCreateVersionAndStartSpider: PropTypes.func.isRequired,
  handleGenerateIntoSameVersion: PropTypes.func.isRequired,
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

const mapDispatchToProps = dispatch => ({
  handleCreateVersionAndStartSpider: (topicId) => {
    dispatch(updateAndCreateNewTopicVersion(topicId));
  },
  handleGenerateIntoSameVersion: (topicId, currentVersion) => {
    dispatch(updateTopicVersionSubtopics(topicId, currentVersion.snapshots_id));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    NewVersionFociComparisonContainer
  )
);
