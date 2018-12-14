import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
// import { formValueSelector } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withAsyncFetch from '../../hocs/AsyncContainer';
import { fetchStory } from '../../../../actions/storyActions';
import SelectedStoryContainer from './SelectedStoryContainer';
import StorySearchForm from '../form/StorySearchForm';
import { PERMISSION_ADMIN } from '../../../../lib/auth';
import Permissioned from '../../Permissioned';

const localMessages = {
  storyTitle: { id: 'user.all.title', defaultMessage: 'Manage Stories' },
};

const StoryDetailsContainer = props => (
  <Grid>
    <Permissioned onlyRole={PERMISSION_ADMIN}>
      <Row>
        <Col lg={12}>
          <h1>
            <FormattedMessage {...localMessages.storyTitle} />
          </h1>
        </Col>
      </Row>
      <StorySearchForm initialValues={{ storyId: props.storyId }} onSearch={search => props.fetchData(search)} />
      <SelectedStoryContainer />
    </Permissioned>
  </Grid>
);

StoryDetailsContainer.propTypes = {
  // from Hoc
  intl: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  storyId: PropTypes.string,
  fetchData: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.story.info.fetchStatus,
  story: state.story.info,
  storyId: ownProps.params.id,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (story) => {
    dispatch(fetchStory(story.storyId));
    dispatch(push(`admin/story/${story.storyId}/details`));
  },
  asyncFetch: () => {
    dispatch(fetchStory(parseInt(ownProps.params.id, 10)));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      StoryDetailsContainer
    )
  )
);
