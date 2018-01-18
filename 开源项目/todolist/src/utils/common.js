/*
* @Author: 28906
* @Date:   2018-01-16 19:02:55
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 19:05:11
* @Description: common style obj
*/


// common obj style with css in js
const common = {};

common['del'] = {
	width: '20px',
	height: '20px',
	borderRadius: '50%',
	border: '1px solid #E3CBCD',
	transition: 'all .4s ease-out',
	cursor: 'pointer',
	'::before': {
		content: "''",
		position: 'absolute',
		width: '90%',
		height: '1px',
		left: '5%',
		top: '50%',
		transform: 'translateY(-50%) rotate(45deg)',
		display: 'block',
		backgroundColor: '#E3CBCD',
	},
	'::after': {
		content: "''",
		position: 'absolute',
		width: '90%',
		height: '1px',
		left: '5%',
		top: '50%',
		transform: 'translateY(-50%) rotate(-45deg)',
		display: 'block',
		backgroundColor: '#E3CBCD',
	},
	':hover': {
		transform: 'scale(1.3)',
		'-webkit-transform':'scale(1.3)',
	}
}

export default common;
