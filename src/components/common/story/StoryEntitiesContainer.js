import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { fetchStoryEntities } from '../../../actions/storyActions';
import withAsyncFetch from '../hocs/AsyncContainer';
import withHelp from '../hocs/HelpfulContainer';
import messages from '../../../resources/messages';
import DataCard from '../DataCard';
import { DownloadButton } from '../IconButton';
import NamedEntitiesTable from './NamedEntitiesTable';

const localMessages = {
  title: { id: 'story.entities.title', defaultMessage: 'Named Entities' },
  helpTitle: { id: 'story.entities.help.title', defaultMessage: 'About Story Named Entities' },
  helpIntro: { id: 'story.entities.help.text', defaultMessage: '<p>We run all our english stories through <a target="_blank" href="https://nlp.stanford.edu/ner/">Stanford\'s natural language pipeline</a> to extract named entities. This does a reasonably good job of identifying all the <b>people, places, and organizations</b> mentioned in this story. We don\'t disambiguate them to determine unique entities, nor can you search by these entities (for now).</p>' },
  notProcessed: { id: 'story.entities.notProcessed', defaultMessage: 'This story has not been processed by our named entity engine.' },
};

class StoryEntitiesContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, storyId } = this.props;
    if (nextProps.storyId !== storyId) {
      fetchData(nextProps.storyId);
    }
  }

  downloadCsv = () => {
    const { storyId } = this.props;
    const url = `/api/stories/${storyId}/entities.csv`;
    window.location = url;
  }

  render() {
    const { entities, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    let entitiesContent = null;
    if (entities) {
      entitiesContent = (
        <Row>
          <Col lg={4}>
            <h3><FormattedMessage {...messages.entityOrganizations} /></h3>
            <NamedEntitiesTable entities={entities.filter(e => e.type === 'ORGANIZATION')} />
          </Col>
          <Col lg={4}>
            <h3><FormattedMessage {...messages.entityPeople} /></h3>
            <NamedEntitiesTable entities={entities.filter(e => e.type === 'PERSON')} />
          </Col>
          <Col lg={4}>
            <h3><FormattedMessage {...messages.entityLocations} /></h3>
            <NamedEntitiesTable entities={entities.filter(e => e.type === 'LOCATION')} />
          </Col>
        </Row>
      );
    } else {
      entitiesContent = (
        <p>
          <i><FormattedMessage {...localMessages.notProcessed} /></i>
        </p>
      );
    }
    return (
      <DataCard className="story-entities-container">
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        {entitiesContent}
      </DataCard>
    );
  }
}

StoryEntitiesContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  storyId: PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  entities: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.story.entities.fetchStatus,
  entities: state.story.entities.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (storyId) => {
    dispatch(fetchStoryEntities(storyId));
  },
  asyncFetch: () => {
    dispatch(fetchStoryEntities(ownProps.storyId));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(localMessages.helpTitle, localMessages.helpIntro)(
      withAsyncFetch(
        StoryEntitiesContainer
      )
    )
  )
);
