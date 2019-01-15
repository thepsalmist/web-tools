import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import DataCard from '../../common/DataCard';
import { fetchTopicWord2VecTimespans } from '../../../actions/topicActions';
import Word2VecTimespanPlayer from '../../vis/Word2VecTimespanPlayer';

const localMessages = {
  title: { id: 'topic.timespanPlayer.title', defaultMessage: 'Topic Word Space Over Time' },
  intro: { id: 'topic.timespanPlayer.intro', defaultMessage: 'TODO: Description' },
};

const Word2VecTimespanPlayerContainer = (props) => {
  const { selectedTimespan, timespanEmbeddings } = props;
  if ((selectedTimespan === undefined) || (selectedTimespan === null)) {
    return (<div />);
  }
  return (
    <Row>
      <Col lg={12}>
        <DataCard>
          <h2><FormattedMessage {...localMessages.title} /></h2>
          <Word2VecTimespanPlayer
            xProperty="w2v_x"
            yProperty="w2v_y"
            initialTimespan={selectedTimespan}
            timespanEmbeddings={timespanEmbeddings}
          />
        </DataCard>
      </Col>
    </Row>
  );
};

Word2VecTimespanPlayerContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  // from state
  selectedTimespan: PropTypes.object,
  topicId: PropTypes.number.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  timespanEmbeddings: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  selectedTimespan: state.topics.selected.timespans.selected,
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.summary.word2vecTimespans.fetchStatus,
  timespanEmbeddings: state.topics.selected.summary.word2vecTimespans.list,
});

const fetchAsyncData = (dispatch, props) => {
  dispatch(fetchTopicWord2VecTimespans(props.topicId, props.filters));
};

export default
injectIntl(
  connect(mapStateToProps)(
    withFilteredAsyncData(fetchAsyncData)(
      Word2VecTimespanPlayerContainer
    )
  )
);
