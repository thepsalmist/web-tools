import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import AppButton from '../../common/AppButton';
import EnabledPlatformList from './EnabledPlatformList';
import { topicSnapshotSpider } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';

const localMessages = {
  createVersionAndStartSpider: { id: 'platforms.manage.about', defaultMessage: 'Generate New Version' },
  updateTopicVersionSubtopics: { id: 'platforms.manage.about', defaultMessage: 'Generate Into Current Version' },
  versionDiffTitle: { id: 'platforms.list.versionDiffTitle', defaultMessage: 'You\'ve Made Changes' },
  applyChanges: { id: 'platforms.list.applyChanges', defaultMessage: 'apply your changes' },
  failed: { id: 'platforms.save.failed', defaultMessage: 'Sorry, something went wrong!' },
  worked: { id: 'platforms.save.worked', defaultMessage: 'We started generating the version' },
  currentVersionComparisonTitle: { id: 'topic.platforms.comparison.currentTitle', defaultMessage: 'Version {versionNumber}: Platform Summary' },
  nextVersionComparisonTitle: { id: 'topic.platforms.comparison.nextTitle', defaultMessage: 'Next Version: Platform Summary' },
  noPlatforms: { id: 'platforms.noneYet', defaultMessage: '(No current version to compare to, becuase you are setting up your first version)' },
};

class PlatformComparisonContainer extends React.Component {
  state = {
    submittingVersion: false,
  };

  onGenerateVersion = (topicId, snapshotId) => {
    const { handleNewVersionAndSpider } = this.props;
    this.setState({ submittingVersion: true });
    handleNewVersionAndSpider(topicId, snapshotId);
  }

  render() {
    const { topicId, usingLatest, newPlatforms, platforms, selectedSnapshot, latestVersionRunning, platformsHaveChanged } = this.props;
    const submitting = this.state.submittingVersion;
    // TODO: we need to fetch the platforms on the current version and compare that to the platforms on the next version
    if (!latestVersionRunning && usingLatest && platformsHaveChanged) {
      return (
        <Grid>
          <Row>
            <Col lg={12}>
              <h2><FormattedMessage {...localMessages.versionDiffTitle} /></h2>
            </Col>
          </Row>
          <Row>
            <Col lg={5}>
              {selectedSnapshot && <EnabledPlatformList platforms={platforms} titleMsg={localMessages.currentVersionComparisonTitle} latestVersionNumber={selectedSnapshot.note} /> }
              {((selectedSnapshot === null) || (selectedSnapshot === undefined)) && <FormattedMessage {...localMessages.noPlatforms} /> }
            </Col>
            <Col lg={2}>
              <span style={{ display: 'block', fontSize: '56px', marginTop: '120px', textAlign: 'center' }}>➡</span>
            </Col>
            <Col lg={5}>
              <EnabledPlatformList
                platforms={newPlatforms.filter(p => (p.query && p.query.length > 0))}
                titleMsg={localMessages.nextVersionComparisonTitle}
                latestVersionNumber={null}
              />
              <AppButton
                label={localMessages.createVersionAndStartSpider}
                onClick={() => this.onGenerateVersion(topicId, null)}
                primary
                disabled={submitting}
              />
            </Col>
          </Row>
        </Grid>
      );
    }
    return '';
  }
}

PlatformComparisonContainer.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  // from state
  topicId: PropTypes.number.isRequired,
  usingLatest: PropTypes.bool.isRequired,
  selectedSnapshot: PropTypes.object,
  platforms: PropTypes.array, // .isRequired,
  platformsHaveChanged: PropTypes.bool.isRequired,
  newPlatforms: PropTypes.array,
  latestVersionRunning: PropTypes.bool.isRequired,
  // from dispatch
  handleNewVersionAndSpider: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  usingLatest: state.topics.selected.snapshots.usingLatest,
  newPlatforms: state.topics.selected.platforms.all.results,
  platformsHaveChanged: state.topics.selected.info.platformsHaveChanged,
  latestVersionRunning: state.topics.selected.snapshots.latestVersionRunning,
  selectedSnapshot: state.topics.selected.snapshots.selected,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleNewVersionAndSpider: (topicId, snapshotId) => {
    // if currentVersion is null this will make a new version
    const params = {};
    if (snapshotId) {
      params.snapshotId = snapshotId;
    }
    dispatch(topicSnapshotSpider(topicId, params))
      .then((results) => {
        if (results && results.topics_id) {
          // let them know it worked
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.worked) }));
          return dispatch(push(`/topics/${topicId}/versions`));
        }
        return dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.failed) }));
      });
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    PlatformComparisonContainer
  )
);
