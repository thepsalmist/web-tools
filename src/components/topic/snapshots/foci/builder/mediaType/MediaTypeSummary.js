import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  intro: { id: 'focus.create.confirm.retweet.intro', defaultMessage: 'We will create {count} subtopics:' },
};

const MediaTypeSummary = (props) => {
  const { counts } = props;
  return (
    <div className="focus-create-cofirm-media-type">
      <p><FormattedMessage {...localMessages.intro} values={{ count: counts.length }} /></p>
      <ul>
        {counts.map((t, idx) => (
          <li key={idx}>{t.label}</li>
        ))}
      </ul>
    </div>
  );
};

MediaTypeSummary.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  formValues: PropTypes.object.isRequired,
  counts: PropTypes.array,
  // form context
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.mediaTypeStoryCounts.fetchStatus,
  counts: state.topics.selected.focalSets.create.mediaTypeStoryCounts.story_counts,
});

export default
injectIntl(
  connect(mapStateToProps)(
    MediaTypeSummary
  )
);
