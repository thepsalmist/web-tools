import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import withAsyncFetch from '../../../common/hocs/AsyncContainer';
import CollectionIcon from '../../../common/icons/CollectionIcon';
import { fetchCollectionList } from '../../../../actions/sourceActions';
import CollectionList from '../../../common/CollectionList';
import { TAG_SET_ABYZ_GEO_COLLECTIONS } from '../../../../lib/tagUtil';

const CountryCollectionListContainer = (props) => {
  const { name, description, collections, user } = props;
  // collection parsing here - maybe move into reducer or back end
  const nationalCollections = collections.filter(c => c.label.endsWith('National'));
  return (
    <div className="country-collections-table">
      <Grid>
        <Row>
          <Col lg={12}>
            <h1>
              <CollectionIcon height={32} />
              {name}
            </h1>
            <p>{description}</p>
          </Col>
        </Row>
        {nationalCollections.map((nationalCollection) => {
          const countryName = nationalCollection.label.substring(0, nationalCollection.label.length - 11);
          return (
            <Row key={nationalCollection.tags_id}>
              <Col lg={10}>
                <div>
                  <CollectionList
                    collections={collections.filter(c => c.label.includes(countryName))}
                    title={countryName}
                    user={user}
                    dataCard={false}
                  />
                </div>
              </Col>
            </Row>
          );
        })}
      </Grid>
    </div>
  );
};

CountryCollectionListContainer.propTypes = {
  // from state
  collections: PropTypes.array.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  fetchStatus: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.all.fetchStatus,
  user: state.user,
  name: state.sources.collections.all.name,
  description: state.sources.collections.all.description,
  collections: state.sources.collections.all.collections,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchCollectionList(TAG_SET_ABYZ_GEO_COLLECTIONS));
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
