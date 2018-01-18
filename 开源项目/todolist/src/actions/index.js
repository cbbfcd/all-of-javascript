/*
* @Author: 28906
* @Date:   2018-01-06 01:07:45
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 17:29:00
* @Description: actions, change the state must use actions!
*/
const actions = {
	add: ( todo ) => state => (
		state.todos.push( todo )
	),
	del: ( todo ) => state => (
		state.todos = state.todos.filter(item => item.id !== todo.id)
	)
}

export default actions;