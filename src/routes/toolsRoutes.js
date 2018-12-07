import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import ToolsApp from '../components/tools/ToolsApp';
import ToolsHomeContainer from '../components/tools/ToolsHomeContainer';
import ManageUsersContainer from '../components/common/admin/users/ManageUsersContainer';
import UpdateUserContainer from '../components/common/admin/users/UpdateUserContainer';
import StoryDetailsContainer from '../components/common/admin/story/StoryDetailsContainer';
import UpdateStoryContainer from '../components/common/admin/story/UpdateStoryContainer';
import StoryCachedContainer from '../components/common/admin/story/StoryCachedContainer';
import userRoutes from './userRoutes';
import systemRoutes from './systemRoutes';
import { requireAuth } from './routes';

const toolsRoutes = (
  <Route path="/" component={ToolsApp}>

    <IndexRedirect to="/home" />

    <Route path="home" component={ToolsHomeContainer} />
    <Route path="/admin">
      <Route path="/admin/users/:id/update" component={UpdateUserContainer} onEnter={requireAuth} />
      <Route path="/admin/users/list" component={ManageUsersContainer} onEnter={requireAuth} />
      <Route path="/admin/story/details" component={StoryDetailsContainer} onEnter={requireAuth} />
      <Route path="/admin/story/:id/details" component={StoryDetailsContainer} onEnter={requireAuth} />
      <Route path="/admin/story/:id/update" component={UpdateStoryContainer} onEnter={requireAuth} />
      <Route path="/admin/story/:id/cached" component={StoryCachedContainer} onEnter={requireAuth} />

    </Route>
    {userRoutes}
    {systemRoutes}

  </Route>
);

export default toolsRoutes;
