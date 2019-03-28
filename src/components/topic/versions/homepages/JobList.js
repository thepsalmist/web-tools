import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';
import { postgresDateToMoment } from '../../../../lib/dateUtil';
import { trimToMaxLength } from '../../../../lib/stringUtil';

const localMessages = {
  title: { id: 'topic.jobs.list', defaultMessage: 'Detailed Jobs List' },
  id: { id: 'topic.jobs.id', defaultMessage: 'Id' },
  status: { id: 'topic.jobs.status', defaultMessage: 'State' },
  lastUpdated: { id: 'topic.jobs.lastUpdated', defaultMessage: 'Last Updated' },
  message: { id: 'topic.jobs.message', defaultMessage: 'Message' },
};

const JobList = ({ jobs }) => (
  <React.Fragment>
    <h2><FormattedMessage {...localMessages.title} /></h2>
    <table>
      <thead>
        <tr>
          <th><FormattedMessage {...localMessages.id} /></th>
          <th><FormattedMessage {...localMessages.status} /></th>
          <th><FormattedMessage {...localMessages.lastUpdated} /></th>
          <th><FormattedMessage {...localMessages.message} /></th>
        </tr>
      </thead>
      <tbody>
        {jobs
          .sort((a, b) => postgresDateToMoment(b.last_updated) - postgresDateToMoment(a.last_updated))
          .map(job => (
            <tr key={job.job_states_id}>
              <td>{job.job_states_id}</td>
              <td><span className={(job.state === 'error') ? 'warning' : ''}>{job.state}</span></td>
              <td>
                <FormattedDate value={postgresDateToMoment(job.last_updated)} />
                &nbsp;
                <FormattedTime value={postgresDateToMoment(job.last_updated)} />
              </td>
              <td>{trimToMaxLength(job.message, 500)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </React.Fragment>
);

JobList.propTypes = {
  // from state
  jobs: PropTypes.array.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  JobList
);
