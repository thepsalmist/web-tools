import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../../../common/hocs/IntlForm';
import { uploadPlatformGenericCsvFile } from '../../../../../actions/topicActions';
import { updateFeedback } from '../../../../../actions/appActions';

const localMessages = {
  feedbackGood: { id: 'platform.generic.csv.feedback.worked', defaultMessage: 'This upload was successful' },
  feedbackBad: { id: 'platform.generic.csv.feedback.failed', defaultMessage: 'The upload failed ({message}).' },
};

class EditGenericCsvForm extends React.Component {
  constructor(props) {
    super(props);
    this.csvFileRef = React.createRef();
  }

  handleFileChange = () => {
    const { topicId, uploadFile, change } = this.props;
    const fd = this.csvFileRef.current.files[0];
    uploadFile(topicId, fd, change);
  }

  render() {
    return (
      <Row>
        <Col lg={8} xs={12}>
          <input
            type="file"
            onChange={this.handleFileChange}
            ref={this.csvFileRef}
          />
        </Col>
      </Row>
    );
  }
}

EditGenericCsvForm.propTypes = {
  // from parent
  initialValues: PropTypes.object,
  onEnterKey: PropTypes.func,
  // from state:
  topicId: PropTypes.number.isRequired,
  // from dispatch
  onFormChange: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  // from compositional helper
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
};

const reduxFormConfig = {
  form: 'platform', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  enableReinitialize: true,
};

const mapStateToProps = (state) => ({
  topicId: state.topics.selected.id,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadFile: (topicId, file, change) => {
    dispatch(uploadPlatformGenericCsvFile(topicId, { file }))
      .then((results) => {
        if (results.status === 'Error') {
          return dispatch(updateFeedback({
            classes: 'error-notice',
            open: true,
            message: ownProps.intl.formatMessage(localMessages.feedbackBad, { message: results.message }),
          }));
        }
        if (results.status === 'Success') {
          dispatch(change('query', results.filename));
          return dispatch(updateFeedback({
            classes: 'info-notice',
            open: true,
            message: ownProps.intl.formatMessage(localMessages.feedbackGood),
          }));
        }
        return null;
      });
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withIntlForm(
      reduxForm(reduxFormConfig)(
        EditGenericCsvForm
      )
    )
  )
);
