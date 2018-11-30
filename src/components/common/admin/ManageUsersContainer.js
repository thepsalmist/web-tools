import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../hocs/AsyncContainer';
import withPaging from '../hocs/PagedContainer';
import { fetchSystemUsers } from '../../../actions/systemActions';
import { notEmptyString } from '../../../lib/formValidators';
import UserTable from '../UserTable';

const ManageUsersContainer = props => <div><UserTable users={props.users} /></div>;

ManageUsersContainer.propTypes = {
  // from Hoc
  intl: PropTypes.object.isRequired,
  prevButton: PropTypes.node,
  nextButton: PropTypes.node,
  // from state
  fetchStatus: PropTypes.string,
  users: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.system.users.allUsers.fetchStatus,
  users: state.system.users.allUsers.users,
  links: state.system.users.allUsers.link_ids,
  searchStr: ownProps.params.searchStr,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    if (notEmptyString(ownProps.params.searchStr)) {
      return dispatch(fetchSystemUsers(ownProps.params.searchStr));
    }
    return dispatch(fetchSystemUsers());
  },
  fetchPagedData: (props, linkId) => {
    if (notEmptyString(ownProps.params.searchStr)) {
      return dispatch(fetchSystemUsers(ownProps.params.searchStr, linkId));
    }
    return dispatch(fetchSystemUsers(linkId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    nextPage: () => {
      dispatchProps.fetchPagedData(stateProps, stateProps.links.next);
    },
    previousPage: () => {
      dispatchProps.fetchPagedData(stateProps, stateProps.links.previous);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withAsyncFetch(
      withPaging(
        ManageUsersContainer
      )
    )
  )
);
