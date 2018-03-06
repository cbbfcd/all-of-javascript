/*
* @Author: huangteng
* @Date:   2018-02-26 17:59:08
* @Last Modified by:   huangteng
* @Last Modified time: 2018-03-02 17:40:51
* @Description: css3实现滤镜效果demo
*/

import React from 'react';
import styled from 'styled-components';
import {SliderBox} from './sliderbox';
import ImgUploader from './upload';

const Layout = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	&:after{
		content: 'Filter';
		color: #DC99A1;
		font-size: 30px;
		position:absolute;
		left: 50%;
		top: 20px;
		transform: translateX(-50%);
	}
`;

// 容器
const Container = styled.div`
	position: absolute;
	top: 60px;
	bottom: 10px;
	left: 10px;
	right: 10px;
	outline:#f5f5f5 solid 1px;
	box-shadow: -5px 5px 3px #f8f8f8;
	overflow: hidden;
`;

const ImgLayout = styled.div`
	width: 50%;
	height: 100%;
	box-sizing: border-box;
	border-right: 1px solid #f9f9f9;
	position: absolute;
	top: 0;
	left: 0;
`;

const FilterLayout = styled.div`
	width: 50%;
	height: 100%;
	box-sizing: border-box;
	position: absolute;
	left: 50%;
	display: flex;
	flex-flow: column;
	justify-content: space-between;
	overflow: auto;
`;


export default class FilterWrapper extends React.Component {
	state = {
		data : [
			{
				id: 'blur',
				text: '模糊',
				min: 0,
				max: 20,
				left: 0
			},
			{
				id: 'brightness',
				text: '亮度',
				min: 0,
				max: 200,
				left: 100
			},
			{
				id: 'contrast',
				text: '对比度',
				min: 0,
				max: 600,
				left: 100
			},
			{
				id: 'grayscale',
				text: '灰度',
				min: 0,
				max: 100,
				left: 0
			},
			{
				id: 'hue',
				text: '色相旋转',
				min: 0,
				max: 360,
				left: 0
			},
			{
				id: 'invert',
				text: '反转度',
				min: 0,
				max: 100,
				left: 0
			},
			{
				id: 'opacity',
				text: '透明度',
				min: 0,
				max: 100,
				left: 100
			},
			{
				id: 'saturate',
				text: '饱和度',
				min: 0,
				max: 1000,
				left: 100
			},
			{
				id: 'sepia',
				text: '褐色度',
				min: 0,
				max: 100,
				left: 0
			}
		],
		params: {
			blur: 0,
			brightness: 100,
			contrast: 100,
			grayscale: 0,
			hue: 0,
			invert: 0,
			opacity: 100,
			saturate: 100,
			sepia: 0
		}
	}

	getFilterParams = (data) => {
		this.setState((prev, props) => ({params: Object.assign(prev.params, data)}));
	}
	
	render(){
		let {data, params} = this.state;
		return(
			<Layout>
				<Container>
					<ImgLayout>
						<ImgUploader data={params}/>
					</ImgLayout>
					<FilterLayout>
						{
							data.map(item=><SliderBox {...item} key={item.id} cb={this.getFilterParams}/>)
						}
					</FilterLayout>
				</Container>
			</Layout>
		)
	}
}


