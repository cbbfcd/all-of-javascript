/*
* @Author: huangteng
* @Date:   2018-02-26 21:37:40
* @Last Modified by:   huangteng
* @Last Modified time: 2018-03-06 21:03:28
* @Description: 滑动条组件
*/
import React from 'react';
import styled from 'styled-components';

// 滑动条容器
const Wrapper = styled.div`
	height: 12px;
	padding: 4px 10px;
	position: relative;
	top: 50%;
	margin-top: -6px;
	box-sizing: border-box;
	cursor: pointer;
`;

// 滑动条
const SliderLine = styled.div`
	position: relative;
	width: 100%;
	height: 4px;
	top: 50%;
	margin-top: -2px;
	background-color: #f5f5f5;
	transition: background-color .3s;
	border-radius: 2px;
	&: hover{
		background-color: #e1e1e1;
	}
`;

// 滑动条左侧
const SliderLeft = styled.div`
	position: absolute;
	width: ${props=>`${props.left}%`};
	height: 4px;
	top: 50%;
	margin-top: -2px;
	background-color: #91d5ff;
	transition: background-color .3s;
	border-radius: 2px;
	&: hover{
		background-color: #69c0ff;
	}
`;

// 滚动球
const SliderBall = styled.div`
	position: absolute;
	right: 0;
	width: 14px;
	height: 14px;
	border-radius: 50%;
	border: 2px solid #91d5ff;
	background-color: #fff;
	margin-top:-7px;
	margin-right: -9px;
	transition: border-color .3s;
	&: hover{
		border-color: #69c0ff;
		&> div{
			display: block;
		}
	}
`;

// 提示
const SliderToolTip = styled.div`
	text-align: center;
	color: #fff;
	line-height: 30px;
	position: absolute;
	display: block;
	width: 36px;
	height: 30px;
	border-radius: 3px;
	background-color: #555;
	bottom: 28px;
	margin-left: -8px;
	display: ${props=>props.ifshow ? 'block' : 'none'};
	&: after{
		content: '';
		border-width: 6px;
		border-style: solid;
		border-color: #555 transparent transparent transparent;
		position: absolute;
		top:100%;
		left: 50%;
		margin-left: -6px;
	}
`;

export default class Slider extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			left: 0, // 圆球距离滚动条左边的百分比距离
			draging: false, // 是否可拖动
			startLeft: 0, // 点击圆球时距离左边框距离
			parentWidth: 0, // 滑动条的总长度
			sliderLeft: 0, //滑动条左侧长度
			tooltip: 0, // tooltip值
		}
	}

	componentWillMount(){
		let {left, max} = this.props; 
		let d = left / max * 100;
		this.setState({
			left: d,
			tooltip: left
		});
	}

	// 阻止事件
	pauseEvent(e){
		if(e.stopPropagation) e.stopPropagation();
		if(e.preventDefault) e.preventDefault();
		return false;
	}
	// 阻止冒泡
	stopPropagation(e){
		if(e.stopPropagation) e.stopPropagation();
	}
	// 鼠标进入事件
	handleMouseDown(e){
		this.pauseEvent(e);
		let start = e.clientX || e.pageX, 
			pLength = e.target.parentNode.parentNode.offsetWidth,
			sliderLeft = e.target.parentNode.offsetWidth;
		this._isMounted && this.setState({
			draging: true,
			startLeft: start,
			parentWidth: pLength,
			sliderLeft: sliderLeft
		});
	}
	// 鼠标移动
	handleMouseMove(e){
		let {draging, startLeft, parentWidth, sliderLeft} = this.state;
		let {max, min, cb, id} = this.props;
		if(!draging) return;
		this.timer = setTimeout(()=>{
			this.timer = null;
			let	nowLeft = e.clientX, 
				offset = nowLeft-startLeft, 
				percent = ~~((sliderLeft+offset)*100/parentWidth);
			if(sliderLeft+offset <= 0){
				percent = 0;
			}else if(sliderLeft+offset >= parentWidth-9){
				percent = 100;
			}

			let d = ~~(percent * (max-min) / 100 + min);
			this._isMounted && this.setState({
				left: percent,
				tooltip: d
			});

			cb({[id] : d});
		}, 17);

	}

	// 鼠标松开
	handleMouseUp(e){
		this.timer && clearTimeout(this.timer);
		this._isMounted && this.setState({
			draging: false
		});
	}
	componentDidMount(){
		this._isMounted = true;
		document.addEventListener('mousemove', this.handleMouseMove.bind(this));
		document.addEventListener('mouseup', this.handleMouseUp.bind(this));
	}

	componentWillUnmount(){
		this.timer && clearTimeout(this.timer);
		this._isMounted = false;
	}
	// 点击滑动线上任意一点
	handleLineClick(e){
		this.stopPropagation(e);
		let {parentWidth} = this.state,
			{max, min, cb, id} = this.props,
			pw = parentWidth ? parentWidth : e.target.offsetWidth,
			clickLeft = e.clientX-this.n.getBoundingClientRect().x, 
			percent = parseInt(`${clickLeft*100/pw+0.5}`, 10);
		if(clickLeft <= 0 ){
			percent = 0;
		}
		if(clickLeft >= pw){
			percent = 100;
		}
		let d = ~~(percent * (max-min) / 100 + min);
		this.setState({
			left: percent,
			parentWidth: pw,
			tooltip: d
		});

		cb({[id] : d});
	}

	render(){
		let {left, draging, tooltip} = this.state;
		return(
			<Wrapper>
				<SliderLine innerRef={d=>this.n=d} onClick={ e=>this.handleLineClick(e)}>
					<SliderLeft left={left}>
						<SliderBall onMouseDown={e => this.handleMouseDown(e)}>
							<SliderToolTip ifshow={draging}>
								{
									tooltip
								}
							</SliderToolTip>
						</SliderBall>
					</SliderLeft>
				</SliderLine>
			</Wrapper>
		)
	}
}
