/*
* @Author: 28906
* @Date:   2018-01-10 12:57:03
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 18:32:21
* @Description: input view 
*/

import { h } from "hyperapp";
import picostyle from 'picostyle';
const style = picostyle(h);

const Input = style('input')({
	width: '80%',
	padding: '16px',
	border: '1px solid #eee',
	borderRadius: '4px',
	backgroundColor: '#fff',
	boxShadow: '0px 3px 3px 0px rgba(0,0,0,.5)',
	fontSize: '24px',
	transition: 'width .5s ease-out',
	'::-webkit-input-placeholder': {  /* WebKit browsers */
		color: '#E3CBCD'
	},
	// ':-moz-placeholder': { /* Mozilla Firefox 4 to 18 */
	// 	color: '#E3CBCD',
	// 	opacity: '1'
	// },
	// '::-moz-placeholder': { /* Mozilla Firefox 19+ */
	// 	color: '#E3CBCD',
	// 	opacity: '1'
	// },
	// ':-ms-input-placeholder': { /* Internet Explorer 10+ */
	// 	color: '#E3CBCD'
	// },
	':focus': {
		outline: 'none', /*no chrome focus!*/
		boxShadow: '0 0 10px #909',
		width: '88%'
	}
})

export default Input;