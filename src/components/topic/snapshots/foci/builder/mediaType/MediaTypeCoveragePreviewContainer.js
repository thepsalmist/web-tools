import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../../../../common/hocs/AsyncContainer';
import { fetchCreateFocusMediaTypeCoverage } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import PieChart from '../../../../../vis/PieChart';
import { getBrandDarkColor } from '../../../../../../styles/colors';

const localMessages = {
  title: { id: 'topic.snapshot.mediaType.coverage.title', defaultMessage: 'Story Coverage' },
  intro: { id: 'topic.snapshot.mediaType.coverage.intro', defaultMessage: 'This chart shows you how many of the stories are from sources that we have tagged with a media type.  If the colored slice is big, it means that you have enough coverage to do an analysis comparing coverage of this topic from different media types.  If the colored slice is small, you might not want to use this approach, because not many stories will be included in the subtopics.' },
  included: { id: 'topic.snapshot.mediaType.coverage.matching', defaultMessage: 'Stories from media sources that have a Media Type' },
  notIncluded: { id: 'topic.snapshot.mediaType.coverage.total', defaultMessage: 'Stories from media sources that have NO Media Type' },
};

const MediaTypeCoveragePreviewContainer = (props) => {
  const { count, total } = props;
  const { formatMessage } = props.intl;
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
};

MediaTypeCoveragePreviewContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  count: PropTypes.number,
  total: PropTypes.number,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.mediaTypeCoverage.fetchStatus,
  count: state.topics.selected.focalSets.create.mediaTypeCoverage.counts.count,
  total: state.topics.selected.focalSets.create.mediaTypeCoverage.counts.total,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (topicId) => {
    dispatch(fetchCreateFocusMediaTypeCoverage(topicId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId);
    },

  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withAsyncFetch(
      MediaTypeCoveragePreviewContainer
    )
  )
);
