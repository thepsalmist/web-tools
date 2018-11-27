import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../hocs/IntlForm';

const localMessages = {
  permissionLabel: { id: 'user.update.permissions.label', defaultMessage: 'Permission' },
  publicNotesHint: { id: 'source.add.publicNotes.hint', defaultMessage: 'Add some public notes about this source' },
  adminLabel: { id: 'source.add.monitor.label', defaultMessage: 'Admin' },
  adminReadOnlyLabel: { id: 'source.add.monitor.label', defaultMessage: 'Admin Read-Only' },
};

/*
admin: Do everything, including editing users
admin-readonly: Read access to admin interface.

media-edit: Add / edit media; includes feeds.
stories-edit: Add / edit stories.
tm: Topic mapper; includes media and story editing
search: Access to the /search pages
tm-readonly: Topic mapper; excludes media and story editing
*/

const UserPermissionsForm = (props) => {
  const { renderCheckbox, initialValues } = props;
  return (
    <div className="user-permissions-form">
      <Row>
        <Col md={2}>
          <Field
            name="admin"
            component={renderCheckbox}
            fullWidth
            label={localMessages.adminLabel}
            disabled={initialValues.disabled}
          />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <Field
            name="admin-readonly"
            component={renderCheckbox}
            fullWidth
            label={localMessages.adminReadOnlyLabel}
            disabled={initialValues.disabled}
          />
        </Col>
      </Row>
    </div>
  );
};

UserPermissionsForm.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  renderCheckbox: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};

const reduxFormConfig = {
  form: 'userForm',
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      UserPermissionsForm
    )
  )
);
