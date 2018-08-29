import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { push } from 'react-router-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { updateSource, fetchSourceDetails } from '../../../actions/sourceActions';
import { updateFeedback } from '../../../actions/appActions';
import SourceForm from './form/SourceForm';
import { isCollectionTagSet, TAG_SET_PUBLICATION_COUNTRY, TAG_SET_PUBLICATION_STATE, TAG_SET_PRIMARY_LANGUAGE, TAG_SET_COUNTRY_OF_FOCUS, TAG_SET_MEDIA_TYPE } from '../../../lib/tagUtil';
import { getUserRoles, hasPermissions, PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import Permissioned from '../../common/Permissioned';
import { nullOrUndefined } from '../../../lib/formValidators';

const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Modify this Source' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Save Changes' },
  feedback: { id: 'source.add.feedback', defaultMessage: 'We saved your changes to this source' },
};

const EditSourceContainer = (props) => {
  const { handleSave, source, user } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  const pubCountry = source.media_source_tags.find(t => t.tag_sets_id === TAG_SET_PUBLICATION_COUNTRY);
  const pubState = source.media_source_tags.find(t => t.tag_sets_id === TAG_SET_PUBLICATION_STATE);
  const pLanguage = source.media_source_tags.find(t => t.tag_sets_id === TAG_SET_PRIMARY_LANGUAGE);
  const pCountryFocus = source.media_source_tags.find(t => t.tag_sets_id === TAG_SET_COUNTRY_OF_FOCUS);
  const pMediaType = source.media_source_tags.find(t => t.tag_sets_id === TAG_SET_MEDIA_TYPE);
  const canSeePrivateCollections = hasPermissions(getUserRoles(user), PERMISSION_MEDIA_EDIT);
  const intialValues = {
    ...source,
    // if user cannot edit media, disabled=true
    collections: source.media_source_tags
      .map(t => ({ ...t, name: t.label }))
      .filter(t => (isCollectionTagSet(t.tag_sets_id) && (t.show_on_media || canSeePrivateCollections))),
    publicationCountry: pubCountry ? pubCountry.tags_id : undefined,
    publicationState: pubState ? pubState.tags_id : undefined,
    primaryLanguage: pLanguage ? pLanguage.tags_id : undefined,
    countryOfFocus: pCountryFocus ? pCountryFocus.tags_id : undefined,
    mediaType: pMediaType ? pMediaType.tags_id : undefined,
  };
  return (
    <div className="edit-source">
      <Helmet><title>{titleHandler()}</title></Helmet>
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
};

const mapStateToProps = (state, ownProps) => ({
  sourceId: parseInt(ownProps.params.sourceId, 10),
  fetchStatus: state.sources.sources.selected.sourceDetails.fetchStatus,
  source: state.sources.sources.selected.sourceDetails,
  user: state.user,
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
        infoToSave[key] = nullOrUndefined(values[key]) ? '' : values[key];
      }
    });
    if ('collections' in values) {
      infoToSave['collections[]'] = values.collections.map(s => s.tags_id);
    } else {
      infoToSave['collections[]'] = [];
    }
    dispatch(updateSource(infoToSave))
      .then((result) => {
        if (result.success === 1) {
          // need to fetch it again because something may have changed
          dispatch(fetchSourceDetails(ownProps.params.sourceId))
            .then(() => {
              dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
              dispatch(push(`/sources/${ownProps.params.sourceId}`));
            });
        }
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      EditSourceContainer
    ),
  );
