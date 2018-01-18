/*
* @Author: 28906
* @Date:   2018-01-06 01:34:32
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 17:28:09
* @Description: wrapper view with css in js
*/
import { h } from "hyperapp";
import picostyle from 'picostyle';
const style = picostyle(h);

const Wrapper = style('section')({
	position: 'absolute',
	top: '10px',
	bottom: '10px',
	left: '10px',
	right: '10px',
	borderRadius: '1px solid transparent',
	backgroundColor: 'rgba(245,245,245,0.5)',
	boxShadow: '0px 0px 2px 3px rgba(0,0,0,0.2)',
	minWidth: '750px',
	overflow: 'hidden',
	"::before": {
		content: "'Todos'", // this is a bug! can not recognize the 'todos',but "'todos'"!
		fontSize: '50px',
		color: '#E3CBCD',
		position: 'absolute',
		left: '50%',
		transform: 'translateX(-50%)',
		top: '20px',
	}
})

export default Wrapper;