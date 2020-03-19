import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import TopicVersionReadySummary from './TopicVersionReadySummary';

const localMessages = {
  title: { id: 'topic.info.title', defaultMessage: 'Version {versionNumber}: Summary' },
  newTitle: { id: 'topic.info.newTitle', defaultMessage: 'New Version: Summary' },
};

const SeedQuerySummary = ({ topic, snapshot }) => (
  <div className="topic-info-sidebar">
    <h2>
      {snapshot && <FormattedHTMLMessage {...localMessages.title} values={{ versionNumber: snapshot.note }} />}
      {((snapshot === null) || (snapshot === undefined)) && <FormattedHTMLMessage {...localMessages.newTitle} />}
    </h2>
    <TopicVersionReadySummary
      snapshot={snapshot}
      topic={topic}
      startWithDetailsShowing
    />
  </div>
);

SeedQuerySummary.propTypes = {
  snapshot: PropTypes.object.isRequired,
  topic: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SeedQuerySummary);
