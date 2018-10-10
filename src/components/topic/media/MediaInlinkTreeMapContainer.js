import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { sortMediaInlinks, fetchAllMediaInlinks } from '../../../actions/topicActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import messages from '../../../resources/messages';
import TreeMap from '../../vis/TreeMap';
import { trimToMaxLength } from '../../../lib/stringUtil';
import * as fetchConstants from '../../../lib/fetchConstants';
import LoadingSpinner from '../../common/LoadingSpinner';

const TREE_MAP_DOM_ID = 'tree-map';

const localMessages = {
  treeMap: { id: 'media.inlinks.treemap', defaultMessage: 'Inlink Tree Map for {name}' },
};

class MediaInlinkTreeMapContainer extends React.Component {
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }

  render() {
    const { fetchStatus, allInlinks, media, topicName } = this.props;
    const { formatMessage } = this.props.intl;
    let content = <LoadingSpinner />;
    if (fetchStatus === fetchConstants.FETCH_SUCCEEDED) {
      const justIds = [...new Set(allInlinks.map(d => d.media_id))];
      const groups = justIds.map(id => ({ id, elements: allInlinks.filter(e => e.media_id === id) }));
      const summedInlinks = groups.map(g => ({ id: g.id, name: g.elements[0].media_name, value: g.elements.reduce((acc, ele) => acc + ele.inlink_count, 0) }));
      const concatTitle = `${trimToMaxLength(media.name, 30)} (${topicName})`;
      content = <TreeMap domId={TREE_MAP_DOM_ID} data={summedInlinks} title={formatMessage(localMessages.treeMap, { name: concatTitle })} />;
    }
    return content;
  }
}

MediaInlinkTreeMapContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  topicName: PropTypes.string.isRequired,
  media: PropTypes.object.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from fetchData
  fetchData: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  // from state
  sort: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  allInlinks: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.allInlinks.fetchStatus,
  allInlinks: state.topics.selected.mediaSource.allInlinks.stories,
  sort: state.topics.selected.mediaSource.inlinks.sort,
  filters: state.topics.selected.filters,
  media: state.topics.selected.mediaSource.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (stateProps) => {
    const params = {
      ...stateProps.filters,
      sort: stateProps.sort,
    };
    dispatch(fetchAllMediaInlinks(ownProps.topicId, ownProps.media.media_id, params));
  },
  sortData: (sort) => {
    dispatch(sortMediaInlinks(sort));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpIntro, messages.storiesTableHelpText])(
      withAsyncFetch(
        MediaInlinkTreeMapContainer
      )
    )
  )
);
