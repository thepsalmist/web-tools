import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import MetadataPickerContainer from './MetadataPickerContainer';
import MetadataCheckboxFieldArray from './MetadataCheckboxFieldArray';
import messages from '../../resources/messages';

const MediaPickerMetadataContainer = props => (
  <div className="explorer-media-picker-metadata-types">
    <MetadataPickerContainer
      id={props.id}
      name={props.type}
      form="advanced-media-picker-search"
      label={props.intl.formatMessage(messages.countryOfFocus)}
      onChange={args => props.onChange(props.id, args, props.type)}
      onSearch={props.onSearch}
      async
    />
    <h5>{props.intl.formatMessage(messages.frequentlyUsed)}</h5>
    <MetadataCheckboxFieldArray
      id={props.id}
      type={props.type}
      form="advanced-media-picker-search"
      label={props.intl.formatMessage(messages.language)}
      onChange={args => props.onChange(props.id, args, props.type)}
      onSearch={props.onSearch}
      previouslySelected={props.previouslySelectedTags}
    />
  </div>
);

MediaPickerMetadataContainer.propTypes = {
  // from parent
  intl: PropTypes.object.isRequired,
  id: PropTypes.number,
  type: PropTypes.string,
  initialValues: PropTypes.object,
  previouslySelectedTags: PropTypes.object,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
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
