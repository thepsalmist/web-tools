import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import Link from 'react-router/lib/Link';
import { SubmissionError } from 'redux-form';
import MediaSourceIcon from '../../common/icons/MediaSourceIcon';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { selectSourceFeed, updateFeed, fetchSourceFeed } from '../../../actions/sourceActions';
import { updateFeedback, addNotice } from '../../../actions/appActions';
import { LEVEL_ERROR } from '../../common/Notice';
import SourceFeedForm from './form/SourceFeedForm';

const localMessages = {
  sourceFeedsTitle: { id: 'source.details.feeds.title', defaultMessage: '{name}: ' },
  updateFeedsTitle: { id: 'source.details.feeds.title.update', defaultMessage: 'Update Feed' },
  updateButton: { id: 'source.deatils.feeds.update.button', defaultMessage: 'Update' },
  feedback: { id: 'source.deatils.feeds.feedback', defaultMessage: 'Successfully updated this feed.' },
  duplicateKey: { id: 'source.deatils.feeds.feedback.error.duplicate', defaultMessage: 'Duplicate key error' },
  notValidRss: { id: 'source.deatils.feeds.feedback.error.notValidRss', defaultMessage: 'Not Valid Rss error' },
  didNotWork: { id: 'source.deatils.feeds.feedback.error.didNotWork', defaultMessage: 'Did not work' },
};

class EditSourceFeedContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { feedId, fetchData } = this.props;
    if ((nextProps.feedId !== feedId)) {
      fetchData(nextProps.feedId);
    }
  }

  downloadCsv = () => {
    const { feedId, sourceId } = this.props;
    const url = `/api/sources/${sourceId}/feeds/${feedId}feeds.csv`;
    window.location = url;
  }

  render() {
    const { feed, handleSave, sourceName, sourceId } = this.props;
    const { formatMessage } = this.props.intl;
    const content = null;
    const intialValues = {
      ...feed,
    };
    if (feed === undefined) {
      return (
        <div>
          { content }
        </div>
      );
    }
    return (
      <Grid className="details source-feed-details">
        <h2>
          <MediaSourceIcon height={32} />
          <Link to={`/sources/${sourceId}/feeds`} >
            <FormattedMessage {...localMessages.sourceFeedsTitle} values={{ name: sourceName }} />
          </Link>
          <FormattedMessage {...localMessages.updateFeedsTitle} />
        </h2>
        <SourceFeedForm
          initialValues={intialValues}
          sourceName={sourceName}
          onSave={handleSave}
          buttonLabel={formatMessage(localMessages.updateButton)}
        />
      </Grid>
    );
  }

}

EditSourceFeedContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  // from context
  params: PropTypes.object.isRequired,       // params from router
  // from state
  fetchStatus: PropTypes.string.isRequired,
  sourceId: PropTypes.number,
  sourceName: PropTypes.string.isRequired,
  feed: PropTypes.object,
  feedId: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.sources.sources.selected.feed.info.fetchStatus,
  feed: state.sources.sources.selected.feed.info.feed,
  sourceId: parseInt(ownProps.params.sourceId, 10),
  feedId: parseInt(ownProps.params.feedId, 10),
  sourceName: state.sources.sources.selected.sourceDetails.name,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
      name: values.name,
      url: values.url,
      active: values.active,
      type: values.type,
    };
    dispatch(updateFeed(ownProps.params.feedId, infoToSave))
      .then((result) => {
        if (result.feed !== undefined) {
          // let them know it worked
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // need to fetch it again because something may have changed
          dispatch(fetchSourceFeed(ownProps.params.mediaId, ownProps.params.feedId))
            .then(() =>
              dispatch(push(`/sources/${ownProps.params.sourceId}/feeds`))
            );
        } else if (result.message && result.message.includes('duplicate key')) {
          dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.duplicateKey) }));
          throw new SubmissionError({ url: ownProps.intl.formatMessage(localMessages.duplicateKey) });
        } else if (result.message && result.message.includes('invalid')) {
          dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.notValidRss) }));
          throw new SubmissionError({ url: ownProps.intl.formatMessage(localMessages.notValidRss) });
        } else {
          dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.didNotWork), details: result.message }));
          throw new SubmissionError({ url: ownProps.intl.formatMessage(localMessages.didNotWork) });
        }
      });
  },
  fetchData: (feedId) => {
    dispatch(selectSourceFeed(feedId));
    dispatch(fetchSourceFeed(feedId));
  },
  asyncFetch: () => {
    dispatch(selectSourceFeed(ownProps.params.feedId));
    dispatch(fetchSourceFeed(ownProps.params.sourceId, ownProps.params.feedId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      withAsyncFetch(
        EditSourceFeedContainer
      )
    )
  );
