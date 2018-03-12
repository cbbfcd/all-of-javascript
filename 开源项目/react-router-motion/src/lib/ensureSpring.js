/*
* @Author: huangteng
* @Date:   2018-03-11 22:09:43
* @Last Modified by:   huangteng
* @Last Modified time: 2018-03-11 22:11:13
* @Description: ''
*/
import {spring} from 'react-motion';

export const ensureSpring = (styles) => {
	return Object.keys(styles).reduce((acc, key)=>{
		const val = styles[key];
		acc[key] = typeof val === 'number' ? spring(val) : val;
		return acc;
	}, {})
}