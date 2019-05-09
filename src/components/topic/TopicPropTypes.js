import PropTypes from 'prop-types';

const filters = PropTypes.shape({
  snapshotId: PropTypes.number,
  focusId: PropTypes.number,
  timespanId: PropTypes.number,
  q: PropTypes.string,
});

const TopicPropTypes = {
  filters,
};

export default TopicPropTypes;
