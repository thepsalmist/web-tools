import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import LoadingSpinner from '../../common/LoadingSpinner';
import { urlWithFilters } from '../../util/location';
import TopPeopleContainer from './TopPeopleContainer';
import TopOrgsContainer from './TopOrgsContainer';
import MediaSummaryContainer from './MediaSummaryContainer';
import TopicWordCloudContainer from '../provider/TopicWordCloudContainer';
import SplitStoryCountSummaryContainer from './SplitStoryCountSummaryContainer';
import TopicStoryStatsContainer from './TopicStoryStatsContainer';
import StoryTotalsSummaryContainer from './StoryTotalsSummaryContainer';
import DownloadMapFilesContainer from './export/DownloadMapFilesContainer';
import DownloadTimespanFilesConatainer from './export/DownloadTimespanFilesContainer';
import NytLabelSummaryContainer from './NytLabelSummaryContainer';
import GeoTagSummaryContainer from './GeoTagSummaryContainer';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { SummarizedVizualization } from '../../common/hocs/SummarizedVizualization';
import TopicStoryMetadataStatsContainer from './TopicStoryMetadataStatsContainer';
import FociStoryCountComparisonContainer from './FociStoryCountComparisonContainer';
import TopicWordSpaceContainer from './TopicWordSpaceContainer';
import TabSelector from '../../common/TabSelector';
import messages from '../../../resources/messages';
import SeedQuerySummary from '../versions/SeedQuerySummary';
import TopicAttentionDrillDownContainer from './drilldowns/TopicAttentionDrillDownContainer';
import TopicStoriesContainer from '../provider/TopicStoriesContainer';

const localMessages = {
  title: { id: 'topic.summary.summary.title', defaultMessage: 'Topic: {name}' },
  previewTitle: { id: 'topic.summary.public.title', defaultMessage: 'Topic Preview: {name}' },
  previewIntro: { id: 'topic.summary.public.intro', defaultMessage: 'This is a preview of our {name} topic.  It shows just a sample of the data available once you login to the Topic Mapper tool. To explore, click on a link and sign in.' },
  statsTabTitle: { id: 'topic.summary.summary.about', defaultMessage: 'Stats' },
  exportTabTitle: { id: 'topic.summary.summary.export', defaultMessage: 'Export' },
  wordsDescriptionIntro: { id: 'topic.summary.words.help.intro', defaultMessage: '<p>Look at the top words to see how this topic was talked about. This can suggest what the dominant narrative was, and looking at different timespans can suggest how it evolved over time.</p>' },
  topStories: { id: 'topic.summary.stories.title', defaultMessage: 'Top Stories' },
  storiesDescriptionIntro: { id: 'topic.summary.stories.help.title', defaultMessage: '<p>The top stories within this topic can suggest the main ways it is talked about.  Sort by different measures to get a better picture of a story\'s influence.</p>' },
};

class TopicSummaryContainer extends React.Component {
  state = {
    selectedTab: 0,
  };

  filtersAreSet() {
    const { filters, topic } = this.props;
    return (topic.topics_id && filters.snapshotId && filters.timespanId);
  }

