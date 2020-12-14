import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { updateSource, fetchSourceDetails } from '../../../actions/sourceActions';
import { updateFeedback } from '../../../actions/appActions';
import SourceForm from './form/SourceForm';
import { getUserRoles, hasPermissions, PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import Permissioned from '../../common/Permissioned';
import { nullOrUndefined } from '../../../lib/formValidators';
import messages from '../../../resources/messages';
import PageTitle from '../../common/PageTitle';

const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Modify this Source' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Save Changes' },
  feedback: { id: 'source.add.feedback', defaultMessage: 'We saved your changes to this source' },
};

const EditSourceContainer = (props) => {
  const { handleSave, source, user, collectionSets, mediaMetadataSetsByName } = props;
  const { formatMessage } = props.intl;
  const canSeePrivateCollections = hasPermissions(getUserRoles(user), PERMISSION_MEDIA_EDIT);
  const intialValues = {
    ...source,
    // if user cannot edit media, disabled=true
    collections: source.media_source_tags
      .map(t => ({ ...t, name: t.label }))
      .filter(t => (collectionSets.includes(t.tag_sets_id) && (t.show_on_media || canSeePrivateCollections))),
    publicationCountry: source.metadata.pub_country,
    publicationState: source.metadata.pub_state,
    primaryLanguage: source.metadata.language,
    countryOfFocus: source.metadata.about_country,
    mediaType: source.metadata.media_type,
  };
  return (
    <div className="edit-source">
      <PageTitle value={[messages.edit, source.name]} />
      <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
        <Grid>
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
            </Col>
          </Row>
          <SourceForm
            initialValues={intialValues}
            onSave={handleSave}
            buttonLabel={formatMessage(localMessages.addButton)}
            mediaMetadataSetsByName={mediaMetadataSetsByName}
          />
        </Grid>
      </Permissioned>
    </div>
  );
};

EditSourceContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleSave: PropTypes.func.isRequired,
  // form state
  sourceId: PropTypes.number.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  source: PropTypes.object,
  user: PropTypes.object,
  collectionSets: PropTypes.array.isRequired,
  mediaMetadataSetsByName: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  sourceId: parseInt(ownProps.params.sourceId, 10),
  fetchStatus: state.sources.sources.selected.sourceDetails.fetchStatus,
  source: state.sources.sources.selected.sourceDetails,
  user: state.user,
  collectionSets: state.system.staticTags.tagSets.collectionSets,
  mediaMetadataSetsByName: state.system.staticTags.tagSets.mediaMetadataSetsByName,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const metadataTagFormKeys = ['publicationCountry', 'publicationState', 'primaryLanguage', 'countryOfFocus', 'mediaType'];
    const infoToSave = {
      id: ownProps.params.sourceId,
      url: values.url,
      name: values.name,
      editor_notes: nullOrUndefined(values.editor_notes) ? '' : values.editor_notes,
      public_notes: nullOrUndefined(values.public_notes) ? '' : values.public_notes,
      monitored: values.monitored || false,
    };
    metadataTagFormKeys.forEach((key) => { // the metdata tags are encoded in individual properties on the form
      if (key in values) {
        infoToSave[key] = nullOrUndefined(values[key]) ? '' : values[key].tags_id;
      }
    });
    if ('collections' in values) {
      infoToSave['collections[]'] = values.collections.map(s => s.tags_id);
    } else {
      infoToSave['collections[]'] = [];
    }
    return dispatch(updateSource(infoToSave))
      .then((result) => {
        if (result.success === 1) {
          // need to fetch it again because something may have changed
          return dispatch(fetchSourceDetails(ownProps.params.sourceId))
            .then(() => {
              dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
              dispatch(push(`/sources/${ownProps.params.sourceId}`));
            });
        }
        return null; // no promise to return here
      });
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    EditSourceContainer
  ),
);
