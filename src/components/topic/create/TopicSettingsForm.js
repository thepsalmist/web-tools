import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import AppButton from '../../common/AppButton';
import withIntlForm from '../../common/hocs/IntlForm';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_MEDIA_EDIT, PERMISSION_ADMIN } from '../../../lib/auth';
import { ADMIN_MAX_RECOMMENDED_STORIES } from '../../../lib/formValidators';

export const TOPIC_FORM_MODE_EDIT = 'TOPIC_FORM_MODE_EDIT';

const localMessages = {
  basics: { id: 'topic.form.section.basics', defaultMessage: 'Basics' },
  name: { id: 'topic.form.detail.name', defaultMessage: 'Topic Name (what is this about?)' },
  nameError: { id: 'topic.form.detail.name.error', defaultMessage: 'Your topic needs a short dsecriptive name.' },
  advancedSettings: { id: 'topic.form.detail.advancedSettings', defaultMessage: 'Advanced Settings' },
  description: { id: 'topic.form.detail.description', defaultMessage: 'Description (why are you making this?)' },
  descriptionError: { id: 'topic.form.detail.desciption.error', defaultMessage: 'Your topic need a description.' },
  maxStories: { id: 'topic.form.detail.maxStories', defaultMessage: 'Maximum # of Stories' },
  maxSeedStoriesHelp: { id: 'topic.form.detail.maxStories', defaultMessage: 'Public users can make topics with up to 100,000 total stories.  Change this if you want to allow a special case exception.' },
  public: { id: 'topic.form.detail.public', defaultMessage: 'Public?' },
  logogram: { id: 'topic.form.detail.logogram', defaultMessage: 'Content in a Logographic Language? (ie. Chinese or Japanese Kanji?)' },
  crimsonHexagon: { id: 'topic.form.detail.crimsonHexagon', defaultMessage: 'Crimson Hexagon Id' },
  crimsonHexagonHelp: { id: 'topic.form.detail.crimsonHexagon.help', defaultMessage: 'If you have set up a Crimson Hexagon monitor on our associated account, enter it\'s numeric ID here and we will automatically pull in all the stories linked to by tweets in your monitor.' },
  maxIterations: { id: 'topic.form.detail.maxIterations', defaultMessage: 'Max Spider Iterations' },
  maxIterationsHelp: { id: 'topic.form.detail.maxIterations.help', defaultMessage: 'You can change how many rounds of spidering you want to do.  If you expect this topic to explode with lots and lots of linked-to stories about the same topic, then keep this small.  Otherwise leave it with the default of 15.' },
};

const TopicSettingsForm = (props) => {
  const { renderTextField, renderCheckbox, renderSelect, handleSubmit, pristine, submitting, asyncValidating, initialValues, onSubmit } = props;
  const { formatMessage } = props.intl;
  const iterations = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  return (
    <form className="edit-topic-settings" name="topicForm" onSubmit={handleSubmit(onSubmit.bind(this))}>
      <Row>
        <Col lg={12}>
          <h2><FormattedMessage {...localMessages.basics} /></h2>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Field
            name="name"
            component={renderTextField}
            fullWidth
            label={formatMessage(localMessages.name)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Field
            name="description"
            component={renderTextField}
            fullWidth
            label={formatMessage(localMessages.description)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <Field
            name="is_public"
            component={renderCheckbox}
            fullWidth
            label={formatMessage(localMessages.public)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <Field
            name="is_logogram"
            component={renderCheckbox}
            fullWidth
            label={formatMessage(localMessages.logogram)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <br />
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{formatMessage(localMessages.advancedSettings)}</Typography>
            </ExpansionPanelSummary>
            <Permissioned onlyRole={PERMISSION_ADMIN}>
              <ExpansionPanelDetails>
                <Field
                  name="max_topic_stories"
                  component={renderTextField}
                  type="inline"
                  fullWidth
                  // defaultValue="100000"
                  label={formatMessage(localMessages.maxStories)}
                  helpertext={ADMIN_MAX_RECOMMENDED_STORIES}
                />
                <Typography><small><FormattedMessage {...localMessages.maxSeedStoriesHelp} /></small></Typography>
              </ExpansionPanelDetails>
            </Permissioned>
            <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
              <ExpansionPanelDetails>
                <Field
                  name="ch_monitor_id"
                  component={renderTextField}
                  fullWidth
                />
                <Typography><small><FormattedMessage {...localMessages.crimsonHexagonHelp} /></small></Typography>
              </ExpansionPanelDetails>
            </Permissioned>
            <ExpansionPanelDetails>
              <Field
                name="max_iterations"
                component={renderSelect}
                fullWidth
              >
                {iterations.map(t => <MenuItem key={t} value={t}>{t === 0 ? `${t} - no spidering` : t}</MenuItem>)}
              </Field>
              <Typography><small><FormattedMessage {...localMessages.maxIterationsHelp} /></small></Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            disabled={pristine || submitting || asyncValidating === true}
            label={initialValues.buttonLabel}
            primary
          />
        </Col>
      </Row>
    </form>
  );
};

TopicSettingsForm.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderCheckbox: PropTypes.func.isRequired,
  renderSelect: PropTypes.func.isRequired,
  // from parent
  mode: PropTypes.string.isRequired,
  initialValues: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  error: PropTypes.string,
  asyncValidating: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'topicSettingsForm',
};

export default
withIntlForm(
  reduxForm(reduxFormConfig)(
    TopicSettingsForm
  )
);
