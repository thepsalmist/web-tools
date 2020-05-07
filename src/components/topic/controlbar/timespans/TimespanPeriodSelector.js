import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  timespansOverall: { id: 'timespans.overall', defaultMessage: 'Overall' },
  timespansMonthly: { id: 'timespans.overall', defaultMessage: 'Monthly' },
  timespansWeekly: { id: 'timespans.overall', defaultMessage: 'Weekly' },
  timespansCustom: { id: 'timespans.overall', defaultMessage: 'Custom' },
};

const TimespanPeriodSelector = ({ onPeriodSelected, selectedPeriod, validPeriods }) => {
  const linkToPeriod = (name, msg) => {
    if (!validPeriods || validPeriods.includes(name)) {
      return (
        <a
          href={`#see-${name}-timespans"`}
          onClick={(evt) => { evt.preventDefault(); onPeriodSelected(name); }}
          className={(selectedPeriod === name) ? 'greyed selected' : 'greyed unselected'}
        >
          <FormattedMessage {...msg} />
        </a>
      );
    }
    return null;
  };
  return (
    <div className="timespan-period-selector">
      { linkToPeriod('overall', localMessages.timespansOverall) }
      { linkToPeriod('monthly', localMessages.timespansMonthly) }
      { linkToPeriod('weekly', localMessages.timespansWeekly) }
      { linkToPeriod('custom', localMessages.timespansCustom) }
    </div>
  );
};

TimespanPeriodSelector.propTypes = {
  // from parent
  selectedPeriod: PropTypes.string.isRequired,
  onPeriodSelected: PropTypes.func.isRequired,
  validPeriods: PropTypes.array,
};

export default
injectIntl(
  TimespanPeriodSelector
);
