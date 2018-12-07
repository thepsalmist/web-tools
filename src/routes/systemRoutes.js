import React from 'react';
import Route from 'react-router/lib/Route';
import RecentNewsContainer from '../components/common/news/RecentNewsContainer';
import PageNotFound from '../components/PageNotFound';
import AdminWrapper from '../components/common/admin/AdminWrapper';
import ManageUsersContainer from '../components/common/admin/users/ManageUsersContainer';
import UpdateUserContainer from '../components/common/admin/users/UpdateUserContainer';
import StoryDetailsContainer from '../components/common/admin/story/StoryDetailsContainer';
import UpdateStoryContainer from '../components/common/admin/story/UpdateStoryContainer';
import { requireAuth } from './routes';

const systemRoutes = (
  <Route path="/">

    <Route path="/recent-news" component={RecentNewsContainer} />

    <Route path="/admin" component={AdminWrapper}>

      <Route path="/admin/users/:id/update" component={UpdateUserContainer} onEnter={requireAuth} />
      <Route path="/admin/users/list" component={ManageUsersContainer} onEnter={requireAuth} />

      <Route path="/admin/story/details" component={StoryDetailsContainer} onEnter={requireAuth} />
      <Route path="/admin/story/:id/details" component={StoryDetailsContainer} onEnter={requireAuth} />
      <Route path="/admin/story/:id/update" component={UpdateStoryContainer} onEnter={requireAuth} />

    </Route>

    <Route path="*" component={PageNotFound} />

  </Route>
);

export default systemRoutes;
