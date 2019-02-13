import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import AppButton from '../../../common/AppButton';
import withAsyncData from '../../../common/hocs/AsyncDataContainer';
import { fetchCollectionToCopy } from '../../../../actions/sourceActions';
import messages from '../../../../resources/messages';

const localMessages = {
  confirm: { id: 'collection.media.add.confirm',
    defaultMessage: 'The "{name}" collection has {count} sources.  Do you want to add all {count} of them?',
  },
};

const CollectionCopyConfirmer = ({ collection, onConfirm, onCancel, intl }) => (
  <div className="collection-copy-confirm">
    <p>
      <FormattedMessage
        {...localMessages.confirm}
        values={{ name: collection.label, count: collection.sources.length }}
      />
    </p>
    <AppButton
      onClick={onCancel}
      color="secondary"
    >
      {intl.formatMessage(messages.cancel)}
    </AppButton>
    &nbsp; &nbsp;
    <AppButton
      onClick={() => onConfirm(collection)}
      color="primary"
    >
      {intl.formatMessage(messages.ok)}
    </AppButton>
  </div>
);

CollectionCopyConfirmer.propTypes = {
  // from parent
  collectionId: PropTypes.number.isRequired,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string,
  collection: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.form.toCopy.fetchStatus,
  collection: state.sources.collections.form.toCopy.results,
});

const fetchAsyncData = (dispatch, { collectionId }) => dispatch(fetchCollectionToCopy(collectionId, { getSources: true }));

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData, ['collectionId'])(
      CollectionCopyConfirmer
    )
  )
);
