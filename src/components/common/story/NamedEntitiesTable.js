import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';

const localMessages = {
  entityName: { id: 'story.entity.name', defaultMessage: 'Name' },
  entityFrequency: { id: 'story.entity.frequency', defaultMessage: 'Occurences' },
};

const NamedEntitiesTable = props => (
  <div className="story-entity-table">
    <table>
      <tbody>
        <tr>
          <th><FormattedMessage {...localMessages.entityName} /></th>
          <th className="numeric"><FormattedMessage {...localMessages.entityFrequency} /></th>
        </tr>
        {props.entities.map((entity, idx) => (
          <tr key={`entity-${idx}`} className={(idx % 2 === 0) ? 'even' : 'odd'}>
            <td>{entity.name}</td>
            <td className="numeric"><FormattedNumber value={entity.frequency} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

NamedEntitiesTable.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  entities: PropTypes.array.isRequired,
};

export default
injectIntl(
  NamedEntitiesTable
);
