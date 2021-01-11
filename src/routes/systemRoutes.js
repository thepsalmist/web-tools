import React from 'react';
import Route from 'react-router/lib/Route';
import StoryDetailsContainer from '../components/common/story/StoryDetailsContainer';
import RecentNewsContainer from '../components/common/news/RecentNewsContainer';
import PageNotFound from '../components/PageNotFound';
import ApiConsole from '../components/common/apiConsole/ApiConsole';
import adminRoutes from './adminRoutes';
import userRoutes from './userRoutes';
import { requireAuth } from './routes';

const systemRoutes = (
  <Route path="/">

    <Route path="/recent-news" component={RecentNewsContainer} />

    {userRoutes}

    {adminRoutes}

    <Route path="/general/story/details" component={StoryDetailsContainer} onEnter={requireAuth} />
    <Route path="/general/story/:id/details" component={StoryDetailsContainer} onEnter={requireAuth} />

    <Route path="/api-console" component={ApiConsole} />

    <Route path="*" component={PageNotFound} />

  </Route>
);

export default systemRoutes;
