import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withAsyncData from '../../../common/hocs/AsyncDataContainer';
import { fetchCollectionList } from '../../../../actions/sourceActions';
import CollectionTable from '../../../common/CollectionTable';
import TabSelector from '../../../common/TabSelector';
import { PERMISSION_MEDIA_EDIT, getUserRoles, hasPermissions } from '../../../../lib/auth';
import Permissioned from '../../../common/Permissioned';
import PageTitle from '../../../common/PageTitle';

const localMessages = {
  private: { id: 'sources.collections.mc.private', defaultMessage: 'Private' },
  public: { id: 'sources.collections.mc.public', defaultMessage: 'Public' },
};

class MCCollectionListContainer extends React.Component {
  state = {
    selectedViewIndex: 0,
  };

  render() {
    const { name, collections, linkToFullUrl, user, collectionSets } = this.props;
    const { formatMessage } = this.props.intl;
    const canSeePrivateCollections = hasPermissions(getUserRoles(user), PERMISSION_MEDIA_EDIT);
    const privateColl = collections.filter(t => (collectionSets.includes(t.tag_sets_id) && (!t.show_on_media || canSeePrivateCollections)));
    const allOtherCollections = collections.filter(t => (collectionSets.includes(t.tag_sets_id) && (t.show_on_media)));

    let selectedTabCollections = allOtherCollections;
    if (this.state.selectedViewIndex === 0) {
      selectedTabCollections = allOtherCollections;
    } else {
      selectedTabCollections = privateColl;
    }
    return (
      <div className="mc-collections-table">
        <PageTitle value={name} />
        <Grid>
          <h1>{name}</h1>
          <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
            <TabSelector
              tabLabels={[
                formatMessage(localMessages.public),
                formatMessage(localMessages.private),
              ]}
              onViewSelected={index => this.setState({ selectedViewIndex: index })}
            />
            <br />
          </Permissioned>
          <Row>
            <Col lg={12}>
              <div className="collection-list-item-wrapper">
                <CollectionTable collections={selectedTabCollections} absoluteLink={linkToFullUrl} />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

MCCollectionListContainer.propTypes = {
  // from state
  collections: PropTypes.array.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  user: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  collectionSets: PropTypes.array.isRequired,
  collectionsSet: PropTypes.number.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
  linkToFullUrl: PropTypes.bool,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.all.fetchStatus,
  name: state.sources.collections.all.name,
  description: state.sources.collections.all.description,
  collections: state.sources.collections.all.collections,
  user: state.user,
  collectionsSets: state.system.staticTags.tagSets.collectionSets,
  collectionsSet: state.system.staticTags.tagSets.collectionsSet,
});

const fetchAsyncData = (dispatch, { collectionsSet }) => dispatch(fetchCollectionList(collectionsSet));

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      MCCollectionListContainer
    )
  )
);
