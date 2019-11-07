import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../resources/messages';

const PlatformTable = props => (
  <div className="platform-table">
    <table width="100%">
      <tbody>
        <tr>
          <th><FormattedMessage {...messages.collectionNameProp} /></th>
          <th><FormattedMessage {...messages.collectionDescriptionProp} /></th>
        </tr>
        {props.platforms.map((c, idx) => (
          <tr key={c.platform} className={(idx % 2 === 0) ? 'even' : 'odd'}>
            <td>
              {c.platform}
            </td>
            <td>
              {c.platform_seed_query}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

PlatformTable.propTypes = {
  // from parent
  platforms: PropTypes.array.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  PlatformTable
);
