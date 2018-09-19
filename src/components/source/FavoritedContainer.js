import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withAsyncFetch from '../common/hocs/AsyncContainer';
import { fetchFavoriteSources, fetchFavoriteCollections } from '../../actions/systemActions';
import SourceList from '../common/SourceList';
import CollectionList from '../common/CollectionList';

const localMessages = {
  title: { id: 'sources.menu.items.favoritedItems', defaultMessage: 'My Starred Sources And Collections' },
  favoritedCollectionsTitle: { id: 'favorited.collections.title', defaultMessage: 'My Starred Collections' },
  favoritedCollectionsIntro: { id: 'favorited.collections.intro', defaultMessage: 'These are collections you have starred by clicking the star next to their name.  This is useful to bookmark collections you use frequently.' },
  favoritedSourcesTitle: { id: 'favorited.souces.title', defaultMessage: 'My Starred Sources' },
  favoritedSourcesIntro: { id: 'favorited.souces.intro', defaultMessage: 'These are sources you have starred by clicking the star next to their name.  This is useful to bookmark sources you use frequently.' },
};

const FavoritedContainer = (props) => {
  const { favoritedSources, favoritedCollections } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
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
          />
        </Col>
      </Row>
    </Grid>
  );
};

FavoritedContainer.propTypes = {
  // from state
  fetchStatus: PropTypes.string,
  total: PropTypes.number,
  // from parent
  favoritedSources: PropTypes.array.isRequired,
  favoritedCollections: PropTypes.array.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.favorited.fetchStatus,
  favoritedSources: state.sources.sources.favorited.list,
  favoritedCollections: state.sources.collections.favorited.list,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchFavoriteCollections());
    dispatch(fetchFavoriteSources());
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      FavoritedContainer
    )
  )
);
