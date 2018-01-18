/*
* @Author: 28906
* @Date:   2018-01-11 16:41:39
* @Last Modified by:   28906
* @Last Modified time: 2018-01-11 16:59:16
* @Description: pagenation component
*/


import { h } from 'hyperapp';
import picostyle from 'picostyle';
const style = picostyle(h);

// pagenation wrapper
const PaginationWrapper = style('section')({
	position: 'absolute',
	right: '5%',
	top: '40%',
})

// common style
const commonStyle = {
	display: 'block',
	borderLeft: '8px solid transparent',
	borderRight: '8px solid transparent',
	cursor: 'pointer',
	transition: 'all .4s ease-out',
	':hover': {
		transform: 'scale(1.3)'
	}
}

// mixin the common style
const UpPage = style('a')(Object.assign({
	marginBottom: '25px',
	borderTop: '8px solid transparent',
	borderBottom: '8px solid #F2A5A0',
}, commonStyle))

// mixin the common style
const DownPage = style('a')(Object.assign({
	borderTop: '8px solid #F2A5A0',
	borderBottom: '8px solid transparent',
}, commonStyle))

// view
const Pagination = () => (
	<PaginationWrapper>
		<UpPage/>
		<DownPage/>
	</PaginationWrapper>
)

export default Pagination;
