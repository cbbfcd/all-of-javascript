/*
* @Author: 28906
* @Date:   2018-01-11 15:29:53
* @Last Modified by:   28906
* @Last Modified time: 2018-01-21 00:34:23
* @Description: content body component
*/

import { h } from 'hyperapp';
import picostyle from 'picostyle';
import Pagination from './pagination.js';
import store from '../../utils/store.js';
import common from '../../utils/common.js';
const style = picostyle(h);

const ContentBody = style('section')({
	position: 'absolute',
	top: '80px',
	width: '100%',
	bottom: '0',
})



const ContentListItem = style('li')({
	position: 'relative',
	listStyleType: 'none',
	padding: '16px',
	width: '80%',
	color: '#555',
	border: '1px solid #E3CBCD',
	borderRadius: '4px',
	marginTop: '5px',
})


const ContentDeleteLabel = style('a')(Object.assign({
	display: 'inline-block',
	float: 'right',
	position: 'relative',
}, common['del']))

const CompletedLabel = style('a')({
	display: 'inline-block',
	float: 'right',
	position: 'relative',
	width: '20px',
	height: '20px',
	borderRadius: '50%',
	border: '1px solid #E3CBCD',
	transition: 'all .4s ease-out',
	cursor: 'pointer',
	margin: '0 0 0 10px',
	'::before': {
		content: "''",
		position: 'absolute',
		width: '40%',
		height: '70%',
		left: '50%',
		borderBottom: '1px solid #E3CBCD',
		borderRight: '1px solid #E3CBCD',
		top: '0',
		transform: 'translateX(-50%) rotate(45deg)',
		display: 'block',
		backgroundColor: '#fff',
	},
	':hover': {
		transform: 'scale(1.3)',
		'-webkit-transform':'scale(1.3)',
	}
})

// delete todo item
const delItem = (item,state,actions) => {
	actions.del(item);
	store.remove( item.id );
}

// completed item
const completedItem = (item, state, actions) => {
	actions.completed( item.id );
}

const ContentList = ({state,actions}) => (
	<ContentBody>
		<ul>
			{
				state.todos.map( item => (
					<ContentListItem key={ item.id }>
						<span>{ item.title }</span>
						<CompletedLabel onclick={()=>completedItem(item,state,actions)}/>
						<ContentDeleteLabel onclick={() => delItem(item,state,actions)}/>
					</ContentListItem>
				))
			}
		</ul>
		<Pagination />
	</ContentBody>
)

export default ContentList;