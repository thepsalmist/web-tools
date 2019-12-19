import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm, Field, propTypes } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from '@material-ui/core/MenuItem';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withIntlForm from '../../common/hocs/IntlForm';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_ADMIN } from '../../../lib/auth';
import { ADMIN_MAX_RECOMMENDED_STORIES } from '../../../lib/formValidators';
import QueryHelpDialog from '../../common/help/QueryHelpDialog';
import messages from '../../../resources/messages';

const localMessages = {
  advancedSettings: { id: 'topic.form.detail.advancedSettings', defaultMessage: 'Advanced Settings' },
  seedQuery: { id: 'topic.form.detail.seedQuery', defaultMessage: 'Relevance Query' },
  seedQueryDescription: { id: 'topic.form.detail.seedQuery.about', defaultMessage: 'Applicable to Open Web platforms only. Enter a boolean query to select stories that will seed this topic\'s Open Web platform. Links in stories already in our database that match this query will be followed to find more stories that might not be in our database already.' },
  maxStories: { id: 'topic.form.detail.maxStories', defaultMessage: 'Maximum # of Stories' },
  maxSeedStoriesHelp: { id: 'topic.form.detail.maxStories', defaultMessage: 'Public users can make topics with up to 100,000 total stories.  Change this if you want to allow a special case exception.' },
  maxIterations: { id: 'topic.form.detail.maxIterations', defaultMessage: 'Max Spider Iterations' },
  maxIterationsHelp: { id: 'topic.form.detail.maxIterations.help', defaultMessage: 'Applicable to Open Web platforms only. You can change how many rounds of spidering you want to do.  If you expect this topic to explode with lots and lots of linked-to stories about the same topic, then keep this small. Otherwise leave it with the default of 15.' },
};

const TopicAdvancedForm = (props) => {
  const { renderTextField, renderSelect } = props;
  const { formatMessage } = props.intl;
  const iterations = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  return (
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
                name="solr_seed_query"
                component={renderTextField}
                multiline
                rows={2}
                rowsMax={4}
                fullWidth
                label={formatMessage(localMessages.seedQuery)}
              />
              <small>
                <b><QueryHelpDialog trigger={formatMessage(messages.queryHelpLink)} /></b>
                <FormattedMessage {...localMessages.seedQueryDescription} />
              </small>
            </ExpansionPanelDetails>
          </Permissioned>
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
          <ExpansionPanelDetails>
            <Field
              name="max_iterations"
              component={renderSelect}
              fullWidth
              defaultValue={0}
            >
              {iterations.map(t => <MenuItem key={t} value={t}>{t === 0 ? `${t} - no spidering` : t}</MenuItem>)}
            </Field>
            <Typography>
              <small>
                <FormattedMessage {...localMessages.maxIterationsHelp} />
              </small>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Col>
    </Row>
  );
};

TopicAdvancedForm.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderCheckbox: PropTypes.func.isRequired,
  renderSelect: PropTypes.func.isRequired,
  // from parent
  initialValues: PropTypes.object,
  pristine: PropTypes.bool.isRequired,
  error: PropTypes.string,
  asyncValidating: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default
withIntlForm(
  reduxForm({ propTypes })(
    TopicAdvancedForm
  )
);
