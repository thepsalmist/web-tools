import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { postgresDateToMoment } from '../../../../lib/dateUtil';
import messages from '../../../../resources/messages';
import { trimToMaxLength } from '../../../../lib/stringUtil';

const localMessages = {
  jobDate: { id: 'version.running.jobDate', defaultMessage: 'Last updated {date}' },
};

class JobDate extends React.Component {
  state = {
    showDetails: false,
  }

  render() {
    const { snapshot, job } = this.props;
    if (job) {
      return (
        <React.Fragment>
          <p>
            <FormattedMessage
              {...localMessages.jobDate}
              values={{ date: postgresDateToMoment(job.last_updated).fromNow() }}
            />.
            &nbsp;
            <a
              href="#toggle-details"
              onClick={(evt) => {
                evt.preventDefault();
                this.setState(prevState => ({ showDetails: !prevState.showDetails }));
              }}
            >
              <FormattedMessage {...messages.details} />
            </a>
          </p>
          { this.state.showDetails && (<p>{trimToMaxLength(snapshot.message || job.message, 600)}</p>) }
        </React.Fragment>
      );
    }
    return null;
  }
}

JobDate.propTypes = {
  // from state
  snapshot: PropTypes.object,
  job: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  JobDate
);
