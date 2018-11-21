import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import withAsyncFetch from '../../../common/hocs/AsyncContainer';
import CollectionIcon from '../../../common/icons/CollectionIcon';
import { fetchGeoCollectionsByCountry } from '../../../../actions/sourceActions';
import CollectionList from '../../../common/CollectionList';

const localMessages = {
  title: { id: 'sources.collections.geo.title', defaultMessage: 'Collections by Country' },
  description: { id: 'sources.collections.geo.description', defaultMessage: 'We have curated a set of collections by geography.  For each country below we have a national collection, which includes media sources that report about the whole country.  For many countries we also have state- or province-level collections, for media sources that are published in and focus on that part of the country.' },
};

const CountryCollectionListContainer = (props) => {
  const { collectionsByCountry, user } = props;
  return (
    <div className="country-collections-table">
      <Grid>
        <Row>
          <Col lg={10}>
            <h1>
              <CollectionIcon height={32} />
              <FormattedMessage {...localMessages.title} />
            </h1>
            <p><FormattedMessage {...localMessages.description} /></p>
          </Col>
        </Row>
        {collectionsByCountry.map((countryInfo, idx) => (
          <Row key={idx}>
            <Col lg={10}>
              <div>
                <CollectionList
                  collections={countryInfo.collections}
                  title={countryInfo.country.name}
                  user={user}
                  dataCard={false}
                />
              </div>
            </Col>
          </Row>
        ))}
      </Grid>
    </div>
  );
};

CountryCollectionListContainer.propTypes = {
  // from state
  fetchStatus: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  collectionsByCountry: PropTypes.array.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.geo.fetchStatus,
  user: state.user,
  collectionsByCountry: state.sources.collections.geo.byCountry,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchGeoCollectionsByCountry());
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      CountryCollectionListContainer
    )
  )
);
