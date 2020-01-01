import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import withAsyncData from '../../hocs/AsyncDataContainer';
import withPaging from '../../hocs/PagedContainer';
import { fetchSystemUsers, deleteSystemUser } from '../../../../actions/systemActions';
import { updateFeedback } from '../../../../actions/appActions';
import UserTable from './UserTable';

const localMessages = {
  userTitle: { id: 'user.all.title', defaultMessage: 'Users' },
  feedback: { id: 'user.all.user.delete.feedback', defaultMessage: 'Successfully deleted user.' },
};

const UserListContainer = ({ users, handleDeleteUser, previousButton, nextButton }) => (
  <>
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
  </>
);

UserListContainer.propTypes = {
  // from hoc
  previousButton: PropTypes.node,
  nextButton: PropTypes.node,
  // from parent
  searchStr: PropTypes.string,
  // from state
  fetchStatus: PropTypes.string,
  users: PropTypes.array,
  handleDeleteUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.users.allUsers.fetchStatus,
  users: state.system.users.allUsers.users,
  links: state.system.users.allUsers.link_ids,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleDeleteUser: (userId) => {
    dispatch(deleteSystemUser(userId))
      .then((result) => {
        if (result.success) {
          // let them know it worked
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // need to fetch it again because something may have changed
          dispatch(fetchSystemUsers({ searchStr: ownProps.searchStr }));
        }
      });
  },
});

const fetchAsyncData = (dispatch, { searchStr }) => dispatch(fetchSystemUsers({ searchStr }));

const handlePageChange = (dispatch, { searchStr }, linkId) => dispatch(fetchSystemUsers({ searchStr, linkId }));

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData, ['searchStr'])(
      withPaging(handlePageChange)(
        UserListContainer
      )
    )
  )
);
