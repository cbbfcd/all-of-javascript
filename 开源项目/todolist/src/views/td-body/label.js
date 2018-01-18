/*
* @Author: 28906
* @Date:   2018-01-11 11:26:19
* @Last Modified by:   28906
* @Last Modified time: 2018-01-11 14:18:20
* @Description: label ciew component
*/

import { h } from 'hyperapp';
import picostyle from 'picostyle';
import todo_png from '../../icons/todo.png';
import done_png from '../../icons/completed.png';
const style = picostyle(h);

const ToDoLabelWrapper = style('a')({
	position:'absolute',
	left: '0px',
	width: '32px',
	fontSize: '20px',
	color: 'white',
	borderRadius: '0 5px 5px 0',
	padding: '8px',
	textAlign: 'right',
	textDecoration: 'none',
	transition: 'width .3s ease-out',
	cursor: 'pointer',
	top: '100px',
	backgroundColor: '#F4E69F',
	':hover': {
		width: '60px'
	}
})

const DoneLabelWrapper = style('a')({
	position:'absolute',
	left: '0px',
	width: '32px',
	fontSize: '20px',
	color: 'white',
	borderRadius: '0 5px 5px 0',
	padding: '8px',
	textAlign: 'right',
	textDecoration: 'none',
	transition: 'width .3s ease-out',
	cursor: 'pointer',
	top: '180px',
	backgroundColor: '#BDDBEE',
	':hover': {
		width: '60px'
	}
})

const TodoLabelImg = style('img')({
	width: '32px',
	height: '32px',
})

const DoneLabelImg = style('img')({
	width: '32px',
	height: '32px',
})

const Label = (state, actions) => (
	<section>
		<ToDoLabelWrapper>
			<TodoLabelImg src={ todo_png }/>
		</ToDoLabelWrapper>
		<DoneLabelWrapper>
			<DoneLabelImg src={ done_png }/>
		</DoneLabelWrapper>
	</section>
)

export default Label;