import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageTitle from '../common/PageTitle';

const TopicPageTitle = (props) => {
  let newValue;
  if (props.value instanceof Array) {
    newValue = [...props.value, props.topicName];
  } else {
    newValue = [props.value, props.topicName];
  }
  return (<PageTitle value={newValue} />);
};

TopicPageTitle.propTypes = {
  // from parent
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  // from state
  topicName: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  topicName: state.topics.selected.info.name,
});

export default
connect(mapStateToProps)(
  TopicPageTitle
);
