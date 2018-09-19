import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import TopicSummaryContainer from './TopicSummaryContainer';
import AppButton from '../../common/AppButton';

const localMessages = {
  login: { id: 'topic.login', defaultMessage: 'Log in or Register Now!' },
};

const PublicTopicSummaryContainer = (props) => {
  const { handleButtonClick } = props;
  const { formatMessage } = props.intl;
  const loginContent = (
    <Grid>
      <Row>
        <Col lg={12}>
          <AppButton
            primary
            label={formatMessage(localMessages.login)}
            onClick={() => { handleButtonClick('/home'); }}
          />
        </Col>
      </Row>
    </Grid>
  );
  return (
    <div className="public-topic-summary">
      {loginContent}
      <TopicSummaryContainer />
      {loginContent}
    </div>
  );
};

PublicTopicSummaryContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from state
  user: PropTypes.object.isRequired,
  handleButtonClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  handleButtonClick: (path) => {
    dispatch(push(path));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    PublicTopicSummaryContainer
  )
);
