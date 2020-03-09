import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import withIntlForm from '../../common/hocs/IntlForm';
// import CardActions from '@material-ui/core/CardActions';

const TopicModeOption = ({ mode, titleMsg, descriptionMsg, detailsMsg, selected, onClick }) => (
  <Card className={`topic-mode-option ${selected ? 'selected' : ''}`} onClick={() => onClick(mode)}>
    <CardContent>
      <h3><FormattedMessage {...titleMsg} /> {selected && (<small>(selected)</small>)}</h3>
      <p><FormattedMessage {...descriptionMsg} /></p>
      <FormattedHTMLMessage {...detailsMsg} />
    </CardContent>
  </Card>
);

TopicModeOption.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderRadio: PropTypes.func.isRequired,
  // from parent
  mode: PropTypes.string.isRequired,
  initialValues: PropTypes.object,
  titleMsg: PropTypes.object.isRequired,
  descriptionMsg: PropTypes.object.isRequired,
  detailsMsg: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default withIntlForm(TopicModeOption);
