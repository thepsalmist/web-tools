import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { fetchTopicStoryCounts } from '../../../actions/topicActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import InfluentialStoryExplorer from './InfluentialStoryExplorer';

const localMessages = {
  title: { id: 'topic.influentialStoryExplorer.title', defaultMessage: 'Story Explorer' },
  intro: { id: 'topic.influentialStoryExplorer.intro', defaultMessage: 'This is an <b>experimental</b> interface that lets you dyanimcally explore stories in a multi-dimensional way.  Think of it as a pivot-table explorer within this timespan.  First it has to download a list of all the stories in this timespan, so don\'t be surprised if it spins for 5 or so minutes while downloading.  Then you\'ll see a number of charts you can explore.  Drag and click on the charts to filter for just the stories you want to see.' },
  error: { id: 'topic.influentialStoryExplorer.error', defaultMessage: 'Sorry - there are too many stories in this timespan to support this UI.  Try looking at just one week or just one month of this topic instead.' },
};

const MAX_STORIES = 100000;

class InfluentialStoryExplorerContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }

  render() {
    const { counts, topicId, filters, selectedTimespan } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
    let content = null;
    if (counts.count > MAX_STORIES) {
      content = (
        <p>
          <FormattedMessage {...localMessages.error} />
        </p>
      );
    } else {
      content = (
        <InfluentialStoryExplorer
          topicId={topicId}
          filters={filters}
          selectedTimespan={selectedTimespan}
        />
      );
    }
    return (
      <div className="story-explorer">
        <Grid>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Helmet><title>{titleHandler()}</title></Helmet>
              <h1><FormattedMessage {...localMessages.title} /></h1>
              <p><FormattedHTMLMessage {...localMessages.intro} /></p>
              {content}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

InfluentialStoryExplorerContainer.propTypes = {
  // from the composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  // from state
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  selectedTimespan: PropTypes.object,
  counts: PropTypes.object,
  fetchStatus: PropTypes.string.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from PagedContainer wrapper
  nextButton: PropTypes.node,
  previousButton: PropTypes.node,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  selectedTimespan: state.topics.selected.timespans.selected,
  fetchStatus: state.topics.selected.summary.storyTotals.fetchStatus,
  counts: state.topics.selected.summary.storyTotals.counts,
});


const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    dispatch(fetchTopicStoryCounts(props.topicId, props.filters));
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
    withAsyncFetch(
      InfluentialStoryExplorerContainer
    )
  )
);
