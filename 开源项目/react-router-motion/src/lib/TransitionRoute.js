/*
* @Author: huangteng
* @Date:   2018-03-11 22:44:23
* @Last Modified by:   huangteng
* @Last Modified time: 2018-03-12 14:40:21
* @Description: ''
*/

import React from 'react';
import {Route, matchPath} from 'react-router-dom';
import TransitionModel from './TransitionModel';

const getKey = ({pathname}, exact, path) => {
	return matchPath(pathname, {exact, path}) ? 'match' : 'no-match';
}

export const TransitionRoute = ({component, exact, path, ...rest}) => {
	return (
		<Route 
			render={({location, match}) => (
				<TransitionModel {...rest}>
					<Route 
						key = {getKey(location, exact, path)}
						path = {path}
						exact = {exact}
						component = {component}
						location = {location}
					/>
				</TransitionModel>
			)}
		/>
	)
}
