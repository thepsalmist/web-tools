import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import MenuItem from '@material-ui/core/MenuItem';
import { FETCH_SUCCEEDED } from '../../lib/fetchConstants';
import withAsyncFetch from './hocs/AsyncContainer';
import { fetchMetadataValuesForCountry, fetchMetadataValuesForState, fetchMetadataValuesForPrimaryLanguage, fetchMetadataValuesForCountryOfFocus, fetchMetadataValuesForMediaType } from '../../actions/systemActions';
import withIntlForm from './hocs/IntlForm';
import { TAG_SET_PUBLICATION_COUNTRY, TAG_SET_PUBLICATION_STATE, TAG_SET_PRIMARY_LANGUAGE, TAG_SET_COUNTRY_OF_FOCUS, TAG_SET_MEDIA_TYPE } from '../../lib/tagUtil';

const MODE_SELECT = 'MODE_SELECT';
const MODE_AUTOCOMPLETE = 'MODE_AUTOCOMPLETE';

const localMessages = {
  hintText: { id: 'metadata.pick.hint', defaultMessage: 'Pick a {label}' },
};

const MetadataPickerContainer = (props) => {
  const { initialValues, label, name, tags, isClearable, renderSelect, autocompleteHideOptions,
    renderAutocomplete, autocomplete, disabled, showDescription } = props;
  const { formatMessage } = props.intl;
  const mode = autocomplete ? MODE_AUTOCOMPLETE : MODE_SELECT;
  let content = null;
  switch (mode) {
    case MODE_SELECT:
      if (showDescription) {
        content = (
          <Field
            fullWidth
            name={name}
            component={renderSelect}
            disabled={disabled}
            label={label}
          >
            <MenuItem className="header-primary-menu" value={null} />
            {tags.map(t => (
              <MenuItem
                className="header-primary-menu"
                key={t.tags_id}
                value={t.tags_id}
              >
                <div className="header-primary-label">{t.label}
                  <br /><span className="header-primary-description">{t.description}</span>
                </div>
              </MenuItem>
            ))}
          </Field>
        );
      } else {
        content = (
          <Field
            fullWidth
            name={name}
            component={renderSelect}
            disabled={disabled}
            label={label}
          >
            <MenuItem value={null} />
            {tags.map(t => <MenuItem key={t.tags_id} value={t.tags_id}>{t.label}</MenuItem>)}
          </Field>
        );
      }
      break;
    case MODE_AUTOCOMPLETE:
      let styles = {};
      if (autocompleteHideOptions) {
        styles = {
          dropdownIndicator: () => ({ display: 'none' }),
        };
      }
      content = (
        <React.Fragment>
          <label>{label}</label>
          <Field
            styles={styles}
            name={name}
            component={renderAutocomplete}
            fullWidth
            isDisabled={disabled}
            defaultValue={initialValues}
            isClearable={isClearable}
            placeholder={formatMessage(localMessages.hintText, { label })}
            options={tags.map(t => ({ ...t, value: t.tags_id, label: t.label }))}
          />
        </React.Fragment>
      );
      break;
    default:
      content = '';
      break;
  }
  return (<div className={`metadata-picker metadata-picker-${name}`}>{content}</div>);
};

MetadataPickerContainer.propTypes = {
  // from parent
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  initialValues: PropTypes.object,
  disabled: PropTypes.bool,
  autocomplete: PropTypes.bool,
  autocompleteHideOptions: PropTypes.bool,
  isClearable: PropTypes.bool,
  showDescription: PropTypes.bool,
  // from compositional chain
  intl: PropTypes.object.isRequired,
  renderSelect: PropTypes.func.isRequired,
  renderAutocomplete: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string,
  tags: PropTypes.array,
  label: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.system.metadata[ownProps.name].fetchStatus,
  label: state.system.metadata[ownProps.name].label,
  tags: state.system.metadata[ownProps.name].tags,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchTagsInCollection: (tagId) => {
    switch (ownProps.id) {
      case TAG_SET_PUBLICATION_COUNTRY:
        dispatch(fetchMetadataValuesForCountry(tagId));
        break;
      case TAG_SET_PUBLICATION_STATE:
        dispatch(fetchMetadataValuesForState(tagId));
        break;
      case TAG_SET_PRIMARY_LANGUAGE:
        dispatch(fetchMetadataValuesForPrimaryLanguage(tagId));
        break;
      case TAG_SET_COUNTRY_OF_FOCUS:
        dispatch(fetchMetadataValuesForCountryOfFocus(tagId));
        break;
      case TAG_SET_MEDIA_TYPE:
        dispatch(fetchMetadataValuesForMediaType(tagId));
        break;
      default:
        break;
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      // these sets don't change, so only refetch them if you don't have them already in the store
      const alreadyLoadedTags = ((stateProps.fetchStatus === FETCH_SUCCEEDED) && (stateProps.tags.length > 0));
      if (!alreadyLoadedTags) {
        dispatchProps.fetchTagsInCollection(ownProps.id);
      }
    },
  });
}

export default
connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  withIntlForm(
    withAsyncFetch(
      MetadataPickerContainer
    )
  )
);
