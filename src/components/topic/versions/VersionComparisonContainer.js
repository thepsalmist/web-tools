import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import AppButton from '../../common/AppButton';
import { topicSnapshotSpider } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';
import TopicVersionReadySummary from './TopicVersionReadySummary';

const localMessages = {
  title: { id: 'versions.comparison.title', defaultMessage: 'Version {versionNumber}: Summary' },
  createVersionAndStartSpider: { id: 'versions.comparison.generate', defaultMessage: 'Generate New Version' },
  versionDiffTitle: { id: 'versions.comparison.versionDiffTitle', defaultMessage: 'You\'ve Made Changes' },
  applyChanges: { id: 'versions.comparison.applyChanges', defaultMessage: 'apply your changes' },
  failed: { id: 'versions.comparison.failed', defaultMessage: 'Sorry, something went wrong!' },
  worked: { id: 'versions.comparison.worked', defaultMessage: 'We started generating the version' },
  currentVersionComparisonTitle: { id: 'versions.comparison.currentTitle', defaultMessage: 'Version {versionNumber}: Platform Summary' },
  nextVersionComparisonTitle: { id: 'versions.comparison.nextTitle', defaultMessage: 'Next Version: Platform Summary' },
  noPlatforms: { id: 'versions.comparison.noneYet', defaultMessage: '(No current version to compare to, because you are setting up your first version)' },
};

class VersionComparisonContainer extends React.Component {
  state = {
    submittingVersion: false,
  };

  onGenerateVersion = (topicId, snapshotId) => {
    const { handleNewVersionAndSpider } = this.props;
    this.setState({ submittingVersion: true });
    handleNewVersionAndSpider(topicId, snapshotId);
  }

  render() {
    const { topicId, current, next, focalSetDefinitions, selectedSnapshot } = this.props;
    const submitting = this.state.submittingVersion;
    return (
      <Grid>
        <Row>
          <Col lg={12}>
            <h2><FormattedMessage {...localMessages.versionDiffTitle} /></h2>
          </Col>
        </Row>
        <Row>
          <Col lg={5}>
            <div className="topic-info-sidebar faded">
              <h2><FormattedMessage {...localMessages.title} values={{ versionNumber: selectedSnapshot.note }} /></h2>
              <TopicVersionReadySummary snapshot={current} startWithDetailsShowing />
            </div>
          </Col>
          <Col lg={2}>
            <span style={{ display: 'block', fontSize: '56px', marginTop: '120px', textAlign: 'center' }}>➡</span>
          </Col>
          <Col lg={5}>
            <div className="topic-info-sidebar">
              <h2><FormattedMessage {...localMessages.title} values={{ versionNumber: selectedSnapshot.note + 1 }} /></h2>
              <TopicVersionReadySummary
                snapshot={next}
                focalSets={focalSetDefinitions}
                startWithDetailsShowing
              />
            </div>
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
}

VersionComparisonContainer.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  current: PropTypes.object,
  next: PropTypes.object,
  // from state
  focalSetDefinitions: PropTypes.array,
  selectedSnapshot: PropTypes.object,
  // from dispatch
  handleNewVersionAndSpider: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  focalSetDefinitions: state.topics.selected.focalSets.definitions.list,
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
    VersionComparisonContainer
  )
);
