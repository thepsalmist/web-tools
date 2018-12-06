import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withAsyncFetch from '../hocs/AsyncContainer';
import withPaging from '../hocs/PagedContainer';
import { fetchSystemUsers, deleteSystemUser } from '../../../actions/systemActions';
import { notEmptyString } from '../../../lib/formValidators';
import { updateFeedback } from '../../../actions/appActions';
import UserTable from '../UserTable';
import UserSearchForm from './form/UserSearchForm';
import { PERMISSION_ADMIN } from '../../../lib/auth';
import Permissioned from '../Permissioned';

const formSelector = formValueSelector('userSearchForm');

const localMessages = {
  userTitle: { id: 'user.all.title', defaultMessage: 'Users' },
  feedback: { id: 'user.all.user.delete.feedback', defaultMessage: 'Successfully deleted user.' },
};

const ManageUsersContainer = props => (
  <Grid>
    <Permissioned onlyRole={PERMISSION_ADMIN}>
      <h1>
        <FormattedMessage {...localMessages.userTitle} />
      </h1>
      <Row><UserSearchForm onSearch={searchStr => props.fetchData(searchStr)} /></Row>
      <br /><br />
      <Row>
        <Col lg={12}>
          <UserTable users={props.users} onDeleteUser={userId => props.handleDeleteUser(userId)} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          {props.previousButton} {props.nextButton}
        </Col>
      </Row>
    </Permissioned>
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
  handleDeleteUser: PropTypes.func.isRequired,
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
  handleDeleteUser: (userId) => {
    dispatch(deleteSystemUser(userId))
      .then((result) => {
        if (result.success) {
          // let them know it worked
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // need to fetch it again because something may have changed
          dispatch(fetchSystemUsers());
        }
      });
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
