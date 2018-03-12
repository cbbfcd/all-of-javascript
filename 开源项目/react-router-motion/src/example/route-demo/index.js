/*
* @Author: huangteng
* @Date:   2018-03-11 22:52:21
* @Last Modified by:   huangteng
* @Last Modified time: 2018-03-12 14:04:43
* @Description: 路由动画
*/
import React from 'react';
import {Link, BrowserRouter as Router} from 'react-router-dom';
import {TransitionRoute, spring} from '../../lib';
import styled from 'styled-components';

// container
const Container = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	background-color: #f7f7f7;
	position: relative;
`;

const LinkBox = styled.div`
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
`;

// slider
const Box = styled.div`
	position: relative;
	width: 300px;
	height: 100vh;
	background-color: pink;
	&>a {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
`;

const Slider = () => <Box><Link to=''>hide slider</Link></Box>

const sliderTransition = {
	willEnter: {
		offset: -300
	},
	willLeave: {
		offset: spring(-300, {stiffness:60, damping:15})
	},
	didEnter: {
		offset: spring(0, {stiffness:60, damping:15})
	}
}

export default class RouteDemo extends React.PureComponent {

	mapStyles = (style) => {
		return {
			transform: `translateX(${style.offset}px)`
		}
	}

	render() {
		return (
			<Router>
				<Container>
					<LinkBox>
						<Link to='/slider'>show slider</Link>
					</LinkBox>
					<TransitionRoute 
						path='/slider'
						exact={true}
						component={Slider}
						{...sliderTransition}
						mapStyles={this.mapStyles}
					/>
				</Container>
			</Router>
		);
	}
}

