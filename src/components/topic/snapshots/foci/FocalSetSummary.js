import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  title: { id: 'topic.info.title', defaultMessage: 'Version {versionNumber}: Subtopics' },
};

const FocalSetSummary = ({ focalSets, snapshot }) => (
  <div className="topic-info-sidebar">
    <h2><FormattedMessage {...localMessages.title} values={{ versionNumber: snapshot.note }} /></h2>
    {focalSets.sort((a, b) => a.name.localeCompare(b.name)).map(fs => (
      <p key={fs.focal_sets_id}><b>{fs.name}</b>: {fs.foci.map(f => f.name).join(', ')}</p>
    ))}
  </div>
);

FocalSetSummary.propTypes = {
  // from parent
  focalSets: PropTypes.array.isRequired,
  snapshot: PropTypes.object.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default injectIntl(FocalSetSummary);
