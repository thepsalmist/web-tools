import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import AutoComplete from 'material-ui/AutoComplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ReactSelect from 'react-select';

/**
 * Helpful compositional wrapper for forms that want to use Material-UI, react-intl and redux-form.
 * This exposes render methods that you can use with redux-form's <Field> tag.  Pass in message objects
 * instead of strings for anything you want localized (error messages, hint text, etc.).
 */
function withIntlForm(Component) {
  class IntlFormForm extends React.Component {
    intlIfObject = (value) => {
      if (typeof value === 'object') {
        return <FormattedMessage {...value} />;
      }
      return value;
    };

    intlCustomProps = (customProps) => {
      const intlCustom = Object.assign({}, customProps);
      ['label', 'helpertext', 'error', 'disabled'].forEach((prop) => {
        if ((prop in customProps)) {
          intlCustom[prop] = this.intlIfObject(customProps[prop]);
        }
      });
      return intlCustom;
    };

    renderTextField = ({ input, meta: { touched, error, asyncValidating }, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);
      if (intlCustom && intlCustom.helpertext !== undefined) {
        intlCustom.helperText = intlCustom.helpertext;
      }
      return (
        <TextField
          className={`form-field-text ${asyncValidating ? 'async-validating' : ''}`}
          {...input}
          {...intlCustom}
          error={Boolean(touched && error)}
          helperText={touched ? this.intlIfObject(error) : ''}
          margin="normal"
        />
      );
    };

    renderTextFieldWithFocus = ({ input, saveRef, meta: { touched, error, warning }, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);
      if (intlCustom.helpertext !== undefined) {
        intlCustom.helperText = intlCustom.helpertext;
      }
      return (
        <React.Fragment>
          <TextField
            className="form-field-text"
            error={error !== undefined}
            ref={saveRef}
            {...input}
            {...intlCustom}
            helperText={touched ? this.intlIfObject(error) : ''}
          />
          {warning && (<div className="textfield-warning">{warning}</div>)}
        </React.Fragment>
      );
    };

    renderCheckbox = ({ input, label, disabled }) => (
      <FormControlLabel
        control={(
          <Checkbox
            name={input.name}
            className="form-field-checkbox"
            label={this.intlIfObject(label)}
            checked={input.value === true || input.value === 1}
            onChange={input.onChange}
            disabled={this.intlIfObject(disabled)}
          />
        )}
        label={this.intlIfObject(label)}
      />
    );

    renderSelect = ({ input, meta: { touched, error }, children, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);
      if (intlCustom && intlCustom.helpertext !== undefined) {
        intlCustom.helperText = intlCustom.helpertext;
      }
      return (
        <Select
          className="form-field-select"
          error={touched && (error ? this.intlIfObject(error) : null)}
          {...input}
          onChange={event => input.onChange(event.target.value)}
          {...intlCustom}
        >
          {children}
        </Select>
      );
    }

    renderSimpleAutoComplete = ({ input, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);
      return (
        <ReactSelect
          className="form-field-autocomplete"
          {...custom}
          onChange={value => input.onChange(value)}
          {...intlCustom}
        />
      );
    }

    renderAutoComplete = ({ input, meta: { touched, error }, onNewRequest: onNewRequestFunc, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);
      return (
        <AutoComplete
          className="form-field-autocomplete"
          {...input}
          errorText={touched && (error ? this.intlIfObject(error) : null)}
          onNewRequest={(currentValue, index) => {
            if (onNewRequestFunc && typeof onNewRequestFunc === 'function') {
              onNewRequestFunc(currentValue, index);
            }
            return input.onChange(intlCustom.dataSourceConfig ? currentValue[intlCustom.dataSourceConfig.value] : currentValue);
          }}
          {...intlCustom}
          filter={AutoComplete.fuzzyFilter}
          value={input.value}
        />
      );
    }

    render() {
      const helpers = {
        renderTextField: this.renderTextField,
        renderCheckbox: this.renderCheckbox,
        renderSelect: this.renderSelect,
        renderAutoComplete: this.renderAutoComplete,
        renderTextFieldWithFocus: this.renderTextFieldWithFocus,
        renderNewAutoComplete: this.renderNewAutoComplete,
        renderSimpleAutoComplete: this.renderSimpleAutoComplete,
      };
      return (
        <Component {...this.props} {...helpers} />
      );
    }
  }

  IntlFormForm.propTypes = {
    intl: PropTypes.object.isRequired,
  };

  return injectIntl(IntlFormForm);
}

export default withIntlForm;
