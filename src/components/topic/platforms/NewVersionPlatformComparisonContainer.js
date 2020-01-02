import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import AppButton from '../../common/AppButton';
import PlatformSummary from './PlatformSummary';
import { needsNewVersion } from '../versions/NeedsNewVersionWarning';
import { topicSnapshotSpider } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';

const localMessages = {
  createVersionAndStartSpider: { id: 'platforms.manage.about', defaultMessage: 'Generate New Version' },
  updateTopicVersionSubtopics: { id: 'platforms.manage.about', defaultMessage: 'Generate Into Current Version' },
  versionDiffTitle: { id: 'platforms.list.versionDiffTitle', defaultMessage: 'You\'ve Made Changes' },
  applyChanges: { id: 'platforms.list.applyChanges', defaultMessage: 'apply your changes' },
  failed: { id: 'platforms.save.failed', defaultMessage: 'Sorry, something went wrong!' },
  worked: { id: 'platforms.save.worked', defaultMessage: 'We started generating the version' },
};

class NewVersionPlatformComparisonContainer extends React.Component {
  state = {
    submittingVersion: false,
  };

  onGenerateVersion = (topicId, snapshotId) => {
    const { handleNewVersionAndSpider } = this.props;
    this.setState({ submittingVersion: true });
    handleNewVersionAndSpider(topicId, snapshotId);
  }

  render() {
    const { topicId, usingLatest, newPlatforms, platforms, latestVersionRunning } = this.props;
    const submitting = this.state.submittingVersion;
    if (needsNewVersion(usingLatest, newPlatforms, latestVersionRunning)) {
      return (
        <fragment>
          <Row>
            <Col lg={12}>
              <h2><FormattedMessage {...localMessages.versionDiffTitle} /></h2>
            </Col>
          </Row>
          <Row>
            <Col lg={5}>
              <PlatformSummary platforms={platforms} version={latestVersionRunning} />
            </Col>
            <Col lg={2}>
              <span style={{ display: 'block', fontSize: '56px', marginTop: '120px', textAlign: 'center' }}>➡</span>
            </Col>
            <Col lg={5}>
              <PlatformSummary platforms={newPlatforms} />
              <AppButton
                label={localMessages.createVersionAndStartSpider}
                onClick={() => this.onGenerateVersion(topicId, null)}
                primary
                disabled={submitting}
              />
            </Col>
          </Row>
        </fragment>
      );
    }
    return '';
  }
}

NewVersionPlatformComparisonContainer.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  // from state
  topicId: PropTypes.number.isRequired,
  usingLatest: PropTypes.bool.isRequired,
  selectedSnapshot: PropTypes.object.isRequired,
  platforms: PropTypes.array, // .isRequired,
  newPlatforms: PropTypes.array,
  latestVersionRunning: PropTypes.bool.isRequired,
  // from dispatch
  handleNewVersionAndSpider: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  usingLatest: state.topics.selected.snapshots.usingLatest,
  newPlatforms: state.topics.selected.platforms.all.results,
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
    NewVersionPlatformComparisonContainer
  )
);
