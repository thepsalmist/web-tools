import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import withAsyncFetch from '../hocs/AsyncContainer';
import { selectSystemUser, updateSystemUser, fetchSystemUser } from '../../../actions/systemActions';
import { updateFeedback } from '../../../actions/appActions';
import UserForm from './form/UserForm';
import { PERMISSION_ADMIN } from '../../../lib/auth';
import Permissioned from '../Permissioned';

const localMessages = {
  userTitle: { id: 'user.details.title', defaultMessage: '{name}: ' },
  updateTitle: { id: 'user.details.title.update', defaultMessage: 'Update User' },
  updateButton: { id: 'user.deatils.update.button', defaultMessage: 'Update' },
  feedback: { id: 'user.deatils.feedback', defaultMessage: 'Successfully updated this user.' },
};

const UpdateUserContainer = (props) => {
  const { user, handleSave } = props;
  const { formatMessage } = props.intl;
  const content = null;
  const intialValues = {
    ...user,
  };
  if (user === undefined) {
    return (
      <div>
        { content }
      </div>
    );
  }
  return (
    <Grid className="details user-details">
      <h2>
        <FormattedMessage {...localMessages.updateTitle} />
      </h2>
      <Permissioned onlyRole={PERMISSION_ADMIN}>
        <UserForm
          initialValues={intialValues}
          user={user}
          onSave={handleSave}
          buttonLabel={formatMessage(localMessages.updateButton)}
        />
      </Permissioned>
    </Grid>
  );
};

UpdateUserContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleSave: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  // from context
  params: PropTypes.object.isRequired, // params from router
  // from state
  fetchStatus: PropTypes.string.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.users.users.selected.feed.info.fetchStatus,
  feed: state.users.users.selected.feed.info.feed,
  userId: parseInt(ownProps.params.userId, 10),
  feedId: parseInt(ownProps.params.feedId, 10),
  userName: state.users.users.selected.userDetails.name,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
      name: values.name,
      url: values.url,
      active: values.active,
      type: values.type,
    };
    dispatch(updateSystemUser(ownProps.params.feedId, infoToSave))
      .then((result) => {
        if (result !== undefined) {
          // let them know it worked
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // need to fetch it again because something may have changed
          dispatch(fetchSystemUser(ownProps.params.auth_users_id))
            .then(() => dispatch(push(`/users/${ownProps.params.userId}/update`)));
        }
      });
  },
  asyncFetch: () => {
    dispatch(selectSystemUser(ownProps.params.userId));
    dispatch(fetchSystemUser(ownProps.params.userId));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      UpdateUserContainer
    )
  )
);
