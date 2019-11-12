import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { EditButton, AddButton } from './IconButton';

const localMessages = {
  platform: { id: 'platform.manage.platform',
    defaultMessage: 'Platform' },
  seedQueryDescription: { id: 'platform.manage.seedQuery', defaultMessage: 'Seed Query' },
  addOrEditOrRemove: { id: 'platform.manage.whatToDo',
    defaultMessage: 'Add or Edit or Remove (TBD)' },
};

const PlatformTable = props => (
  <div className="platform-table">
    <table width="100%">
      <tbody>
        <tr>
          <th><FormattedMessage {...localMessages.platform} /></th>
          <th><FormattedMessage {...localMessages.seedQueryDescription} /></th>
          <th><FormattedMessage {...localMessages.addOrEditOrRemove} /></th>
        </tr>
        {props.platforms.map((c, idx) => (
          <tr key={c.platform} className={(idx % 2 === 0) ? 'even' : 'odd'}>
            <td>
              {c.platform}
            </td>
            <td>
              {c.platform_seed_query}
            </td>
            <td>
              {c.id ? <EditButton /> : <AddButton />}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

PlatformTable.propTypes = {
  // from parent
  platforms: PropTypes.object.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  PlatformTable
);
