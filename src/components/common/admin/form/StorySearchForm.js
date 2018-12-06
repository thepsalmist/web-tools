import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../hocs/IntlForm';
import AppButton from '../../AppButton';
import messages from '../../../../resources/messages';

const localMessages = {
  mainTitle: { id: 'explorer.search.title', defaultMessage: 'Story id' },
  addButton: { id: 'explorer.search', defaultMessage: 'Search' },
  searchHint: { id: 'explorer.intro.searchHint', defaultMessage: 'Filter story by id' },
};

const StorySearchForm = (props) => {
  const { handleSubmit, onSearch, renderTextField } = props;
  // need to init initialValues a bit on the way in to make lower-level logic work right
  return (
    <form className="app-form search-form" name="storySearchForm" onSubmit={handleSubmit(onSearch.bind(this))}>
      <Row>
        <Col lg={9}>
          <Field
            name="id"
            className="tool-user-search"
            component={renderTextField}
            label={localMessages.searchHint}
          />
        </Col>
        <Col lg={1}>
          <AppButton className="tool-story-search-button" type="submit" label={messages.search} primary />
        </Col>
      </Row>
    </form>
  );
};

StorySearchForm.propTypes = {
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
  form: 'storySearchForm',
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      StorySearchForm
    ),
  ),
);
