import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import withHelp from '../../common/hocs/HelpfulContainer';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { fetchWordSplitStoryCounts } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import DataCard from '../../common/DataCard';
import { getBrandDarkColor } from '../../../styles/colors';
import { filtersAsUrlParams } from '../../util/location';

const localMessages = {
  title: { id: 'word.splitStoryCount.title', defaultMessage: 'Stories that Use this Word' },
  helpTitle: { id: 'word.splitStoryCount.help.title', defaultMessage: 'About Word Attention' },
  helpText: { id: 'word.splitStoryCount.help.text',
    defaultMessage: '<p>This chart shows you the stories within this Topic that include this word.</p>',
  },
};

const WordSplitStoryCountContainer = (props) => {
  const { topicId, total, counts, helpButton, term, filters } = props;
  const { formatMessage } = props.intl;
  return (
    <DataCard>
      <div className="actions">
        <DownloadButton
          tooltip={formatMessage(messages.download)}
          onClick={() => {
            const url = `/api/topics/${topicId}/words/${term}*/split-story/count.csv?${filtersAsUrlParams(filters)}`;
            window.location = url;
          }}
        />
      </div>
      <h2>
        <FormattedMessage {...localMessages.title} />
        {helpButton}
      </h2>
      <AttentionOverTimeChart
        total={total}
        data={counts}
        height={200}
        lineColor={getBrandDarkColor()}
      />
    </DataCard>
  );
};

WordSplitStoryCountContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  filters: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  term: PropTypes.string.isRequired,
  stem: PropTypes.string.isRequired, // from state
  // from state
  fetchStatus: PropTypes.string.isRequired,
  total: PropTypes.number,
  counts: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.word.splitStoryCount.fetchStatus,
  total: state.topics.selected.word.splitStoryCount.total,
  counts: state.topics.selected.word.splitStoryCount.counts,
});

const fetchAsyncData = (dispatch, props) => dispatch(fetchWordSplitStoryCounts(props.topicId, props.stem, props.filters));

export default
injectIntl(
  connect(mapStateToProps)(
    withHelp(localMessages.helpTitle, localMessages.helpText)(
      withFilteredAsyncData(fetchAsyncData, ['stem'])(
        WordSplitStoryCountContainer
      )
    )
  )
);
