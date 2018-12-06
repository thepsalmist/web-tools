import React from 'react';
import Route from 'react-router/lib/Route';
import RecentNewsContainer from '../components/common/news/RecentNewsContainer';
import PageNotFound from '../components/PageNotFound';
import ManageUsersContainer from '../components/common/admin/ManageUsersContainer';
import UpdateUserContainer from '../components/common/admin/UpdateUserContainer';
import StoryDetailsContainer from '../components/common/admin/StoryDetailsContainer';
import UpdateStoryContainer from '../components/common/admin/UpdateStoryContainer';
import { requireAuth } from './routes';

const systemRoutes = (
  <Route path="/">

    <Route path="/recent-news" component={RecentNewsContainer} />

    <Route path="/admin">

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
