/*
* @Author: huangteng
* @Date:   2018-03-12 14:52:36
* @Last Modified by:   huangteng
* @Last Modified time: 2018-03-12 16:04:52
* @Description: switch
*/

import React from 'react';
import {spring, TransitionSwitch} from '../../lib/';
import {Link, Route, BrowserRouter as Router} from 'react-router-dom';
import styled from 'styled-components';

const Box = styled.div`
	width: 100vw;
	height: 100vh;
`;

const Header = styled.div`
	height: 10vh;
	width: 100vw;
	position: relative;
`;

const LinkBar = styled.div`
	height: 10vh;
	width: 33.3333%;
	line-height: 10vh;
	float: right;
	text-align: center;
	background-color: #e5e5e5;
	position: relative;
	display: flex;
	flex: 1;
	border-right: 1px solid #f1f1f1;
`;

const LinkStyle = () => ({
	width: '100%',
	height: '100%',
	position: 'relative'
})

const ShowAWrapper = styled.div`
	width: 50vw;
	height: 50vh;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -25vh;
	margin-left: -25vw;
	background-color: pink;
`;
const ShowBWrapper = styled.div`
	width: 50vw;
	height: 50vh;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -25vh;
	margin-left: -25vw;
	background-color: orange;
`;
const ShowCWrapper = styled.div`
	width: 50vw;
	height: 50vh;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -25vh;
	margin-left: -25vw;
	background-color: gray;
`;

const transitions = {
	willEnter: {
		opacity: 0,
		scale: 0
	},
	didEnter: {
		opacity: spring(1, {stiffness:38, damping:15}),
		scale: spring(1, {stiffness:38, damping:15})
	},
	willLeave: {
		opacity: spring(0, {stiffness:150, damping:15}),
		scale: spring(0, {stiffness:150, damping:15})
	}
}

export default class SwitchDemo extends React.PureComponent {
	static defaultProps = {
		routes: [
			{
				path: './a',
				text: 'a'
			},
			{
				path: './b',
				text: 'b'
			},
			{
				path: './c',
				text: 'c'
			}
		]
	}

	mapStyles = style => {
		return {
			opacity: style.opacity,
			transform: `scale(${style.scale})`,
			position: 'absolute',
			top: '50%',
			left: '50%',
		}
	}

	render() {
		return (
			<Router>
				<Box>
					<Header>
						{
							this.props.routes.map(item=>(
								<LinkBar key={item.text}>
									<Link style={LinkStyle()} to={item.path}>{item.text}</Link>
								</LinkBar>
							))
						}
					</Header>
					<TransitionSwitch
						{...transitions}
						mapStyles={this.mapStyles}
					>
						<Route path='/a' component={ShowAWrapper} exact/>
						<Route path='/b' component={ShowBWrapper} exact/>
						<Route path='/c' component={ShowCWrapper} exact/>
					</TransitionSwitch>
				</Box>
			</Router>
		);
	}
}
