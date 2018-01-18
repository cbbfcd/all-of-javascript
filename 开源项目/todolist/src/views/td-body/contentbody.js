/*
* @Author: 28906
* @Date:   2018-01-11 15:29:53
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 19:07:19
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
	position: 'relative'
}, common['del']))

// delete todo item
const delItem = (item,state,actions) => {
	actions.del(item);
	store.remove( item.id );
}

const ContentList = ({state,actions}) => (
	<ContentBody>
		<ul>
			{
				state.todos.map( item => (
					<ContentListItem key={`${item.id}`}>
						<span>{ item.title }</span>
						<ContentDeleteLabel onclick={() => delItem(item,state,actions)}/>
					</ContentListItem>
				))
			}
		</ul>
		<Pagination />
	</ContentBody>
)

export default ContentList;