import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { WarningNotice } from '../common/Notice';

const localMessages = {
  qFilterNote: { id: 'topic.influentialMedia.qFilterNote', defaultMessage: 'Please be advised: the media story counts, inlink counts, outline counts, and shares do not reflect your story search filter! These numbers reflect all of the stories from the source within your timeframe and topic/subtopic. If you want to see       these numbers for your story search filter, turn your story search filter into a new subtopic.' },
};

const StorySearchFilterMediaWarning = (props) => {
  let content = '';
  if (props.filters && props.filters.q) {
    content = (
      <div className="story-search-filter-warning">
        <WarningNotice>
          <FormattedMessage {...localMessages.qFilterNote} />
        </WarningNotice>
      </div>
    );
  }
  return content;
};

StorySearchFilterMediaWarning.propTypes = {
  // from store
  filters: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
});

export default
injectIntl(
  connect(mapStateToProps)(
    StorySearchFilterMediaWarning
  )
);
