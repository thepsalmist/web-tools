import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import withAsyncFetch from '../hocs/AsyncContainer';
import { fetchSystemUsers } from '../../../actions/systemActions';
import UserTable from '../UserTable';

const ManageUsersContainer = props => <UserTable users={props.users} />;

ManageUsersContainer.propTypes = {
  // from state
  fetchStatus: PropTypes.object,
  users: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.users.allUsers.fetchStatus,
  users: state.system.users.allUsers.users,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchSystemUsers());
  },
});

export default
connect(mapStateToProps, mapDispatchToProps)(
  withAsyncFetch(
    ManageUsersContainer
  )
);
