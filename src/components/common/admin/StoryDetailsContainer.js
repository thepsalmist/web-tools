import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { Grid, Row } from 'react-flexbox-grid/lib';
import withAsyncFetch from '../hocs/AsyncContainer';
import { fetchStory } from '../../../actions/storyActions';
import SelectedStoryContainer from './SelectedStoryContainer';
import StorySearchForm from './form/StorySearchForm';
import { PERMISSION_ADMIN } from '../../../lib/auth';
import Permissioned from '../Permissioned';

const formSelector = formValueSelector('storySearchForm');

const localMessages = {
  storyTitle: { id: 'user.all.title', defaultMessage: 'Story' },
};

const StoryDetailsContainer = props => (
  <Grid>
    <Permissioned onlyRole={PERMISSION_ADMIN}>
      <h1>
        <FormattedMessage {...localMessages.storyTitle} />
      </h1>
      <Row><StorySearchForm onSearch={searchId => props.fetchData(searchId)} /></Row>
      <br /><br />
      <Row>
        <SelectedStoryContainer />
      </Row>
    </Permissioned>
  </Grid>
);

StoryDetailsContainer.propTypes = {
  // from Hoc
  intl: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  users: PropTypes.array,
  fetchData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.story.info.fetchStatus,
  story: state.story.info,
  searchId: formSelector(state, 'id'),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: id => dispatch(fetchStory(Object.values(id))),
  asyncFetch: () => dispatch(fetchStory(ownProps.params.id)),
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      StoryDetailsContainer
    )
  )
);
