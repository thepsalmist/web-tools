import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import LoginForm from './LoginForm';
import PageTitle from '../common/PageTitle';
import { WarningNotice } from '../common/Notice';

const localMessages = {
  loginTitle: { id: 'login.title', defaultMessage: 'Login' },
  security: { id: 'login.securitynotice', defaultMessage: 'We recently noticed a security problem and reset all passwords. We emailed everyone a link to reset your password. <br />If you can\'t find that email, <a href={link}> reset your password here.</a>' },
};

class LoginContainer extends React.Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn) {
      this.context.router.push('/home');
    }
  }

  render() {
    const { isLoggedIn } = this.props.intl;
    const className = `logged-in-${isLoggedIn}`;
    return (
      <>
        <div style={{ textAlign: 'center' }}>
          <WarningNotice>
            <br />
            <FormattedHTMLMessage {...localMessages.security} values={{ link: '#/user/request-password-reset' }} /><br />
          </WarningNotice>
        </div>
        <Grid>
          <PageTitle value={localMessages.loginTitle} />
          <Row>
            <Col lg={12} className={className}>
              <h2><FormattedMessage {...localMessages.loginTitle} /></h2>
            </Col>
          </Row>
          <Row>
            <Col lg={4} className={className}>
              <LoginForm location={this.props.location} />
            </Col>
          </Row>
        </Grid>
      </>
    );
  }
}

LoginContainer.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
  location: PropTypes.object,
};

LoginContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
});

export default
injectIntl(
  connect(mapStateToProps)(
    LoginContainer
  )
);
