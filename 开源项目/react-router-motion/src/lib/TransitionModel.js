/*
* @Author: huangteng
* @Date:   2018-03-11 21:42:21
* @Last Modified by:   huangteng
* @Last Modified time: 2018-03-12 11:34:32
* @Description: ''
*/
import React, {createElement, cloneElement} from 'react';
import {TransitionMotion} from 'react-motion';
import {ensureSpring} from './ensureSpring';
import PropTypes from 'prop-types';

export default class TransitionModel extends React.PureComponent {
	static propTypes = {
		willEnter: PropTypes.object.isRequired,
		didEnter: PropTypes.object.isRequired,
		willLeave: PropTypes.object.isRequired,
		didLeave: PropTypes.func,
		hasDefaultStyles:  PropTypes.bool,
		wrapperComponent: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.bool,
			PropTypes.element
		]),
		mapStyles: PropTypes.func.isRequired,
		className: PropTypes.string
	};

	static defaultProps = {
		hasDefaultStyles: false,
		wrapperComponent: 'div',
		mapStyles: val => val
	}

	willEnter = () => this.props.willEnter

	willLeave = () => ensureSpring(this.props.willLeave)

	didLeave = (styleThatLeft) => this.props.didLeave && this.props.didLeave(styleThatLeft)

	getDefaultStyles(){
		if(!this.props.children){
			return [];
		}

		if(!this.props.defaultProps){
			return null;
		}

		return [
			{
				key: this.props.children.key,
				data: this.props.children,
				style: this.props.willEnter
			}
		]
	}

	getStyles(){
		if(!this.props.children){
			return [];
		}
		return [
			{
				key: this.props.children.key,
				data: this.props.children,
				style: ensureSpring(this.props.didEnter)
			}
		]
	}

	renderRoute = (config) => {
		const props = {
			style: this.props.mapStyles(config.style),
			key: config.key
		}

		return this.props.wrapperComponent !== false ?
			createElement(this.props.wrapperComponent, props, config.data) :
			cloneElement(config.data, props);
	}

	renderRoutes = interpolatedStyles => 
	(
		<div className={this.props.className}>
			{
				interpolatedStyles.map(this.renderRoute)
			}		
		</div>
	)

	render() {
		return (
			<TransitionMotion
				defaultStyles={this.getDefaultStyles()}
				styles={this.getStyles()}
				willEnter={this.willEnter}
				willLeave={this.willLeave}
				didLeave={this.didLeave}
			>
			{this.renderRoutes}
			</TransitionMotion>
		);
	}
}
