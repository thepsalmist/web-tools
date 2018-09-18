import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row } from 'react-flexbox-grid/lib';
import CollectionResultsTable from './CollectionResultsTable';
import StarredSearchResultsContainer from './StarredSearchResultsContainer';
import { FETCH_ONGOING } from '../../../../lib/fetchConstants';
import LoadingSpinner from '../../LoadingSpinner';
import TabSelector from '../../TabSelector';

const localMessages = {
  title: { id: 'system.mediaPicker.collections.title', defaultMessage: 'Collections matching "{name}"' },
  hintText: { id: 'system.mediaPicker.collections.hint', defaultMessage: 'Search for collections by name' },
  noResults: { id: 'system.mediaPicker.collections.noResults', defaultMessage: 'No results. Try searching for issues like online news, health, blogs, conservative to see if we have collections made up of those types of sources.' },
  featured: { id: 'system.mediaPicker.collections.featured', defaultMessage: 'Featured Collections' },
  favorited: { id: 'system.mediaPicker.collections.favorite', defaultMessage: 'Starred' },
};

const VIEW_FAVORITES = 0;
// const VIEW_FEATURED = 1;

class TabSearchResultsContainer extends React.Component {
  state = {
    selectedViewIndex: VIEW_FAVORITES,
  };

  render() {
    const { queryResults, handleToggleAndSelectMedia, fetchStatus, displayResults } = this.props;
    const { formatMessage } = this.props.intl;
    const tabs = (
      <div className="media-picker-results-container">
        <Grid>
          <Row>
            <TabSelector
              tabLabels={[
                formatMessage(localMessages.favorited),
                formatMessage(localMessages.featured),
              ]}
              onViewSelected={index => this.setState({ selectedViewIndex: index })}
            />
          </Row>
        </Grid>
      </div>
    );
    let tabContent = null;
    if (fetchStatus === FETCH_ONGOING || !displayResults) {
      // we have to do this here to show a loading spinner when first searching (and featured collections are showing)
      tabContent = <LoadingSpinner />;
    } else if (this.state.selectedViewIndex === VIEW_FAVORITES
      && queryResults && (queryResults.favoritedCollections || queryResults.favoritedSources)) {
      tabContent = (
        <div className="media-picker-tabbed-content-wrapper">
          <StarredSearchResultsContainer
            title={formatMessage(localMessages.title, { name: 'Starred' })}
            favoritedCollections={queryResults.favoritedCollections}
            favoritedSources={queryResults.favoritedSources}
            handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          />
        </div>
      );
    } else if (displayResults && queryResults && (queryResults.featured)) {
      tabContent = (
        <div className="media-picker-tabbed-content-wrapper">
          <CollectionResultsTable
            title={formatMessage(localMessages.featured)}
            collections={queryResults.featured}
            handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          />
        </div>
      );
    } else {
      tabContent = <FormattedMessage {...localMessages.noResults} />;
    }
    return (
      <div>
        {tabs}
        {tabContent}
      </div>
    );
  }
}


TabSearchResultsContainer.propTypes = {
  // form compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  whichTagSet: PropTypes.number,
  hintTextMsg: PropTypes.object,
  onSearch: PropTypes.func.isRequired,
  // from state
  selectedMediaQueryType: PropTypes.number,
  queryResults: PropTypes.object,
  initItems: PropTypes.object,
  fetchStatus: PropTypes.string,
  displayResults: PropTypes.bool,
};

export default
injectIntl(
  connect()(
    TabSearchResultsContainer
  )
);
