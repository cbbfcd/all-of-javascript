/*
* @Author: 28906
* @Date:   2018-01-10 09:55:44
* @Last Modified by:   28906
* @Last Modified time: 2018-01-24 23:18:50
* @Description: todo view
*/
import { h } from "hyperapp";
import Input from './input.js';
import InputClear from './inputclear.js';
import Add from './add.js';
import TODO from '../../entity/todo.js';
import uuid from '../../utils/uuid.js';
import store from '../../utils/store.js';

// input
const userInput = (e, actions) => {
	let keyCode = null;
	keyCode = e.which ? e.which : e.keyCode;
	if(keyCode === 13){
		let val = e.target.value || '', key = uuid();
		if (val === '') return;
		let todo = new TODO(key, val, false);
		store.setItem(key, todo);
		actions.add(todo);
	}
	e.stopPropagation();
}

// click
const userClick = (e, actions) => {
	let val = document.querySelector('#user-input').value || '', key = uuid();
	if(val === '') return;
	let todo = new TODO(key, val, false);
	store.setItem(key, todo);
	actions.add(todo);
	e.stopPropagation();
}

// handle input clear
const handleInputClear = (e) => {
	document.querySelector('#user-input').value = '';
	e.target.style.display = 'none';
}

const TodoHeader = ({state, actions}) => (
	<section>
		<Input 
			placeholder = { state.text } 
			onkeypress={ e => userInput(e, actions) }
			id = 'user-input'
			onchange = { e => {
				if(e.target.value !== ''){
					e.target.nextElementSibling.style.display = 'block';
				}else{
					e.target.nextElementSibling.style.display = 'none';
				}
			}}
		/>
		<InputClear 
			onclick = { e => handleInputClear(e)}
		/>
		<Add onclick={ e => userClick(e, actions)}/>
	</section>
)

export default TodoHeader;
