import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm, Field, propTypes, formValueSelector } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../common/hocs/IntlForm';
import TopicSeedDetailsForm from './TopicSeedDetailsForm';
import TopicModeOption from './TopicModeOption';

const localMessages = {
  name: { id: 'topic.form.detail.name', defaultMessage: 'Topic Name (what is this about?)' },
  description: { id: 'topic.form.detail.description', defaultMessage: 'Description (why are you making this?)' },
  modeTitle: { id: 'topic.form.mode.title', defaultMessage: 'Research Mode' },
  modeDescription: { id: 'topic.form.mode.description', defaultMessage: 'Our system supports different types of research modes for each topic. You should pick based on what you are trying to research.' },

  modeWebTitle: { id: 'topic.mode.web.title', defaultMessage: 'Media Linking on the Open Web' },
  modeWebDescription: { id: 'topic.mode.web.description', defaultMessage: 'I want to find as many news stories as possible about my topic of interest. I\'m interested in understanding attention, influence, and language within this corpus based on how sources link to each other in their stories. I will be able to:' },
  modeWebDetails: { id: 'topic.mode.web.details', defaultMessage: '<ul><li>Import stories or shared links from various platforms (open web and social media)</li><li>Follow links in the news content to find more related stories (via spidering)</li><li>Filter social media content, and stories linked to, based on my query</li><li>Use cross-linking patterns to investigate network influence</li></ul>' },

  modeUrlSharingTitle: { id: 'topic.mode.UrlSharing.title', defaultMessage: 'URL Sharing on Social Media' },
  modeUrlSharingDescription: { id: 'topic.mode.UrlSharing.description', defaultMessage: 'I want to understand what sources people are linking to when discussing my topic on a social media platform. I\'m interested in understanding attention, influence, and language within these posted links based on who shares them. I will be able to:' },
  modeUrlSharingDetails: { id: 'topic.mode.UrlSharing.details', defaultMessage: '<ul><li>Import shared links in matching posts from a single social media platform</li><li>Limit my corpus to just those links shared in matching posts on the social media platform</li><li>Filter the social media posts based on my query (the linked-to stories will not be filtered)</li><li>Use "cosharing" (the same person sharing links to different media sources) to investigate network influence</li></ul>' },

};

const selector = formValueSelector('topicForm');

const TopicCreateForm = ({ renderTextField, initialValues, change, topicMode, intl }) => (
  <div>
    <Row>
      <Col lg={4}>
        <Field
          name="name"
          component={renderTextField}
          fullWidth
          label={intl.formatMessage(localMessages.name)}
        />
      </Col>
    </Row>
    <Row>
      <Col lg={12}>
        <Field
          name="description"
          component={renderTextField}
          fullWidth
          label={intl.formatMessage(localMessages.description)}
        />
      </Col>
    </Row>
    <TopicSeedDetailsForm
      initialValues={initialValues}
      destroyOnUnmount={false}
      form="topicForm"
      forceUnregisterOnUnmount
    />
    <Row>
      <Col lg={12}>
        <h2><FormattedMessage {...localMessages.modeTitle} /></h2>
        <p><FormattedMessage {...localMessages.modeDescription} /></p>
      </Col>
    </Row>
    <Row>
      <Col lg={6}>
        <TopicModeOption
          selected={topicMode === 'web'}
          mode="web"
          titleMsg={localMessages.modeWebTitle}
          descriptionMsg={localMessages.modeWebDescription}
          detailsMsg={localMessages.modeWebDetails}
          onClick={(mode) => change('mode', mode)}
        />
      </Col>
      <Col lg={6}>
        <TopicModeOption
          selected={topicMode === 'url_sharing'}
          mode="url_sharing"
          titleMsg={localMessages.modeUrlSharingTitle}
          descriptionMsg={localMessages.modeUrlSharingDescription}
          detailsMsg={localMessages.modeUrlSharingDetails}
          onClick={(mode) => change('mode', mode)}
        />
      </Col>
    </Row>
  </div>
);

TopicCreateForm.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderRadio: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  // from parent
  initialValues: PropTypes.object,
  // from state
  topicMode: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  topicMode: selector(state, 'mode'),
});

export default
connect(mapStateToProps)(
  withIntlForm(
    reduxForm({ propTypes })(
      TopicCreateForm
    ),
  ),
);
