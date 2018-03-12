/*
* @Author: huangteng
* @Date:   2018-03-12 11:59:28
* @Last Modified by:   huangteng
* @Last Modified time: 2018-03-12 14:55:48
* @Description: ''
*/
import React from 'react';
import TransitionModel from './TransitionModel';
import PropTypes from 'prop-types';
import {Route, Switch} from 'react-router-dom';

const getLocationKey = location => {
	return typeof location.key === 'string' ? location.key : '';
}

class TransitionSwitch extends React.PureComponent {
	static propTypes = {
    location: PropTypes.shape({
      key: PropTypes.string,
      pathname: PropTypes.string,
    }),
  };

	state = {
		key: getLocationKey(this.props.location)
	}

	matches = 0;

	componentWillReceiveProps(nextProps){
		if(this.state.key !== getLocationKey(nextProps.location)){
			this.setState({
				key: getLocationKey(nextProps.location)+ ++this.matches
			})
		}
	}

	render() {
		const {children, location, ...rest} = this.props;
		return (
			<TransitionModel {...rest}>
				<Switch key={this.state.key} location={location}>
					{children}
				</Switch>	
			</TransitionModel>
		);
	}
}

const SwitchWrapper = (props) => {
	return (
		<Route 
			children={({location})=>(
				<TransitionSwitch location={location} {...props}/>
			)}
		/>
	)
}

export default SwitchWrapper
