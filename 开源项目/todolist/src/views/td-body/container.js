/*
* @Author: 28906
* @Date:   2018-01-11 11:10:33
* @Last Modified by:   28906
* @Last Modified time: 2018-01-11 11:23:02
* @Description: td-body container view component
*/

import { h } from 'hyperapp';
import picostyle from 'picostyle';
const style = picostyle(h);

const TdWrapper = style('section')({
	width: '100%',
	height: '420px',
	position: 'absolute',
	backgroundColor: '#fff',
	top: '120px',
	borderRadius: '4px',
	boxShadow: '0 0 5px 3px #E3CBCD'
})

export default TdWrapper;
