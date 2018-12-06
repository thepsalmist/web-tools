import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../hocs/IntlForm';
import AppButton from '../../AppButton';
import messages from '../../../../resources/messages';

const localMessages = {
  mainTitle: { id: 'explorer.search.title', defaultMessage: 'User name or email' },
  addButton: { id: 'explorer.search', defaultMessage: 'Search' },
  searchHint: { id: 'explorer.intro.searchHint', defaultMessage: 'Filter users by name or email' },
};

const UserSearchForm = (props) => {
  const { handleSubmit, onSearch, renderTextField } = props;
  // need to init initialValues a bit on the way in to make lower-level logic work right
  return (
    <form className="app-form search-form" name="userSearchForm" onSubmit={handleSubmit(onSearch.bind(this))}>
      <Row>
        <Col lg={9}>
          <Field
            name="searchStr"
            className="tool-user-search"
            component={renderTextField}
            label={localMessages.searchHint}
          />
        </Col>
        <Col lg={1}>
          <AppButton className="tool-user-search-button" type="submit" label={messages.search} primary />
        </Col>
      </Row>
    </form>
  );
};

UserSearchForm.propTypes = {
  // from parent
  onSearch: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  // from form healper
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};


const reduxFormConfig = {
  form: 'userSearchForm',
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      UserSearchForm
    ),
  ),
);
