import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import Link from 'react-router/lib/Link';
import { SubmissionError } from 'redux-form';
import { updateUser } from '../../../actions/userActions';
import { updateFeedback, addNotice } from '../../../actions/appActions';
import { LEVEL_ERROR } from '../../common/Notice';
import { PERMISSION_ADMIN } from '../../../lib/auth';
import Permissioned from '../../common/Permissioned';

const localMessages = {
  userTitle: { id: 'user.details.title', defaultMessage: '{name}: ' },
  updateTitle: { id: 'user.details.title.update', defaultMessage: 'Update User' },
  updateButton: { id: 'user.deatils.update.button', defaultMessage: 'Update' },
  feedback: { id: 'user.deatils.feedback', defaultMessage: 'Successfully updated this user.' },
};

class UpdateUserContainer extends React.Component {
  render() {
    const { user } = this.props;
    const { formatMessage } = this.props.intl;
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
  }
}

UpdateUserContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  // from context
  params: PropTypes.object.isRequired, // params from router
  // from state
  fetchStatus: PropTypes.string.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.users.users.selected.feed.info.fetchStatus,
  user: state.system.users.selected.user,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
      name: values.full_name,
      email: values.email,
      active: values.active,
      roles: values.roles,
    };
    dispatch(updateFeed(infoToSave))
      .then((result) => {
        if (result!== undefined) {
          // let them know it worked
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // need to fetch it again because something may have changed
          dispatch(fetchuserFeed(ownProps.params.mediaId, ownProps.params.feedId))
            .then(() => dispatch(push(`/users/${ownProps.params.userId}/feeds`)));
        }
      });
  },
  fetchData: (user) => {
    dispatch(updateUser(user));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    UpdateUserContainer
  )
);
