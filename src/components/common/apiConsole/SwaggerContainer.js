import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SwaggerUi, { presets } from 'swagger-ui';

class SwaggerContainer extends Component {
  componentDidMount() {
    const { specUrl, user } = this.props;
    const swaggerUi = SwaggerUi({
      dom_id: '#swagger-wrapper',
      url: specUrl,
      presets: [presets.apis],
      enableCORS: false,
      onComplete: () => {
        if (user.isLoggedIn) {
          swaggerUi.preauthorizeApiKey('key', user.key);
        }
      },
    });
  }

  render() {
    return (
      <div id="swagger-wrapper" />
    );
  }
}

SwaggerContainer.propTypes = {
  // from parent
  specUrl: PropTypes.string,
  // from store
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default
connect(mapStateToProps)(
  SwaggerContainer
);
