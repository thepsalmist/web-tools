import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import QueryPicker from './QueryPicker';

const QueryBuilderContainer = (props) => {
  const { isEditable, onSearch } = props;
  return (
    <div className="query-builder">
      <QueryPicker isEditable={isEditable} onSearch={onSearch} />
    </div>
  );
};

QueryBuilderContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  onSearch: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
  queries: PropTypes.array,
};


export default
injectIntl(
  connect()(
    QueryBuilderContainer
  )
);
