import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import * as React from 'react';
import asyncComponent from './utils/async';
const AsyncSetComponent = asyncComponent(() => import('./setting'));
const AsyncApp = asyncComponent(() => import('./App'));

const Routes = () => (
	<Router>
		<Switch>
			<Route exact={true} path="/" component={AsyncApp}/>
			<Route exact={true} path="/set" component={AsyncSetComponent}/>
			<Route component={AsyncApp}/>
		</Switch>
	</Router>
)

export default Routes;