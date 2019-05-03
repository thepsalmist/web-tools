import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import withAsyncData from '../../../../../common/hocs/AsyncDataContainer';
import { fetchMediaTypes } from '../../../../../../actions/topicActions';

const localMessages = {
  intro: { id: 'focus.create.confirm.retweet.intro', defaultMessage: 'We will create {count} subtopics:' },
};

const MediaTypeSummary = (props) => {
  const { types } = props;
  return (
    <div className="focus-create-cofirm-media-type">
      <p><FormattedMessage {...localMessages.intro} values={{ count: types.length }} /></p>
      <ul>
        {types.map((t, idx) => (
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
  types: PropTypes.array,
  // form context
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.mediaTypes.fetchStatus,
  types: state.topics.selected.focalSets.create.mediaTypes.list,
});

const fetchAsyncData = dispatch => dispatch(fetchMediaTypes());

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      MediaTypeSummary
    )
  )
);
