/*
* @Author: 28906
* @Date:   2018-01-11 11:05:52
* @Last Modified by:   28906
* @Last Modified time: 2018-01-24 00:13:06
* @Description: todo view body
*/

import { h } from 'hyperapp';
import TdWrapper from './container.js';
import Label from './label.js';
import ContentWrapper from './content.js';
import store from '../../utils/store.js';

// get todos from web storage
const handleLocalStorageTodos = (state,actions) => {
	actions.empty();
	store.forEach( item => {
		actions.add(JSON.parse(item));
	})
}
const TdBody = ({state,actions}) => (
	<TdWrapper oncreate = { e => handleLocalStorageTodos(state,actions)}>
		<Label />
		<ContentWrapper state={state} actions={actions}/>
	</TdWrapper>
)

export default TdBody;
