import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import MenuItem from '@material-ui/core/MenuItem';
import { PAST_DAY, PAST_WEEK, PAST_MONTH } from '../../../lib/dateUtil';

const localMessages = {
  pastDay: { id: 'wordcloud.time.pastDay', defaultMessage: 'chart by day' },
  pastWeek: { id: 'wordcloud.time.pastWeek', defaultMessage: 'chart by week' },
  pastMonth: { id: 'wordcloud.time.pastMonth', defaultMessage: 'chart by month' },
  pastYear: { id: 'wordcloud.time.pastYear', defaultMessage: 'chart by year' },
};

/**
 * Give this:
 * 1. `selectedTimePeriod` string
 * 2. `handleTimePeriodClick` callback handler
 * It gives the child:
 * 1. `timePeriodControls` UI elements
 */
const withAttentionAggregation = (ChildComponent) => {
  class AttentionAggregation extends React.Component {
    saveStateAndReorder = (timePeriod) => {
      const { handleTimePeriodClick } = this.props;
      handleTimePeriodClick(timePeriod);
    }

    render() {
      const { selectedTimePeriod } = this.props;
      const attentionViewOptions = (
        <div className="periodic-controls">
          <MenuItem
            className="action-icon-menu-item"
            disabled={selectedTimePeriod === PAST_DAY}
            onClick={e => this.saveStateAndReorder(PAST_DAY, e)}
          >
            <FormattedMessage {...localMessages.pastDay} />
          </MenuItem>
          <MenuItem
            className="action-icon-menu-item"
            disabled={selectedTimePeriod === PAST_WEEK}
            onClick={e => this.saveStateAndReorder(PAST_WEEK, e)}
          >
            <FormattedMessage {...localMessages.pastWeek} />
          </MenuItem>
          <MenuItem
            className="action-icon-menu-item"
            disabled={selectedTimePeriod === PAST_MONTH}
            onClick={e => this.saveStateAndReorder(PAST_MONTH, e)}
          >
            <FormattedMessage {...localMessages.pastMonth} />
          </MenuItem>
        </div>
      );
      return (
        <span className="periodic-container">
          <ChildComponent
            {...this.props}
            attentionViewOptions={attentionViewOptions}
          />
        </span>
      );
    }
  }
  AttentionAggregation.propTypes = {
    intl: PropTypes.object.isRequired,
    selectedTimePeriod: PropTypes.string.isRequired,
    handleTimePeriodClick: PropTypes.func, // call into child definition
  };
  return injectIntl(
    AttentionAggregation
  );
};

export default withAttentionAggregation;
