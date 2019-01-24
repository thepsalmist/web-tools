import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { updateCollection, fetchCollectionDetails, fetchCollectionSourceList } from '../../../actions/sourceActions';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { updateFeedback } from '../../../actions/appActions';
import CollectionForm from './form/CollectionForm';
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import Permissioned from '../../common/Permissioned';
import { nullOrUndefined } from '../../../lib/formValidators';
import PageTitle from '../../common/PageTitle';
import messages from '../../../resources/messages';

const localMessages = {
  mainTitle: { id: 'collection.mainTitle', defaultMessage: 'Modify this Collection' },
  addButton: { id: 'collection.add.saveAll', defaultMessage: 'Save Changes' },
  feedback: { id: 'collection.add.feedback', defaultMessage: 'We saved your changes to this collection' },
};

const EditCollectionContainer = (props) => {
  const { handleSave, collection, collectionId, sources } = props;
  const { formatMessage } = props.intl;
  const intialValues = {
    ...collection,
    name: collection.label,
    sources,
    static: collection.is_static === true,
    showOnMedia: collection.show_on_media === true,
    showOnStories: collection.show_on_stories === true,
    disabled: collection.is_static === true,
  };
  return (
    <div className="edit-collection">
      <PageTitle value={[messages.edit, collection.label]} />
      <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
        <Grid>
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
            </Col>
          </Row>
          <CollectionForm
            initialValues={intialValues}
            onSave={handleSave}
            buttonLabel={formatMessage(localMessages.addButton)}
            collectionId={collectionId}
          />
        </Grid>
      </Permissioned>
    </div>
  );
};

EditCollectionContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleSave: PropTypes.func.isRequired,
  // form state
  collectionId: PropTypes.number.isRequired,
  collection: PropTypes.object,
  sources: PropTypes.array,
};

const mapStateToProps = state => ({
  collectionId: state.sources.collections.selected.id,
  collection: state.sources.collections.selected.collectionDetails.object,
  sources: state.sources.collections.selected.collectionSourceList.sources,
  fetchStatus: state.sources.collections.selected.collectionSourceList.fetchStatus,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
      id: ownProps.params.collectionId,
      name: values.name,
      description: nullOrUndefined(values.description) ? '' : values.description,
      static: values.static,
      showOnMedia: values.showOnMedia,
      showOnStories: values.showOnStories,
    };
    if ('sources' in values) {
      infoToSave['sources[]'] = values.sources.map(s => (s.id ? s.id : s.media_id));
    } else {
      infoToSave['sources[]'] = [];
    }
    // try to save it
    return dispatch(updateCollection(infoToSave))
      .then(() => {
        dispatch(fetchCollectionDetails(ownProps.params.collectionId))
          .then(() => {
            dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
            return dispatch(push(`/collections/${ownProps.params.collectionId}`));
          });
      });
  },
});

const fetchAsyncData = (dispatch, { collectionId }) => dispatch(fetchCollectionSourceList(collectionId));

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      EditCollectionContainer
    )
  ),
);
