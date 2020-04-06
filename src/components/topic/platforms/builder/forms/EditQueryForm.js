import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../../../common/hocs/IntlForm';
import { PLATFORM_OPEN_WEB, GOOGLE_SOURCE } from '../../../../../lib/platformTypes';

const localMessages = {
  webGoogleHelp: { id: 'web.google.help', defaultMessage: 'This supports any standard Google search operator. <a target="_blank" href="https://support.google.com/websearch/answer/2466433?hl=en">Learn more from Google</a>.' },
};

const syntaxHelpMsgForPlatform = (platform, source) => {
  if ((platform === PLATFORM_OPEN_WEB) && (source === GOOGLE_SOURCE)) {
    return <FormattedHTMLMessage {...localMessages.webGoogleHelp} />;
  }
  return null;
};

const EditQueryForm = ({ renderTextField, onEnterKey, initialValues }) => (
  <>
    <Row>
      <Col lg={8} xs={12}>
        <Field
          name="query"
          component={renderTextField}
          fullWidth
          onKeyDown={onEnterKey}
        />
        {syntaxHelpMsgForPlatform(initialValues.selectedPlatform.platform, initialValues.selectedPlatform.source)}
      </Col>
    </Row>
  </>
);

EditQueryForm.propTypes = {
  // from parent
  onEnterKey: PropTypes.func,
  initialValues: PropTypes.object,
  // from dispatch
  onFormChange: PropTypes.func.isRequired,
  // from compositional helper
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
};

const reduxFormConfig = {
  form: 'platform', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  enableReinitialize: true,
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      EditQueryForm
    )
  )
);
