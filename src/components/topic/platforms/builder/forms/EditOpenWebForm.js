import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../../../common/hocs/IntlForm';
import messages from '../../../../../resources/messages';
import MediaPickerDialog from '../../../../common/mediaPicker/MediaPickerDialog';
import OpenWebMediaFieldArray from '../../../../common/form/OpenWebMediaFieldArray';

const EditOpenWebForm = ({ initialValues, renderTextField, intl, onEnterKey, onFormChange }) => (
  <>
    <Row>
      <Col lg={6}>
        <label htmlFor="query"><FormattedMessage {...messages.query} /></label>
        <Field
          name="query"
          component={renderTextField}
          fullWidth
          multiline
          rows="3"
          variant="outlined"
          onKeyDown={onEnterKey}
        />
      </Col>
      <Col lg={6}>
        <div className="media-field-wrapper">
          <label htmlFor="media"><FormattedMessage {...messages.topicSourceCollectionsProp} /></label>
          <OpenWebMediaFieldArray
            formatMessage={intl.formatMessage}
            className="query-field"
            form="platform"
            enableReinitialize
            keepDirtyOnReinitialize
            destroyOnUnmount={false}
            fieldName="media"
            initialValues={{
              ...initialValues,
              media: initialValues.media_tags,
            }} // to and from MediaPicker
            allowRemoval
          />
          <MediaPickerDialog
            initMedia={initialValues.media_tags} // {selected.media ? selected.media : cleanedInitialValues.media}
            onConfirmSelection={selections => onFormChange('media', selections)}
          />
        </div>
      </Col>
    </Row>
  </>
);

EditOpenWebForm.propTypes = {
  // from parent
  initialValues: PropTypes.object,
  onEnterKey: PropTypes.func,
  // from state
  change: PropTypes.func.isRequired,
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
      EditOpenWebForm
    )
  )
);
