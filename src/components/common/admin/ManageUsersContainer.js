import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { Grid, Row } from 'react-flexbox-grid/lib';
import withAsyncFetch from '../hocs/AsyncContainer';
import withPaging from '../hocs/PagedContainer';
import { fetchSystemUsers } from '../../../actions/systemActions';
import { notEmptyString } from '../../../lib/formValidators';
import UserTable from '../UserTable';
import UserSearchForm from './form/UserSearchForm';


const formSelector = formValueSelector('userSearchForm');

const localMessages = {
  userTitle: { id: 'user.all.title', defaultMessage: 'Users' },
};

const ManageUsersContainer = props => (
  <Grid>
    <h1>
      <FormattedMessage {...localMessages.userTitle} />
    </h1>
    <Row><UserSearchForm onSearch={searchStr => props.fetchData(searchStr)} /></Row>
    <br /><br />
    <Row>
      <UserTable users={props.users} />
      <Row>{props.previousButton}{props.nextButton}</Row>
    </Row>
  </Grid>
);

ManageUsersContainer.propTypes = {
  // from Hoc
  intl: PropTypes.object.isRequired,
  previousButton: PropTypes.node,
  nextButton: PropTypes.node,
  // from state
  fetchStatus: PropTypes.string,
  users: PropTypes.array,
  fetchData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.users.allUsers.fetchStatus,
  users: state.system.users.allUsers.users,
  links: state.system.users.allUsers.link_ids,
  searchStr: formSelector(state, 'searchStr'),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (searchStr) => {
    if (notEmptyString(Object.values(searchStr)[0])) {
      return dispatch(fetchSystemUsers(searchStr));
    }
    return dispatch(fetchSystemUsers());
  },
  asyncFetch: () => {
    if (ownProps.location.query !== undefined) {
      return dispatch(fetchSystemUsers(ownProps.location.query));
    }
    return dispatch(fetchSystemUsers());
  },
  fetchPagedData: (props, linkId) => {
    if (notEmptyString(ownProps.params.searchStr)) {
      return dispatch(fetchSystemUsers({ searchStr: ownProps.params.searchStr, linkId }));
    }
    return dispatch(fetchSystemUsers({ linkId }));
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
