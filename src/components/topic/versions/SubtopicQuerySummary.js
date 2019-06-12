import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import { fetchTopicFocalSetsList } from '../../../actions/topicActions';

const localMessages = {
  title: { id: 'topic.info.title', defaultMessage: 'Version {versionNumber}: Subtopics' },
  seedQueryCount: { id: 'topic.info.seedQueryCount', defaultMessage: 'Matches {storyCount} stories already in our database.' },
  willSpider: { id: 'topic.info.willSpider', defaultMessage: 'Links will be followed to find more stories ({rounds} rounds).' },
  willNotSpider: { id: 'topic.info.willNotSpider', defaultMessage: 'Links will <em>not</em> be followed to find more stories.' },
  dates: { id: 'topic.info.dates', defaultMessage: 'Dates:' },
  datesData: { id: 'topic.info.datesData', defaultMessage: '{startDate} to {endDate}' },
};

const SubtopicQuerySummary = ({ focalSets, snapshot }) => (
  // the form has them grouped together, but the topic object has them separate
  <div className="topic-info-sidebar-subtopic">
    <h2>
      {snapshot && <FormattedHTMLMessage {...localMessages.title} values={{ versionNumber: snapshot.note }} />}
    </h2>
    {focalSets.sort((a, b) => a.name.localeCompare(b.name)).map(fs => (
      <div>
        <Row>
          <Col lg={2}>
            {fs.name}
          </Col>
          {fs.foci && fs.foci.map(f => (
            <div>
              <Col lg={3}>
                {f.name}
              </Col>
              <Col lg={3}>
                {f.query}
              </Col>
            </div>
          ))}
        </Row>
        <br />
      </div>
    ))}
  </div>
);

SubtopicQuerySummary.propTypes = {
  topicId: PropTypes.number.isRequired,
  snapshot: PropTypes.object,
  focalSets: PropTypes.array,
  // intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.all.fetchStatus,
  focalSets: state.topics.selected.focalSets.all.list,
  timespanStoryCount: state.topics.selected.timespans.selected.story_count,
});

const fetchAsyncData = (dispatch, { topicId, filters }) => {
  dispatch(fetchTopicFocalSetsList(topicId, { ...filters, includeStoryCounts: 1 }));
};

export default
injectIntl(
  connect(mapStateToProps)(
    withFilteredAsyncData(fetchAsyncData)(
      SubtopicQuerySummary
    )
  )
);
