import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  title: { id: 'topic.info.title', defaultMessage: 'Next Version: Subtopic Summary' },
};

const FocalSetDefinitionSummary = ({ focalSetDefs, snapshot }) => (
  <div className="topic-info-sidebar">
    <h2><FormattedMessage {...localMessages.title} values={{ versionNumber: snapshot.note }} /></h2>
    {focalSetDefs.sort((a, b) => a.name.localeCompare(b.name)).map(fs => (
      <p key={fs.focal_set_definitions_id}><b>{fs.name}</b> {fs.focus_definitions.map(f => f.name).join(', ')}</p>
    ))}
  </div>
);

FocalSetDefinitionSummary.propTypes = {
  // from parent
  focalSetDefs: PropTypes.array.isRequired,
  snapshot: PropTypes.object.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default injectIntl(FocalSetDefinitionSummary);
