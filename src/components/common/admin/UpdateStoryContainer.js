import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import withAsyncFetch from '../hocs/AsyncContainer';
import { fetchStory, selectStory, updateStory } from '../../../actions/storyActions';
import { updateFeedback } from '../../../actions/appActions';
import StoryDetailsForm from './form/StoryDetailsForm';
import { PERMISSION_ADMIN } from '../../../lib/auth';
import Permissioned from '../Permissioned';

const localMessages = {
  userTitle: { id: 'user.details.title', defaultMessage: '{name}: ' },
  updateTitle: { id: 'user.details.title.update', defaultMessage: 'Update Story' },
  updateButton: { id: 'user.deatils.update.button', defaultMessage: 'Update' },
  feedback: { id: 'user.deatils.feedback', defaultMessage: 'Successfully updated this story.' },
};

const UpdateStoryContainer = (props) => {
  const { story, handleSave } = props;
  const { formatMessage } = props.intl;
  const content = null;
  if (story === undefined) {
    return (
      <div>
        { content }
      </div>
    );
  }
  return (
    <Grid className="details story-details">
      <h1>
        <FormattedMessage {...localMessages.updateTitle} />
      </h1>
      <Permissioned onlyRole={PERMISSION_ADMIN}>
        <StoryDetailsForm
          story={story}
          initialValues={story}
          onSave={handleSave}
          buttonLabel={formatMessage(localMessages.updateButton)}
        />
      </Permissioned>
    </Grid>
  );
};

UpdateStoryContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleSave: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  // from context
  params: PropTypes.object.isRequired, // params from router
  // from state
  fetchStatus: PropTypes.string.isRequired,
  story: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.story.info.fetchStatus,
  story: state.story.info,
  storyId: ownProps.params.id,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
      ...values,
      active: values.active || false,
    };
    return dispatch(updateStory(ownProps.params.id, infoToSave))
      .then((result) => {
        if (result.success) {
          // let them know it worked
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // need to fetch it again because something may have changed
          window.location.reload();
        }
      });
  },
  asyncFetch: () => {
    dispatch(selectStory(ownProps.params.id));
    dispatch(fetchStory(ownProps.params.id));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      UpdateStoryContainer
    )
  )
);