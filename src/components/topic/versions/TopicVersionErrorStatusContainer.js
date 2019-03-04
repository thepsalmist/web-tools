import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../common/AppButton';
import PageTitle from '../../common/PageTitle';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE, PERMISSION_ADMIN } from '../../../lib/auth';
import { VERSION_ERROR_EXCEEDED } from '../../../lib/topicFilterUtil';
import TopicInfo from '../controlbar/TopicInfo';
import messages from '../../../resources/messages';

const localMessages = {
  title: { id: 'topics.adminList.title', defaultMessage: 'Version status' },
  hasAnError: { id: 'topic.hasError', defaultMessage: 'Sorry, this topic has an error!' },
  topicTooBig: { id: 'topic.state.error.topicTooBig', defaultMessage: 'Error, your topic is too big' },
  topicTooBigDesc: { id: 'topic.state.error.topicTooBigDesc', defaultMessage: 'We limit the size of topics to make sure that our system doesn\'t get overrun with gathering content from the entire web.' },
  topicTooBigInstructions: { id: 'topic.state.error.topicTooBigInstructions', defaultMessage: 'Try making a new topic with a more specific query or a smaller date range. Email us at support@mediacloud.org if you have questions' },
  trySpidering: { id: 'topic.state.trySpidering', defaultMessage: 'Manually run this topic' },
  otherError: { id: 'topic.state.error.otherError', defaultMessage: 'Sorry, this topic has an error.  It says it is "{state}".' },
  otherErrorInstructions: { id: 'topic.state.error.otherErrorInstructions', defaultMessage: 'Email us at support@mediacloud.org if you have questions' },
};

class TopicVersionErrorStatusContainer extends React.Component {
  render() {
    const { topicInfo, error, goToCreateNewVersion } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    if (error === VERSION_ERROR_EXCEEDED) {
      content = (
        <Grid>
          <Row>
            <Col lg={12}>
              <div className="topic-stuck-created-or-error">
                <PageTitle value={localMessages.title} />
                <h1><FormattedMessage {...localMessages.topicTooBig} /></h1>
                <p><FormattedMessage {...localMessages.topicTooBigDesc} /></p>
              </div>
            </Col>
          </Row>
          <Permissioned onlyTopic={PERMISSION_ADMIN}>
            <Row>
              <Col lg={4}>
                <AppButton
                  label={formatMessage(messages.createNewVersion)}
                  onClick={() => goToCreateNewVersion(topicInfo)}
                  type="submit"
                  primary
                />
              </Col>
              <Col lg={4}>
                <TopicInfo topic={topicInfo} />
              </Col>
            </Row>
          </Permissioned>
          <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
            <Row>
              <Col lg={12}>
                <div className="topic-stuck-created-or-error">
                  <p><FormattedMessage {...localMessages.topicTooBigInstructions} /></p>
                </div>
              </Col>
            </Row>
          </Permissioned>
        </Grid>
      );
    } else {
      content = (
        <Grid>
          <Permissioned onlyTopic={PERMISSION_ADMIN}>
            <Row>
              <Col lg={6}>
                <div className="topic-stuck-created-or-error">
                  <h1><FormattedMessage {...localMessages.hasAnError} /></h1>
                  <AppButton
                    label={formatMessage(messages.createNewVersion)}
                    onClick={() => goToCreateNewVersion(topicInfo.topics_id)}
                    type="submit"
                    color="primary"
                  />
                </div>
              </Col>
              <Col lg={4}>
                <TopicInfo topic={topicInfo} />
              </Col>
            </Row>
          </Permissioned>
          <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
            <Row>
              <Col lg={12}>
                <div className="topic-stuck-created-or-error">
                  <p><FormattedMessage {...localMessages.otherErrorInstructions} /></p>
                </div>
              </Col>
            </Row>
          </Permissioned>
        </Grid>
      );
    }
    return (content);
  }
}

TopicVersionErrorStatusContainer.propTypes = {
  // from state
  topicInfo: PropTypes.object,
  filters: PropTypes.object,
  error: PropTypes.string,
  goToCreateNewVersion: PropTypes.func,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  TopicVersionErrorStatusContainer
);
