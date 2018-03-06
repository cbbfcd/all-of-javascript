/*
* @Author: huangteng
* @Date:   2018-02-28 19:33:01
* @Last Modified by:   huangteng
* @Last Modified time: 2018-03-02 14:54:08
* @Description: 含文本的slider
*/

import React from 'react';
import Slider from './slider';
import styled from 'styled-components';

const BoxContainer = styled.div`
	width: 85%;
	height: 50px;
	position: relative;
	margin: 0 auto;
	top: 30px;
`;

const TextLayout = styled.div`
	width: 80px;
	height: 40px;
	position: absolute;
	top: 0;
	left: 0;
	text-align: center;
	line-height: 40px;
	color: #8C9493;
	font-size: 14px;
`;

const SliderLayout = styled.div`
	width: calc(100% - 80px);
	height: 40px;
	position: absolute;
	top: 0;
	left: 80px;
`;

export const SliderBox = ({text, min, max, cb, id, left}) => (
	<BoxContainer>
		<TextLayout>
			{text}
		</TextLayout>
		<SliderLayout>
			<Slider
				min={min}
				max={max}
				cb={cb}
				id={id}
				left={left}
			/>
		</SliderLayout>
	</BoxContainer>
)
