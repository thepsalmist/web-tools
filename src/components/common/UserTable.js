import PropTypes from 'prop-types';
import React from 'react';
import Link from 'react-router/lib/Link';
import { FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';
import messages from '../../resources/messages';

const UserTable = (props) => {
  const { users } = props;
  const content = null;
  if (users === undefined) {
    return (
      <div>
        { content }
      </div>
    );
  }
  return (
    <div className="source-table">
      <table width="100%">
        <tbody>
          <tr>
            <th colSpan="2"><FormattedMessage {...messages.sourceName} /></th>
            <th className="numeric"><FormattedMessage {...messages.storiesPerDay} /></th>
            <th className="numeric"><FormattedMessage {...messages.sourceStartDate} /></th>
          </tr>
          {users.map((user, idx) => (
            <tr key={user.id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
              <td>
                <Link to={`/admin/users/${user.id}`}>{user.name}</Link>
              </td>
              <td className="permissions"><FormattedNumber value={user} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.array,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(UserTable);
