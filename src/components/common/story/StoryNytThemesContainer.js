import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { fetchStoryNytThemes } from '../../../actions/storyActions';
import withAsyncFetch from '../hocs/AsyncContainer';
import withHelp from '../hocs/HelpfulContainer';
import messages from '../../../resources/messages';
import DataCard from '../DataCard';
import { DownloadButton } from '../IconButton';

const localMessages = {
  title: { id: 'story.themes.title', defaultMessage: 'Themes' },
  helpTitle: { id: 'story.themes.help.title', defaultMessage: 'About Themes' },
  noThemes: { id: 'story.themes.none', defaultMessage: 'None' },
  notProcessed: { id: 'story.themes.notProcessed', defaultMessage: 'This story has not been processed by our theme analyzer.' },
  themeName: { id: 'story.theme.name', defaultMessage: 'Theme' },
  themeScore: { id: 'story.theme.score', defaultMessage: 'Score' },
  showDetails: { id: 'story.theme.showDetails', defaultMessage: 'Show Details' },
  hideDetails: { id: 'story.theme.hideDetails', defaultMessage: 'Hide Details' },
};

class StoryNytThemesContainer extends React.Component {
  state = {
    showingFullList: false,
  };

  componentWillReceiveProps(nextProps) {
    const { fetchData, storyId } = this.props;
    if (nextProps.storyId !== storyId) {
      fetchData(nextProps.storyId);
    }
  }

  downloadCsv = () => {
    const { storyId } = this.props;
    const url = `/api/stories/${storyId}/nyt-themes.csv`;
    window.location = url;
  }

  render() {
    const { themes, helpButton, tags, hideFullListOption } = this.props;
    const { formatMessage } = this.props.intl;
    let tagContent;
    if (tags && (tags.length > 0)) {
      tagContent = (
        <ul>
          {tags.map(t => <li key={t.tags_id}>{t.tag}</li>)}
        </ul>
      );
    } else {
      tagContent = <FormattedMessage {...localMessages.noThemes} />;
    }
    let allThemesContent;
    if (themes) {
      allThemesContent = (
        <div className="nyt-theme-table">
          <table>
            <tbody>
              <tr>
                <th><FormattedMessage {...localMessages.themeName} /></th>
                <th className="numeric"><FormattedMessage {...localMessages.themeScore} /></th>
              </tr>
              {themes.map((theme, idx) => (
                <tr key={`theme-${idx}`} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                  <td>{theme.label}</td>
                  <td className="numeric"><FormattedNumber value={theme.score} minimumFractionDigits={3} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      allThemesContent = (
        <p>
          <i><FormattedMessage {...localMessages.notProcessed} /></i>
        </p>
      );
    }
    let fullListContent;
    if (this.state.showingFullList) {
      fullListContent = (
        <span>
          <a
            href={`#${formatMessage(localMessages.hideDetails)}`}
            onClick={(evt) => { this.setState({ showingFullList: false }); evt.preventDefault(); }}
          >
            <FormattedMessage {...localMessages.hideDetails} />
          </a>
          {allThemesContent}
        </span>
      );
    } else {
      fullListContent = (
        <span>
          <a
            href={`#${formatMessage(localMessages.showDetails)}`}
            onClick={(evt) => { this.setState({ showingFullList: true }); evt.preventDefault(); }}
          >
            <FormattedMessage {...localMessages.showDetails} />
          </a>
        </span>
      );
    }
    return (
      <DataCard className="story-themes-container">
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <Row>
          <Col lg={12}>
            <h2><FormattedMessage {...localMessages.title} />{helpButton}</h2>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            {tagContent}
            {!hideFullListOption && fullListContent}
          </Col>
        </Row>
      </DataCard>
    );
  }
}

StoryNytThemesContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  storyId: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired,
  hideFullListOption: PropTypes.bool,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  themes: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.story.nytThemes.fetchStatus,
  themes: state.story.nytThemes.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (storyId) => {
    dispatch(fetchStoryNytThemes(storyId));
  },
  asyncFetch: () => {
    dispatch(fetchStoryNytThemes(ownProps.storyId));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(localMessages.helpTitle, messages.nytThemeHelpDetails)(
      withAsyncFetch(
        StoryNytThemesContainer
      )
    )
  )
);
