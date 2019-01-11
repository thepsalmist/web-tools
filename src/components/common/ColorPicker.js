import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { GithubPicker } from 'react-color';
import ListItemText from '@material-ui/core/ListItemText';

export const QUERY_COLORS = ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB'];

const localMessages = {
  choose: { id: 'explorer.colorpicker', defaultMessage: 'Choose A Color' },
};

class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
  };

  handleClick = () => {
    this.setState(prevState => ({ displayColorPicker: !prevState.displayColorPicker }));
  };

  handleClose = (color) => {
    const { onChange } = this.props;
    this.setState({ displayColorPicker: false });
    onChange({ name: 'color', value: color.hex });
  };

  render() {
    const { color, showLabel } = this.props;


    let colorPicker = null;
    if (!showLabel) {
      if (this.state.displayColorPicker === false) {
        colorPicker = (
          <button
            type="button"
            onClick={this.handleClick}
            style={{ cursor: 'pointer', width: 10, height: 10, borderRadius: 10, backgroundColor: `${color}`, display: 'inline-block' }}
          />
        );
      } else {
        colorPicker = (
          <div>
            <button
              type="button"
              onClick={this.handleClick}
              style={{ cursor: 'pointer', width: 10, height: 10, borderRadius: 10, backgroundColor: `${color}`, display: 'inline-block' }}
            />
            <GithubPicker triangle="hide" color={color} onChange={this.handleClose} colors={['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB']} />
          </div>
        );
      }
    } else {
      colorPicker = (
        <div>
          <ListItemText><FormattedMessage {...localMessages.choose} /></ListItemText>
          <GithubPicker triangle="hide" color={color} onChange={this.handleClose} colors={QUERY_COLORS} />
        </div>
      );
    }
    return (
      <div className="color-picker">
        {colorPicker}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  onClick: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string,
  showLabel: PropTypes.bool,
};

export default injectIntl(ColorPicker);
