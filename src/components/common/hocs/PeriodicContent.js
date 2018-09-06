import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { calculateTimePeriods, PAST_WEEK, PAST_MONTH, PAST_YEAR, PAST_ALL } from '../../../lib/dateUtil';

const localMessages = {
  pastWeek: { id: 'wordcloud.time.pastWeek', defaultMessage: 'past week' },
  pastMonth: { id: 'wordcloud.time.pastMonth', defaultMessage: 'past month' },
  pastYear: { id: 'wordcloud.time.pastYear', defaultMessage: 'past year' },
  all: { id: 'wordcloud.time.all', defaultMessage: 'all time' },
};

/**
 * Give this:
 * 1. `selectedTimePeriod` string
 * 2. `handleTimePeriodClick` callback handler
 * It gives the child:
 * 1. `timePeriodControls` UI elements
 */
const withTimePeriods = (ChildComponent, hideAllTimeOption = false) => {
  class PeriodicContent extends React.Component {
    saveStateAndTriggerFetch = (timePeriod) => {
      const { handleTimePeriodClick } = this.props;
      handleTimePeriodClick(calculateTimePeriods(timePeriod), timePeriod);
    }

    render() {
      const { selectedTimePeriod } = this.props;
      let allTimeOptionContent;
      if (!hideAllTimeOption) {
        allTimeOptionContent = (
          <a
            href="#"
            role="button"
            tabIndex="0"
            className={selectedTimePeriod === PAST_ALL ? 'selected' : ''}
            onClick={e => this.saveStateAndTriggerFetch(PAST_ALL, e)}
          >
            <FormattedMessage {...localMessages.all} />
          </a>
        );
      }
      const timePeriodControls = (
        <div className="periodic-controls">
          <a
            href="#"
            role="button"
            tabIndex="0"
            className={selectedTimePeriod === PAST_WEEK ? 'selected' : ''}
            onClick={e => this.saveStateAndTriggerFetch(PAST_WEEK, e)}
          >
            <FormattedMessage {...localMessages.pastWeek} />
          </a>
          <a
            href="#"
            role="button"
            tabIndex="0"
            className={selectedTimePeriod === PAST_MONTH ? 'selected' : ''}
            onClick={e => this.saveStateAndTriggerFetch(PAST_MONTH, e)}
          >
            <FormattedMessage {...localMessages.pastMonth} />
          </a>
          <a
            href="#"
            role="button"
            tabIndex="0"
            className={selectedTimePeriod === PAST_YEAR ? 'selected' : ''}
            onClick={e => this.saveStateAndTriggerFetch(PAST_YEAR, e)}
          >
            <FormattedMessage {...localMessages.pastYear} />
          </a>
          {allTimeOptionContent}
        </div>
      );
      return (
        <span className="periodic-container">
          <ChildComponent
            {...this.props}
            timePeriodControls={timePeriodControls}
          />
        </span>
      );
    }
  }
  PeriodicContent.propTypes = {
    intl: PropTypes.object.isRequired,
    selectedTimePeriod: PropTypes.string.isRequired,
    handleTimePeriodClick: PropTypes.func.isRequired,
  };
  return injectIntl(
    PeriodicContent
  );
};

export default withTimePeriods;
