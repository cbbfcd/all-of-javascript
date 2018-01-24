/*
* @Author: 28906
* @Date:   2018-01-06 01:07:45
* @Last Modified by:   28906
* @Last Modified time: 2018-01-24 00:23:09
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
	}
}

export default actions;