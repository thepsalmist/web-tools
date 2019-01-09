import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row } from 'react-flexbox-grid/lib';
import UserSearchForm from './UserSearchForm';
import { PERMISSION_ADMIN } from '../../../../lib/auth';
import Permissioned from '../../Permissioned';
import UserListcontainer from './UserListContainer';
import PageTitle from '../../PageTitle';

const localMessages = {
  userTitle: { id: 'user.all.title', defaultMessage: 'Manage Users' },
  feedback: { id: 'user.all.user.delete.feedback', defaultMessage: 'Successfully deleted user.' },
};

class ManageUsersContainer extends React.Component {
  state = {
    searchStr: undefined,
  };

  render() {
    return (
      <Grid>
        <PageTitle value={localMessages.userTitle} />
        <Permissioned onlyRole={PERMISSION_ADMIN}>
          <Row>
            <h1>
              <FormattedMessage {...localMessages.userTitle} />
            </h1>
          </Row>
          <UserSearchForm onSearch={values => this.setState({ searchStr: values.searchStr })} />
          <UserListcontainer searchStr={this.state.searchStr} />
        </Permissioned>
      </Grid>
    );
  }
}

export default
injectIntl(
  ManageUsersContainer
);
