/*
* @Author: 28906
* @Date:   2018-01-10 13:00:18
* @Last Modified by:   28906
* @Last Modified time: 2018-01-11 15:14:30
* @Description: add button component.
*/

import { h } from "hyperapp";
import picostyle from 'picostyle';
const style = picostyle(h);


const Add = style('a')({
	borderRadius: '50%',
	display: 'inline-block',
	padding: '20px',
	position: 'absolute',
	right: '0',
	top: '50%',
	transform: 'translateY(-50%)',
	transition: 'all .4s ease-out',
	cursor: 'pointer',
	'::before': {
		content: "''",
		position: 'absolute',
		display: 'block',
		width: '90%',
		height: '1px',
		left:'5%',
		backgroundColor: '#1966db',
	},
	'::after': {
		content: "''",
		position: 'absolute',
		display: 'block',
		width: '90%',
		height: '1px',
		transform:'rotate(-90deg)',
		marginLeft: '-45%',
		backgroundColor: '#1966db',
	},
	':hover': {
		backgroundColor: '#E3CBCD'
	}
})

export default Add;
