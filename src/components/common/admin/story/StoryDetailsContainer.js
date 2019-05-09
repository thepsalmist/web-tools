import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import StorySearchForm from '../form/StorySearchForm';
import { PERMISSION_ADMIN } from '../../../../lib/auth';
import Permissioned from '../../Permissioned';
import PageTitle from '../../PageTitle';
import SelectedStoryContainer from './SelectedStoryContainer';

const localMessages = {
  title: { id: 'user.all.title', defaultMessage: 'Manage Stories' },
};

const StoryDetailsContainer = props => (
  <Grid>
    <PageTitle value={localMessages.title} />
    <Permissioned onlyRole={PERMISSION_ADMIN}>
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.title} /></h1>
        </Col>
      </Row>
      <StorySearchForm
        onSearch={values => props.dispatch(push({ pathname: `/admin/story/${values.storyId}/details` }))}
        initialValues={{ storyId: props.params.id }}
      />
      { props.params.id && <SelectedStoryContainer id={props.params.id} /> }
    </Permissioned>
  </Grid>
);

StoryDetailsContainer.propTypes = {
  // from Hoc
  intl: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
};

export default
injectIntl(
  connect()(
    StoryDetailsContainer
  )
);
