import PropTypes from 'prop-types';
import React from 'react';
import Link from 'react-router/lib/Link';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../resources/messages';
import AppButton from '../AppButton';
import ConfirmationDialog from '../ConfirmationDialog';
import { DeleteButton } from '../IconButton';

const localMessages = {
  deleteDialogTitle: { id: 'updateQuery.update.title', defaultMessage: 'Confirm Delete User' },
  deleteDialogText: { id: 'updateQuery.update.text', defaultMessage: 'Are you sure you want to permanently delete this user?' },
};

class UserTable extends React.Component {
  state = {
    open: false,
    userToDelete: null,
  };

  actuallyDelete = () => {
    const { onDeleteUser } = this.props;
    onDeleteUser(this.state.userToDelete);
    this.setState({ open: false, userToDelete: null });
  };

  confirmDelete = (userId) => {
    this.setState({ open: true, userToDelete: userId });
  };

  render() {
    const { users } = this.props;
    const { formatMessage } = this.props.intl;
    const content = null;
    if (users === undefined) {
      return (
        <div>
          { content }
        </div>
      );
    }
    const confirmationDlg = (
      <ConfirmationDialog
        open={this.state.open}
        title={formatMessage(localMessages.deleteDialogTitle)}
        okText={formatMessage(messages.ok)}
        onOk={this.actuallyDelete}
        onCancel={() => this.setState({ open: false })}
      >
        <FormattedMessage {...localMessages.deleteDialogText} />
      </ConfirmationDialog>
    );
    return (
      <div className="user-table">
        <table width="100%">
          <tbody>
            <tr>
              <th><FormattedMessage {...messages.userEmail} /></th>
              <th><FormattedMessage {...messages.userFullName} /></th>
              <th><FormattedMessage {...messages.userPermissions} /></th>
              <th><FormattedMessage {...messages.edit} /></th>
              <th><FormattedMessage {...messages.delete} /></th>
            </tr>
            {users.map((user, idx) => {
              let roles = user.roles.map(r => r.role);
              roles = Object.values(roles).toString();
              return (
                <tr key={user.auth_users_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                  <td className="email">{user.email}</td>
                  <td>
                    <Link to={`admin/users/${user.auth_users_id}/update`}>{user.full_name}</Link>
                  </td>
                  <td className="permissions">{roles}</td>
                  <td className="edit">
                    <Link to={`admin/users/${user.auth_users_id}/update`}>
                      <AppButton label="edit" />
                    </Link>
                  </td>
                  <td className="delete">
                    <DeleteButton label="delete" onClick={() => this.confirmDelete(user.auth_users_id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {confirmationDlg}
      </div>
    );
  }
}

UserTable.propTypes = {
  users: PropTypes.array,
  intl: PropTypes.object.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
};

export default injectIntl(UserTable);
