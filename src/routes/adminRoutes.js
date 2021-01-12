import React from 'react';
import Route from 'react-router/lib/Route';
import ManageUsersContainer from '../components/common/admin/users/ManageUsersContainer';
import UpdateUserContainer from '../components/common/admin/users/UpdateUserContainer';
import StoryDetailsContainer from '../components/common/story/StoryDetailsContainer';
import UpdateStoryContainer from '../components/common/admin/story/UpdateStoryContainer';
import StoryCachedContainer from '../components/common/admin/story/StoryCachedContainer';
import AdminWrapper from '../components/common/admin/AdminWrapper';
import AnalyticsDashboard from '../components/common/admin/analytics/AnalyticsDashboard';
import { requireAuth } from './routes';

const adminRoutes = (
  <Route path="/admin">

    <Route path="/admin" component={AdminWrapper}>

      <Route path="/admin/users/:id/update" component={UpdateUserContainer} onEnter={requireAuth} />
      <Route path="/admin/users/list" component={ManageUsersContainer} onEnter={requireAuth} />

      <Route path="/admin/story/details" component={StoryDetailsContainer} onEnter={requireAuth} />
      <Route path="/admin/story/:id/details" component={StoryDetailsContainer} onEnter={requireAuth} />
      <Route path="/admin/story/:id/update" component={UpdateStoryContainer} onEnter={requireAuth} />
      <Route path="/admin/story/:id/cached" component={StoryCachedContainer} onEnter={requireAuth} />

      <Route path="/admin/analytics" component={AnalyticsDashboard} onEnter={requireAuth} />

    </Route>

  </Route>

);

export default adminRoutes;
