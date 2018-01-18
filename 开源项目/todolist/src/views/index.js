/*
* @Author: 28906
* @Date:   2018-01-06 01:33:37
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 19:29:14
* @Description: entry view wrapper
*/

import { h, app } from 'hyperapp';
import picostyle from 'picostyle';
import Wrapper from './wrapper.js';
import TodoHeader from './td-header/';
import TdBody from './td-body/';
import store from '../utils/store.js';


const style = picostyle(h);

const Container = style('section')({
	position: 'absolute',
	top: '90px',
	width: '70%',
	left: '50%',
	transform: 'translateX(-50%)',
	padding: '20px',
})

// get todos from web storage
const handleLocalStorageTodos = (state) => {
	
}

const view = ( state, actions ) => (
	<Wrapper>
		<Container
			oncreate = { e => handleLocalStorageTodos(state)}
		>
			<TodoHeader 
				state={state} 
				actions={actions}
			/>
			<TdBody 
				state={state} 
				actions={actions} 
			/>
		</Container>
	</Wrapper>
)

export default view;