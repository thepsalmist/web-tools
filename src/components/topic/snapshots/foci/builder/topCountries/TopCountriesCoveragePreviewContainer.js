import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../../../../common/hocs/AsyncContainer';
import { fetchCreateFocusTopCountriesCoverage } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import PieChart from '../../../../../vis/PieChart';
import { getBrandDarkColor } from '../../../../../../styles/colors';

const localMessages = {
  title: { id: 'topic.snapshot.topStories.coverage.title', defaultMessage: 'Story Coverage' },
  intro: { id: 'topic.snapshot.topStories.coverage.intro', defaultMessage: 'By Top Stories' },
  included: { id: 'topic.snapshot.keywords.coverage.matching', defaultMessage: 'Stories about these top countries for this topic' },
  notIncluded: { id: 'topic.snapshot.keywords.coverage.total', defaultMessage: 'All Stories about this topic' },
};

class TopCountriesCoveragePreviewContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { topicId, numCountries, fetchData } = this.props;
    if (nextProps.numCountries !== numCountries) {
      fetchData(topicId, nextProps.numCountries);
    }
  }

  render() {
    const { count, total } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    if (count !== null) {
      content = (
        <PieChart
          title={formatMessage(localMessages.title)}
          data={[
            { name: formatMessage(localMessages.included), y: count, color: getBrandDarkColor() },
            { name: formatMessage(localMessages.notIncluded), y: total, color: '#cccccc' },
          ]}
          height={250}
          showDataLabels={false}
        />
      );
    }
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
        </h2>
        <p><FormattedMessage {...localMessages.intro} /></p>
        {content}
      </DataCard>
    );
  }
}

TopCountriesCoveragePreviewContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  numCountries: PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  count: PropTypes.number,
  total: PropTypes.number,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.topCountriesCoverage.fetchStatus,
  count: state.topics.selected.focalSets.create.topCountriesCoverage.counts.count,
  total: state.topics.selected.focalSets.create.topCountriesCoverage.counts.total,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (topicId, numCountries) => {
    dispatch(fetchCreateFocusTopCountriesCoverage(topicId, { numCountries }));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.numCountries);
    },

  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withAsyncFetch(
      TopCountriesCoveragePreviewContainer
    )
  )
);
