import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import DataCard from '../../common/DataCard';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import { generateParamStr } from '../../../lib/apiUtil';
import { getBrandDarkColor } from '../../../styles/colors';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import TimespanDateRange from '../TimespanDateRange';

const localMessages = {
  unfiltered: { id: 'topic.influentialWords.unfiltered', defaultMessage: 'Overall Timespan' },
  pickATimespan: { id: 'topic.influentialWords.pick', defaultMessage: 'You are currently looking at the overall timespan.  Pick a week or month to compare it to the overall timepsan here.' },
};

const WordCloudComparisonContainer = (props) => {
  const { wordCounts, totalWordCounts, handleWordCloudClick, selectedTimespan } = props;
  if ((selectedTimespan === undefined) || (selectedTimespan === null)) {
    return (<div />);
  }
  let comparisonContent;
  if (selectedTimespan.period === 'overall') {
    comparisonContent = (
      <DataCard>
        <FormattedMessage {...localMessages.pickATimespan} />
      </DataCard>
    );
  } else {
    comparisonContent = (
      <DataCard>
        <h2>
          <TimespanDateRange timespan={selectedTimespan} />
        </h2>
        <OrderedWordCloud
          words={wordCounts}
          textColor={getBrandDarkColor()}
          onWordClick={word => handleWordCloudClick(word, props)}
        />
      </DataCard>
    );
  }
  return (
    <Row>
      <Col lg={6}>
        <DataCard>
          <h2>
            <FormattedMessage {...localMessages.unfiltered} />
          </h2>
          <OrderedWordCloud
            words={totalWordCounts}
            textColor={getBrandDarkColor()}
            onWordClick={handleWordCloudClick}
          />
        </DataCard>
      </Col>
      <Col lg={6}>
        {comparisonContent}
      </Col>
    </Row>
  );
};

WordCloudComparisonContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  // from state
  selectedTimespan: PropTypes.object,
  topicId: PropTypes.number.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  topWords: PropTypes.object.isRequired,
  wordCounts: PropTypes.array.isRequired,
  totalWordCounts: PropTypes.array.isRequired,
  // from dispatch
  handleWordCloudClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedTimespan: state.topics.selected.timespans.selected,
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.summary.topWords.fetchStatus,
  topWords: state.topics.selected.summary.topWords,
  wordCounts: state.topics.selected.summary.topWords.list, // for just this timespan
  totalWordCounts: state.topics.selected.summary.topWords.totals, // for the whole snapshot/focus
});

const mapDispatchToProps = dispatch => ({
  handleWordCloudClick: (word, props) => {
    const params = generateParamStr({ ...props.filters, stem: word.stem, term: word.term });
    const url = `/topics/${props.topicId}/words/${word.stem}*?${params}`;
    dispatch(push(url));
  },
});

const fetchAsyncData = (dispatch, props) => {
  dispatch(fetchTopicTopWords(props.topicId, { ...props.filters, withTotals: true }));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withFilteredAsyncData(fetchAsyncData, ['selectedTimespan'])(
      WordCloudComparisonContainer
    )
  )
);
