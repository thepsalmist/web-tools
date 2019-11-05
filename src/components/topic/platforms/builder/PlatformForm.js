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
  defaultName: { id: 'platform.default.platformName', defaultMessage: 'Conversations' },
  defaultDescription: { id: 'platform.default.platformDescription', defaultMessage: 'A set of different conversations within this topic.' },
  defaultNameOpenWeb: { id: 'platform.default.platformName.openWeb', defaultMessage: 'OpenWeb Partisanship' },
  defaultDescriptionOpenWeb: { id: 'platform.default.platformDescription.openWeb', defaultMessage: 'Subtopics driven by our analysis of Twitter followers of Trump and Clinton during the 2016 election season.  Each media soure is scored based on the ratio of openWebs of their stories in those two groups.' },
  defaultNameReddit: { id: 'platform.default.platformName.openWeb', defaultMessage: 'Top Countries' },
  defaultDescriptionReddit: { id: 'platform.default.platformDescription.openWeb', defaultMessage: 'Subtopics for the countries stories are most often about.' },
  defaultNameTwitter: { id: 'platform.default.platformName.nyt', defaultMessage: 'Nyt Theme' },
  defaultDescriptionTwitter: { id: 'platform.default.platformDescription.nyt', defaultMessage: 'Subtopics for the themes stories are most often related to.' },
};

class PlatformForm extends React.Component {
  componentWillMount() {
    const { change, platform } = this.props;
    const { formatMessage } = this.props.intl;
    // set smart-looking default set name/description based on the focal technique currently selected
    let platformName;
    let platformDescription;
    switch (platform) {
      case PLATFORM_OPEN_WEB:
        platformName = formatMessage(localMessages.defaultNameOpenWeb);
        platformDescription = formatMessage(localMessages.defaultDescriptionOpenWeb);
        break;
      case PLATFORM_REDDIT:
        platformName = formatMessage(localMessages.defaultNameReddit);
        platformDescription = formatMessage(localMessages.defaultDescriptionReddit);
        break;
      case PLATFORM_TWITTER:
        platformName = formatMessage(localMessages.defaultNameTwitter);
        platformDescription = formatMessage(localMessages.defaultDescriptionTwitter);
        break;
      default:
        platformName = formatMessage(localMessages.defaultName);
        platformDescription = formatMessage(localMessages.defaultDescription);
        break;
    }
    change('platformName', platformName);
    change('platformDescription', platformDescription);
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
          name="platformName"
          component={renderTextField}
          fullWidth={fullWidthFields}
        />
        <br />
        <Field
          name="platformDescription"
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
  if (!notEmptyString(values.platformName)) {
    errors.platformName = localMessages.errorNoName;
  }
  if (!notEmptyString(values.platformDescription)) {
    errors.platformDescription = localMessages.errorNoDescription;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'platform', // make sure this matches the sub-components and other wizard steps
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
