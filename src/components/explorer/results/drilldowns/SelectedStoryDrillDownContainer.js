import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { CloseButton } from '../../../common/IconButton';
import SelectedStoryContainer from '../../../common/story/SelectedStoryContainer';
import { resetStory } from '../../../../actions/storyActions';
import DataCard from '../../../common/DataCard';
import { getUserRoles, hasPermissions, PERMISSION_ADMIN } from '../../../../lib/auth';

class SelectedStoryDrillDownContainer extends React.Component {
  constructor(props) {
    super(props);
    this.rootRef = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    const { selectedStory, lastSearchTime } = this.props;
    return (nextProps.lastSearchTime !== lastSearchTime || nextProps.selectedStory !== selectedStory);
  }

  componentDidUpdate(prevProps) {
    const { selectedStory } = this.props;
    const prevSelectedStory = prevProps.selectedStory;
    const rootNode = this.rootRef;
    // have to treat this node carefully, because it might not be showing
    if (rootNode && rootNode.current && selectedStory && (selectedStory !== prevSelectedStory)) {
      rootNode.current.scrollIntoView();
    }
  }

  openNewPage = (url) => {
    window.open(url, '_blank');
  }

  render() {
    const { user, selectedStory, handleClose } = this.props;
    const isAdmin = hasPermissions(getUserRoles(user), PERMISSION_ADMIN);
    let content = null;
    if (selectedStory) {
      content = (
        <div className="drill-down" ref={this.rootRef}>
          <DataCard className="query-story-drill-down">
            <Row>
              <Col lg={12}>
                <div className="actions">
                  <CloseButton onClick={handleClose} />
                </div>
              </Col>
            </Row>
            <SelectedStoryContainer id={selectedStory} isAdmin={isAdmin} />
          </DataCard>
        </div>
      );
    }
    return content;
  }
}

SelectedStoryDrillDownContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  // from store
  fetchStatus: PropTypes.string.isRequired,
  storyInfo: PropTypes.object,
  selectedStory: PropTypes.number,
  nytThemesSet: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
  // from dispatch
  handleClose: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
  fetchStatus: state.explorer.stories.fetchStatus,
  storyInfo: state.story.info,
  selectedStory: state.story.info.stories_id,
  nytThemesSet: state.system.staticTags.tagSets.nytThemesSet,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  handleClose: () => {
    dispatch(resetStory());
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    SelectedStoryDrillDownContainer
  )
);
