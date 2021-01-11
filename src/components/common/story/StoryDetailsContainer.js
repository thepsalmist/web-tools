import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import StorySearchForm from '../admin/form/StorySearchForm';
import PageTitle from '../PageTitle';
import SelectedStoryContainer from './SelectedStoryContainer';
import { getUserRoles, hasPermissions, PERMISSION_ADMIN } from '../../../lib/auth';


const localMessages = {
  title: { id: 'user.all.title', defaultMessage: 'Manage Stories' },
};

const StoryDetailsContainer = props => {
  const storyId = props.params.id;
  const { user } = props;

  const isAdmin = hasPermissions(getUserRoles(user), PERMISSION_ADMIN);
  return (
    <Grid>
      <PageTitle value={localMessages.title} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.title} /></h1>
        </Col>
      </Row>
      <StorySearchForm
        onSearch={values => props.dispatch(push({ pathname: `/${isAdmin ? 'admin' : 'general' }/story/${values.storyId}/details` }))}
        initialValues={{ storyId }}
      />
      { storyId && <SelectedStoryContainer id={storyId} isAdmin={isAdmin} /> }
    </Grid>
  );
};

StoryDetailsContainer.propTypes = {
  // from Hoc
  intl: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default
injectIntl(
  connect(mapStateToProps)(
    StoryDetailsContainer
  )
);
