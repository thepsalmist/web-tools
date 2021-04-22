import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class CollapsingPanel extends React.Component {
  state = {
    open: false,
  };

  handleToggle = (evt) => {
    evt.preventDefault();
    this.setState((prevState) => ({ open: !prevState.open }));
  };

  render() {
    const { titleMsg, children } = this.props;
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h3><FormattedMessage {...titleMsg} /></h3>
        </AccordionSummary>
        <AccordionDetails>
          {children}
        </AccordionDetails>
      </Accordion>
    );
  }
}

CollapsingPanel.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  // from parent
  titleMsg: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default injectIntl(CollapsingPanel);
