import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { fetchSimilarCollections } from '../../../actions/sourceActions';
import withHelp from '../../common/hocs/HelpfulContainer';
import CollectionList from '../../common/CollectionList';

const localMessages = {
  similarCollectionsTitle: { id: 'collections.similar.title', defaultMessage: 'Similar Collections' },
  helpTitle: { id: 'collection.summary.similar.help.text.title', defaultMessage: 'Similar Collections' },
  helpText: { id: 'collection.summary.similar.help.text', defaultMessage: 'Here is a list of similar collections, based on how many sources they have in common. This can be a great way to discover other collecitons you might want to be using. Click one to explore it.' },
};

const CollectionSimilarContainer = (props) => {
  const { similarCollections, user, helpButton } = props;
  const { formatMessage } = props.intl;
  return (
    <div className="similar-collections">
      <CollectionList
        title={formatMessage(localMessages.similarCollectionsTitle)}
        collections={similarCollections}
        user={user}
        helpButton={helpButton}
      />
    </div>
  );
};

CollectionSimilarContainer.propTypes = {
  // from state
  fetchStatus: PropTypes.string.isRequired,
  total: PropTypes.number,
  user: PropTypes.object.isRequired,
  // from parent
  collectionId: PropTypes.number.isRequired,
  similarCollections: PropTypes.array,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.selected.collectionSimilar.fetchStatus,
  similarCollections: state.sources.collections.selected.collectionSimilar.list,
  user: state.user,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchSimilarCollections(ownProps.collectionId));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpText])(
      withAsyncFetch(
        CollectionSimilarContainer
      )
    )
  )
);
