import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component';
import Layout from '../hoc/layout/layout';
import NotFound from '../components/404/404';
import Loader from '../components/loader/loader';

const HomeContainer = loadable(
  () => import(/* webpackPrefetch: true */ './home/container/home.container'),
  {
    fallback: <Loader />,
  },
);

export default class AppRoutes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.routes = [
      {
        path: '/',
        component: HomeContainer,
        exact: true,
        index: 0,
      },
      {
        path: '/home',
        component: HomeContainer,
        exact: false,
        index: 1,
      },
      {
        component: NotFound,
        index: 99,
      },
    ];
  }

  renderRoutes() {
    return this.routes.map(route =>
      route.path ? (
        <Route
          key={route.index}
          exact
          path={route.path}
          component={route.component}
        />
      ) : (
        <Route key={route.index} render={() => <NotFound delay={200} />} />
      ),
    );
  }

  render() {
    return (
      <Layout {...this.props}>
        <Switch>{this.renderRoutes()}</Switch>
      </Layout>
    );
  }
}
