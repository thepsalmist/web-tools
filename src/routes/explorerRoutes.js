import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import Homepage from '../components/explorer/home/Homepage';
import About from '../components/explorer/About';
import DemoQueryContainer from '../components/explorer/builder/DemoQueryContainer';
import LoggedInQueryContainer from '../components/explorer/builder/LoggedInQueryContainer';
import ExplorerApp from '../components/explorer/ExplorerApp';
import { requireAuth } from './routes';
import userRoutes from './userRoutes';
import systemRoutes from './systemRoutes';
import adminRoutes from './adminRoutes';

const explorerRoutes = (
  <Route path="/" component={ExplorerApp}>

    <IndexRedirect to="/home" />

    <Route path="/about" component={About} />
    <Route path="/home" component={Homepage} />

    <Route path="/queries">
      <Route path="demo">
        <Route path="search" component={DemoQueryContainer} />
        <Route path=":id" component={DemoQueryContainer} />
      </Route>
      <Route path="search" component={LoggedInQueryContainer} onEnter={requireAuth} />
    </Route>

    {userRoutes}
    {systemRoutes}
    {adminRoutes}

  </Route>
);

export default explorerRoutes;
