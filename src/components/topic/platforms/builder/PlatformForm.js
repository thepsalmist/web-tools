import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import withIntlForm from '../../../common/hocs/IntlForm';
import { PLATFORM_OPEN_WEB, PLATFORM_REDDIT, PLATFORM_TWITTER } from '../../../../lib/platformTypes';
import { notEmptyString } from '../../../../lib/formValidators';

const localMessages = {
  platformWhyName: { id: 'platform.name', defaultMessage: 'Set Name' },
  platformWhyDescription: { id: 'platform.description', defaultMessage: 'Set Description' },
  platformWhy: { id: 'platform.why', defaultMessage: 'Give your new Set a name and description so others can recognize what it is for.' },
  errorNoName: { id: 'platform.name.error', defaultMessage: 'You need to name this.' },
  errorNoDescription: { id: 'platform.description.error', defaultMessage: 'You need a description.' },
  defaultSetName: { id: 'platform.default.setName', defaultMessage: 'Conversations' },
  defaultSetDescription: { id: 'platform.default.setDescription', defaultMessage: 'A set of different conversations within this topic.' },
  defaultSetNameOpenWeb: { id: 'platform.default.setName.openWeb', defaultMessage: 'OpenWeb Partisanship' },
  defaultSetDescriptionOpenWeb: { id: 'platform.default.setDescription.openWeb', defaultMessage: 'Subtopics driven by our analysis of Twitter followers of Trump and Clinton during the 2016 election season.  Each media soure is scored based on the ratio of openWebs of their stories in those two groups.' },
  defaultSetNameReddit: { id: 'platform.default.setName.openWeb', defaultMessage: 'Top Countries' },
  defaultSetDescriptionReddit: { id: 'platform.default.setDescription.openWeb', defaultMessage: 'Subtopics for the countries stories are most often about.' },
  defaultSetNameTwitter: { id: 'platform.default.setName.nyt', defaultMessage: 'Nyt Theme' },
  defaultSetDescriptionTwitter: { id: 'platform.default.setDescription.nyt', defaultMessage: 'Subtopics for the themes stories are most often related to.' },
};

class PlatformForm extends React.Component {
  componentWillMount() {
    const { change, platform } = this.props;
    const { formatMessage } = this.props.intl;
    // set smart-looking default set name/description based on the focal technique currently selected
    let setName;
    let setDescription;
    switch (platform) {
      case PLATFORM_OPEN_WEB:
        setName = formatMessage(localMessages.defaultSetNameOpenWeb);
        setDescription = formatMessage(localMessages.defaultSetDescriptionOpenWeb);
        break;
      case PLATFORM_REDDIT:
        setName = formatMessage(localMessages.defaultSetNameReddit);
        setDescription = formatMessage(localMessages.defaultSetDescriptionReddit);
        break;
      case PLATFORM_TWITTER:
        setName = formatMessage(localMessages.defaultSetNameTwitter);
        setDescription = formatMessage(localMessages.defaultSetDescriptionTwitter);
        break;
      default:
        setName = formatMessage(localMessages.defaultSetName);
        setDescription = formatMessage(localMessages.defaultSetDescription);
        break;
    }
    change('platformSetName', setName);
    change('platformSetDescription', setDescription);
  }

  render() {
    const { renderTextField, introContent, fullWidth } = this.props;
    const defaultIntroContent = (<p className="light"><i><FormattedMessage {...localMessages.platformWhy} /></i></p>);
    const fullWidthFields = fullWidth || false;
    const intro = introContent || defaultIntroContent;
    return (
      <div className="new-focal-set">
        {intro}
        <Field
          name="platformSetName"
          component={renderTextField}
          fullWidth={fullWidthFields}
        />
        <br />
        <Field
          name="platformSetDescription"
          component={renderTextField}
          fullWidth={fullWidthFields}
        />
      </div>
    );
  }
}

PlatformForm.propTypes = {
  // form compositinal chain
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  // from parent
  initialValues: PropTypes.object,
  introContent: PropTypes.object,
  fullWidth: PropTypes.bool,
  platform: PropTypes.string.isRequired,
};

function validate(values) {
  const errors = {};
  if (!notEmptyString(values.platformSetName)) {
    errors.platformSetName = localMessages.errorNoName;
  }
  if (!notEmptyString(values.platformSetDescription)) {
    errors.platformSetDescription = localMessages.errorNoDescription;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'snapshotFocus', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false, // so the wizard works
  validate,
};

export default
withIntlForm(
  reduxForm(reduxFormConfig)(
    injectIntl(
      PlatformForm
    )
  )
);
