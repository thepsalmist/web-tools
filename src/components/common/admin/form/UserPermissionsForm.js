import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../hocs/IntlForm';

const localMessages = {
  permissionLabel: { id: 'user.update.permissions.label', defaultMessage: 'Permissions' },
  adminLabel: { id: 'user.update.admin.label', defaultMessage: 'Admin' },
  adminReadOnlyLabel: { id: 'user.update.adminro.label', defaultMessage: 'Admin Read-Only' },
  tmLabel: { id: 'user.update.tm.label', defaultMessage: 'Topic Mapper Admin' },
  tmReadOnlyLabel: { id: 'user.update.tmro.label', defaultMessage: 'Topic Mapper Read-Only' },
  mediaEditLabel: { id: 'user.update.media.label', defaultMessage: 'Media-edit' },
  storiesEditLabel: { id: 'user.update.stories.label', defaultMessage: 'Stories-edit' },
  searchLabel: { id: 'user.update.search.label', defaultMessage: 'Search' },
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
/*
const renderPermissionelector = ({ fields, meta, onDelete }) => (
  <div>
    {fields.map((name, index) => (
      <Col md={2}>
        <Field
          key={name}
          name={name}
          component={renderCheckbox}
          fullWidth
          label={localMessages.tmLabel}
          disabled={initialValues.disabled}
        />
        </Col>
    ))}
    { meta.error !== null && meta.error !== undefined ? <div className="error">{meta.error}</div> : '' }

  </div>
);

renderPermissionselector.propTypes = {
  fields: PropTypes.object,
  meta: PropTypes.object,
  validate: PropTypes.func,
  onDelete: PropTypes.func,
};
*/

const UserPermissionsForm = (props) => {
  const { renderCheckbox, initialValues } = props;
  return (
    <div className="user-permissions-form">
      <Row>
        <Col lg={12}>
          <h2><FormattedMessage {...localMessages.permissionLabel} /></h2>
        </Col>
      </Row>
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
        <Col md={2}>
          <Field
            name="tm"
            component={renderCheckbox}
            fullWidth
            label={localMessages.tmLabel}
            disabled={initialValues.disabled}
          />
        </Col>
        <Col md={2}>
          <Field
            name="media-edit"
            component={renderCheckbox}
            fullWidth
            label={localMessages.mediaEditLabel}
            disabled={initialValues.disabled}
          />
        </Col>
        <Col md={2}>
          <Field
            name="roles.search"
            component={renderCheckbox}
            fullWidth
            label={localMessages.searchLabel}
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
        <Col md={2}>
          <Field
            name="tm-readonly"
            component={renderCheckbox}
            fullWidth
            label={localMessages.tmReadOnlyLabel}
            disabled={initialValues.disabled}
          />
        </Col>
        <Col md={2}>
          <Field
            name="stories-edit"
            component={renderCheckbox}
            fullWidth
            label={localMessages.storiesEditLabel}
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
