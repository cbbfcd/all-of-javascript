/*
* @Author: 28906
* @Date:   2018-01-11 15:16:11
* @Last Modified by:   28906
* @Last Modified time: 2018-01-11 21:43:49
* @Description: todo content warpper component
*/

import { h } from 'hyperapp';
import picostyle from 'picostyle';
import ContentList from './contentbody.js';
const style = picostyle(h);


const Content = style('section')({
	position: 'absolute',
	left:'100px',
	right: '5px',
	top: '5px',
	bottom: '5px',
	backgroundColor: 'rgba(245,245,245,0.5)',
})

const Title = style('h3')({
	textAlign: 'center',
	color: '#E3CBCD',
	fontSize: '24px',
})


const ContentWrapper = ({state,actions}) => (
	<Content>
		<Title>todo list</Title>
		<ContentList state= {state} actions={actions}/>
	</Content>
)

export default ContentWrapper;
