import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import UserSearchForm from './UserSearchForm';
import { PERMISSION_ADMIN } from '../../../../lib/auth';
import Permissioned from '../../Permissioned';
import UserListcontainer from './UserListContainer';
import PageTitle from '../../PageTitle';

const localMessages = {
  userTitle: { id: 'user.all.title', defaultMessage: 'Manage Users' },
  feedback: { id: 'user.all.user.delete.feedback', defaultMessage: 'Successfully deleted user.' },
};

const ManageUsersContainer = props => (
  <Permissioned onlyRole={PERMISSION_ADMIN}>
    <Grid>
      <PageTitle value={localMessages.userTitle} />
      <Row>
        <h1><FormattedMessage {...localMessages.userTitle} /></h1>
      </Row>
      <UserSearchForm
        onSearch={values => props.dispatch(push({ pathname: '/admin/users/list', query: { search: values.searchStr } }))}
        initialValues={{ searchStr: props.location.query.search }}
      />
      <UserListcontainer searchStr={props.location.query.search} />
    </Grid>
  </Permissioned>
);

ManageUsersContainer.propTypes = {
  // from compositional chain
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default
injectIntl(
  connect()(
    ManageUsersContainer
  )
);
