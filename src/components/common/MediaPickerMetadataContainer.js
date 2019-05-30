import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import DataCard from './DataCard';
import MetadataPickerContainer from './MetadataPickerContainer';
import MetadataCheckboxFieldArray from './MetadataCheckboxFieldArray';

const MediaPickerMetadataContainer = props => (
  <DataCard className={`media-picker-filter-options ${props.className}`}>
    <MetadataPickerContainer
      id={props.id}
      name={props.type}
      form="advanced-media-picker-search"
      hideLabel
      onChange={args => props.onChange(props.id, args, props.type)}
      onSearch={props.onSearch}
      async
    />
    <MetadataCheckboxFieldArray
      id={props.id}
      type={props.type}
      form="advanced-media-picker-search"
      label={props.label}
      onChange={args => props.onChange(props.id, args, props.type)}
      onSearch={props.onSearch}
      previouslySelected={props.previouslySelectedTags}
    />
  </DataCard>
);

MediaPickerMetadataContainer.propTypes = {
  // from parent
  intl: PropTypes.object.isRequired,
  id: PropTypes.number,
  label: PropTypes.string,
  type: PropTypes.string,
  initialValues: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  previouslySelectedTags: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  className: PropTypes.string,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.metadata.mediaType.fetchStatus,
});

export default
injectIntl(
  connect(mapStateToProps)(
    MediaPickerMetadataContainer
  ),
);
