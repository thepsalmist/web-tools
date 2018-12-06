import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import withAsyncFetch from '../../hocs/AsyncContainer';
import withPaging from '../../hocs/PagedContainer';
import { fetchSystemUsers, deleteSystemUser } from '../../../../actions/systemActions';
import { notEmptyString } from '../../../../lib/formValidators';
import { updateFeedback } from '../../../../actions/appActions';
import UserTable from '../UserTable';

const localMessages = {
  userTitle: { id: 'user.all.title', defaultMessage: 'Users' },
  feedback: { id: 'user.all.user.delete.feedback', defaultMessage: 'Successfully deleted user.' },
};

class UserListContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { searchStr, fetchData } = this.props;
    if (nextProps.searchStr !== searchStr) {
      fetchData(nextProps.searchStr);
    }
  }

  render() {
    const { users, handleDeleteUser, previousButton, nextButton } = this.props;
    return (
      <React.Fragment>
        <Row>
          <Col lg={12}>
            <UserTable users={users} onDeleteUser={userId => handleDeleteUser(userId)} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            {previousButton} {nextButton}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

UserListContainer.propTypes = {
  // from hoc
  previousButton: PropTypes.node,
  nextButton: PropTypes.node,
  // from parent
  searchStr: PropTypes.string,
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
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (searchStr) => {
    if (notEmptyString(searchStr)) {
      return dispatch(fetchSystemUsers({ searchStr }));
    }
    return dispatch(fetchSystemUsers());
  },
  asyncFetch: () => dispatch(fetchSystemUsers()),
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
        UserListContainer
      )
    )
  )
);
