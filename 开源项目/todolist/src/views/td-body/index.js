/*
* @Author: 28906
* @Date:   2018-01-11 11:05:52
* @Last Modified by:   28906
* @Last Modified time: 2018-01-24 23:26:05
* @Description: todo view body
*/

import { h } from 'hyperapp';
import TdWrapper from './container.js';
import Label from './label.js';
import ContentWrapper from './content.js';
import store from '../../utils/store.js';

// get todos from web storage
const handleLocalStorageTodos = (state,actions) => {
	let arr = [];
	store.forEach( item => {
		arr.push(JSON.parse(item))
	})
	actions.pushLocalStorageData(arr);
}
const TdBody = ({state,actions}) => (
	<TdWrapper oncreate = { e => handleLocalStorageTodos(state,actions)}>
		<Label />
		<ContentWrapper state={state} actions={actions}/>
	</TdWrapper>
)

export default TdBody;
