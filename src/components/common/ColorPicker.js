import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { GithubPicker } from 'react-color';

const localMessages = {
  choose: { id: 'explorer.colorpicker', defaultMessage: 'Choose A Color' },
};

class ColorPicker extends React.Component {

  state = {
    color: null,
    displayColorPicker: false,
  };

  handleClick = () => {
    // const { color, onClick } = props;
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
    // onClick({ color });
  };

  handleClose = (color) => {
    const { onChange } = this.props;
    this.setState({ displayColorPicker: false });
    onChange({ name: 'color', value: color.hex });
  };

  render() {
    const { color, showLabel } = this.props;


    let colorPicker = null;
    if (this.state.displayColorPicker) {
      colorPicker = <GithubPicker triangle="hide" color={color} onChange={this.handleClose} colors={['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB']} />;
    } else {
      colorPicker = (
        <div>
          { showLabel ? <a tabIndex="0" role="button" onClick={this.handleClick}><FormattedMessage {...localMessages.choose} /></a> : '' }
          <button
            onClick={this.handleClick}
            style={{ cursor: 'pointer', width: 10, height: 10, borderRadius: 10, backgroundColor: `${color}`, display: 'inline-block' }}
          />
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
