import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  title: { id: 'topic.focalSets.summary.title', defaultMessage: 'Version {versionNumber}: Subtopic Summary' },
  none: { id: 'topic.focalSets.summary.none', defaultMessage: 'This version doesn\'t have any subtopics.' },
};

const FocalSetSummary = ({ focalSets, snapshot, faded }) => (
  <div className={`topic-info-sidebar ${faded ? 'faded' : ''}`}>
    <h2><FormattedMessage {...localMessages.title} values={{ versionNumber: snapshot.note }} /></h2>
    {(focalSets.length === 0) && <FormattedMessage {...localMessages.none} />}
    {focalSets.sort((a, b) => a.name.localeCompare(b.name)).map(fs => (
      <p key={fs.focal_sets_id}><b>{fs.name}</b> {fs.foci.map(f => f.name).join(', ')}</p>
    ))}
  </div>
);

FocalSetSummary.propTypes = {
  // from parent
  focalSets: PropTypes.array.isRequired,
  snapshot: PropTypes.object.isRequired,
  faded: PropTypes.bool,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default injectIntl(FocalSetSummary);