  render() {
    const { filters, topic, selectedTimespan, user, location, selectedSnapshot, timespans } = this.props;
    const { formatMessage } = this.props.intl;
    let content = <div />;
    let intro = null;
    if (!user.isLoggedIn) {
      intro = (<p><FormattedMessage {...localMessages.previewIntro} values={{ name: topic.name }} /></p>);
    }
    // only show filtered story counts if you have a filter in place
    let filteredStoryCountContent = null;
    if ((selectedTimespan && (selectedTimespan.period !== 'overall')) || (filters.focusId) || (filters.q)) {
      filteredStoryCountContent = (
        <Row>
          <Col lg={12}>
            <StoryTotalsSummaryContainer topicId={topic.topics_id} topicName={topic.name} filters={filters} />
          </Col>
        </Row>
      );
    }
    if (!user.isLoggedIn || this.filtersAreSet()) { // TODO: but what if only one filter (snapshot) is set?
      let viewContent;
      switch (this.state.selectedTab) {
        case 0:
          // influence
          viewContent = (
            <>
              <Row>
                <Col lg={12}>
                  <SummarizedVizualization
                    titleMessage={localMessages.topStories}
                    introMessage={localMessages.storiesDescriptionIntro}
                    handleExplore={urlWithFilters(`/topics/${topic.topics_id}/stories`, filters)}
                    wide
                  >
                    <TopicStoriesContainer uid="topic" border={false} />
                  </SummarizedVizualization>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <MediaSummaryContainer topicId={topic.topics_id} filters={filters} location={location} />
                </Col>
              </Row>
            </>
          );
          break;
        case 1:
          // attention
          viewContent = (
            <>
              <Row>
                <Col lg={12}>
                  <SplitStoryCountSummaryContainer topicId={topic.topics_id} filters={filters} timespans={timespans} />
                </Col>
                <Col lg={12}>
                  <TopicAttentionDrillDownContainer topicId={topic.topics_id} filters={filters} />
                </Col>
                {filteredStoryCountContent}
              </Row>
            </>
          );
          break;
        case 2:
          // language
          viewContent = (
            <>
              <Row>
                <Col lg={12}>
                  <SummarizedVizualization
                    titleMessage={messages.topWords}
                    introMessage={localMessages.wordsDescriptionIntro}
                    detailedMessage={[messages.wordcloudHelpText, messages.wordCloudTopicWord2VecLayoutHelp]}
                    handleExplore={urlWithFilters(`/topics/${topic.topics_id}/words`, filters)}
                  >
                    <TopicWordCloudContainer svgName="all-words" border={false} uid="topic" />
                  </SummarizedVizualization>
                </Col>
                <Col lg={12}>
                  <TopicWordSpaceContainer topicId={topic.topics_id} topicName={topic.name} filters={filters} uid="topic" />
                </Col>
              </Row>
              <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
                <Row>
                  <Col lg={12}>
                    <NytLabelSummaryContainer topicId={topic.topics_id} filters={filters} topicName={topic.name} location={location} />
                  </Col>
                </Row>
              </Permissioned>
            </>
          );
          break;
        case 3:
          // representation
          viewContent = (
            <>
              <Row>
                <Col lg={12}>
                  <TopPeopleContainer topicId={topic.topics_id} filters={filters} location={location} />
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <TopOrgsContainer topicId={topic.topics_id} filters={filters} location={location} />
                </Col>
              </Row>
              <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
                <Row>
                  <Col lg={12}>
                    <GeoTagSummaryContainer topicId={topic.topics_id} filters={filters} />
                  </Col>
                </Row>
              </Permissioned>
            </>
          );
          break;
        case 4:
          // stats
          viewContent = (
            <>
              <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
                <Row>
                  <Col lg={12}>
                    <TopicStoryMetadataStatsContainer topicId={topic.topics_id} filters={filters} timespan={selectedTimespan} />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <FociStoryCountComparisonContainer topicId={topic.topics_id} filters={filters} />
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <SeedQuerySummary topic={topic} snapshot={selectedSnapshot} />
                  </Col>
                </Row>
              </Permissioned>
            </>
          );
          break;
        case 5:
          // export
          // stats
          viewContent = (
            <>
              <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
                <Row>
                  <Col lg={12}>
                    <DownloadMapFilesContainer topicId={topic.topics_id} filters={filters} />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <DownloadTimespanFilesConatainer topicId={topic.topics_id} filters={filters} />
                  </Col>
                </Row>
              </Permissioned>
            </>
          );
          break;
        default:
          break;
      }
      content = (
        <>
          <Grid>
            <Row>
              <Col lg={12}>
                {intro}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <TopicStoryStatsContainer topicId={topic.topics_id} filters={filters} timespan={selectedTimespan} />
              </Col>
            </Row>
            <Row>
              <TabSelector
                tabLabels={[
                  formatMessage(messages.influence),
                  formatMessage(messages.attention),
                  formatMessage(messages.language),
                  formatMessage(messages.representation),
                  formatMessage(localMessages.statsTabTitle),
                  formatMessage(localMessages.exportTabTitle),
                ]}
                onViewSelected={index => this.setState({ selectedTab: index })}
              />
            </Row>
          </Grid>
          <div className="tabbed-content-wrapper">
            <Grid>
              {viewContent}
            </Grid>
          </div>
        </>
      );
    } else {
      content = <LoadingSpinner />;
    }
    return (
      <div className="topic-summary">
        {content}
      </div>
    );
  }
}

TopicSummaryContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  params: PropTypes.object,
  location: PropTypes.object,
  // from state
  filters: PropTypes.object.isRequired,
  topic: PropTypes.object,
  selectedTimespan: PropTypes.object,
  timespans: PropTypes.array,
  selectedSnapshot: PropTypes.object,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topic: state.topics.selected.info,
  selectedTimespan: state.topics.selected.timespans.selected,
  selectedSnapshot: state.topics.selected.snapshots.selected,
  user: state.user,
  timespans: state.topics.selected.timespans.list,
});

export default
injectIntl(
  connect(mapStateToProps)(
    TopicSummaryContainer
  )
);
