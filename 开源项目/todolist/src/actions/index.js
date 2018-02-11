/*
* @Author: 28906
* @Date:   2018-01-06 01:07:45
* @Last Modified by:   28906
* @Last Modified time: 2018-01-25 00:13:00
* @Description: actions, change the state must use actions!
*/
import store from '../utils/store.js';

const actions = {
	add: ( todo ) => state => ({todos: [...state.todos, todo]}),
	del: ( todo ) => state => (
		state.todos = state.todos.filter(item => item.id !== todo.id)
	),
	empty: () => state => (state.todos = []),
	completed: ( key ) => state =>{
		[...state.todos].map( item => {
			if(item.id === key){
				item.completed = true;
				store.update(key);
			}
		})
	},
	pushLocalStorageData: (arr) => state => {
		state.todos = [];
		return {todos: arr}
	},
	goPage: (pageNo=1, pageSize=5) => state => {
		let startPageNo = 1,
			offset = (pageNo-1)*pageSize,
			size = state.todos.length,
			pages = size / pageSize, 
			endPageNo= pages > ~~pages ? ~~pages + 1 : ~~pages;

		if(pageNo >= startPageNo && pageNo <= endPageNo){
			return (offset+pageSize) > size ?  state.todos.slice(offset, size) : state.todos.slice(offset, pageSize);
		}

	}
}

export default actions;