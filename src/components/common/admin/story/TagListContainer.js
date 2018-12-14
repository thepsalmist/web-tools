import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchStoryInfo } from '../../../../actions/storyActions';
import withAsyncFetch from '../../hocs/AsyncContainer';
import messages from '../../../../resources/messages';
import DataCard from '../../DataCard';
import { TAG_SET_NYT_THEMES, TAG_SET_CLIFF_ORGS, TAG_SET_CLIFF_PEOPLE } from '../../../../lib/tagUtil';
import { DownloadButton } from '../../IconButton';
import TagsAndTagSetsTable from '../TagsAndTagSetsTable';

const localMessages = {
  title: { id: 'story.entities.title', defaultMessage: 'Tags on Stories' },
  otherStoryTagTitle: { id: 'admin.story.details.otherTags', defaultMessage: 'Other Tags' },
};

class TagListContainer extends React.Component {
  downloadCsv = () => {
    const { selectedStory } = this.props;
    const url = `/api/stories/${selectedStory.stories_id}/tags.csv`;
    window.location = url;
  }

  render() {
    const { selectedStory } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard className="other-tags">
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.otherStoryTagTitle} />
        </h2>
        <TagsAndTagSetsTable storyTags={selectedStory.story_tags ? selectedStory.story_tags.filter(t => t.tag_sets_id !== TAG_SET_NYT_THEMES && t.tag_sets_id !== TAG_SET_CLIFF_ORGS && t.tag_sets_id !== TAG_SET_CLIFF_PEOPLE) : []} />
      </DataCard>
    );
  }
}

TagListContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  selectedStory: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.story.info.fetchStatus,
  selectedStory: state.story.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (storyId) => {
    dispatch(fetchStoryInfo(storyId));
  },
  asyncFetch: () => {
    dispatch(fetchStoryInfo(ownProps.story.stories_id));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      TagListContainer
    )
  )
);
