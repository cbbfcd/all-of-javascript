/*
* @Author: 28906
* @Date:   2018-01-11 11:05:52
* @Last Modified by:   28906
* @Last Modified time: 2018-01-11 21:43:32
* @Description: todo view body
*/

import { h } from 'hyperapp';
import TdWrapper from './container.js';
import Label from './label.js';
import ContentWrapper from './content.js';


const TdBody = ({state,actions}) => (
	<TdWrapper>
		<Label />
		<ContentWrapper state={state} actions={actions}/>
	</TdWrapper>
)

export default TdBody;
