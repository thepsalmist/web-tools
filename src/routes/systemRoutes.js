import React from 'react';
import Route from 'react-router/lib/Route';
import RecentNewsContainer from '../components/common/news/RecentNewsContainer';
import PageNotFound from '../components/PageNotFound';

const systemRoutes = (
  <Route path="/">

    <Route path="/recent-news" component={RecentNewsContainer} />

    <Route path="*" component={PageNotFound} />

  </Route>
);

export default systemRoutes;
