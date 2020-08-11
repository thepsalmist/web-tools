import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withAsyncData from '../common/hocs/AsyncDataContainer';
import { fetchFavoriteSources, fetchFavoriteCollections } from '../../actions/systemActions';
import SourceList from '../common/SourceList';
import CollectionList from '../common/CollectionList';
import PageTitle from '../common/PageTitle';

const localMessages = {
  starred: { id: 'sources.starred', defaultMessage: 'Starred' },
  title: { id: 'sources.menu.items.favoritedItems', defaultMessage: 'My Starred Sources And Collections' },
  favoritedCollectionsTitle: { id: 'favorited.collections.title', defaultMessage: 'My Starred Collections' },
  favoritedCollectionsIntro: { id: 'favorited.collections.intro', defaultMessage: 'These are collections you have starred by clicking the star next to their name.  This is useful to bookmark collections you use frequently.' },
  favoritedSourcesTitle: { id: 'favorited.souces.title', defaultMessage: 'My Starred Sources' },
  favoritedSourcesIntro: { id: 'favorited.souces.intro', defaultMessage: 'These are sources you have starred by clicking the star next to their name.  This is useful to bookmark sources you use frequently.' },
};

const FavoritedContainer = (props) => {
  const { favoritedSources, favoritedCollections, collectionSets } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <PageTitle value={localMessages.starred} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.title} /></h1>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <SourceList
            title={formatMessage(localMessages.favoritedSourcesTitle)}
            intro={formatMessage(localMessages.favoritedSourcesIntro)}
            sources={favoritedSources}
          />
        </Col>
        <Col lg={6}>
          <CollectionList
            title={formatMessage(localMessages.favoritedCollectionsTitle)}
            intro={formatMessage(localMessages.favoritedCollectionsIntro)}
            collections={favoritedCollections}
            collectionSets={collectionSets}
          />
        </Col>
      </Row>
    </Grid>
  );
};

FavoritedContainer.propTypes = {
  // from state
  fetchStatus: PropTypes.array,
  total: PropTypes.number,
  collectionSets: PropTypes.array.isRequired,
  // from parent
  favoritedSources: PropTypes.array.isRequired,
  favoritedCollections: PropTypes.array.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
};

export const mapStateToProps = state => ({
  fetchStatus: [state.sources.collections.favorited.fetchStatus, state.sources.sources.favorited.fetchStatus],
  favoritedSources: state.sources.sources.favorited.list,
  favoritedCollections: state.sources.collections.favorited.list,
  collectionSets: state.system.staticTags.tagSets.collectionSets,
});

export const fetchAsyncData = (dispatch) => {
  dispatch(fetchFavoriteCollections());
  dispatch(fetchFavoriteSources());
};

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      FavoritedContainer
    )
  )
);
