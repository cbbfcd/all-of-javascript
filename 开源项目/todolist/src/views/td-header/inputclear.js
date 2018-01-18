/*
* @Author: 28906
* @Date:   2018-01-16 18:58:15
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 19:09:25
* @Description: input clear view component
*/

import { h } from 'hyperapp';
import picostyle from 'picostyle';
import common from '../../utils/common.js';
const style = picostyle(h);

const InputClear = style('a')(Object.assign({
	display: 'none',
	position: 'absolute',
	top: '50%',
	marginTop: '-10px',
	left: '78%',
}, common['del']))

export default InputClear;
