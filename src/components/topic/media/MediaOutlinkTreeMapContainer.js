import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchAllMediaOutlinks } from '../../../actions/topicActions';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import messages from '../../../resources/messages';
import TreeMap from '../../vis/TreeMap';
import { trimToMaxLength } from '../../../lib/stringUtil';

const TREE_MAP_DOM_ID = 'tree-map';

const localMessages = {
  treeMap: { id: 'media.inlinks.treemap', defaultMessage: 'Outlink Tree Map for {name}' },
  tooltipText: { id: 'chart.treeMap.tooltip.text', defaultMessage: '{count} of oulinks are to {name}.' },
};

const MediaOutlinkTreeMapContainer = (props) => {
  const { allOutlinks, media, topicName } = props;
  const { formatMessage } = props.intl;
  const justIds = [...new Set(allOutlinks.map(d => d.media_id))];
  const groups = justIds.map(id => ({ id, elements: allOutlinks.filter(e => e.media_id === id) }));
  const summedOutlinks = groups.map(g => ({
    id: g.id,
    name: g.elements[0].media_name,
    value: g.elements.length,
  }));
  const concatTitle = `${trimToMaxLength(media.name, 30)} (${topicName})`;
  return (
    <TreeMap
      domId={TREE_MAP_DOM_ID}
      data={summedOutlinks}
      title={formatMessage(localMessages.treeMap, { name: concatTitle })}
      tooltipMessage={localMessages.tooltipText}
    />
  );
};

MediaOutlinkTreeMapContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  topicName: PropTypes.string.isRequired,
  media: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  allOutlinks: PropTypes.array,
  filters: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.allOutlinks.fetchStatus,
  allOutlinks: state.topics.selected.mediaSource.allOutlinks.stories,
  filters: state.topics.selected.filters,
});

const fetchAsyncData = (dispatch, props) => {
  dispatch(fetchAllMediaOutlinks(props.topicId, props.media.media_id, props.filters));
};

export default
injectIntl(
  connect(mapStateToProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpIntro, messages.storiesTableHelpText])(
      withFilteredAsyncData(
        MediaOutlinkTreeMapContainer,
        fetchAsyncData,
      )
    )
  )
);
