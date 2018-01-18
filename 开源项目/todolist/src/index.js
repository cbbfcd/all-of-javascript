/*
* @Author: 28906
* @Date:   2018-01-05 15:59:29
* @Last Modified by:   28906
* @Last Modified time: 2018-01-11 20:32:06
* @Description: '入口'
*/

import { h, app } from 'hyperapp';
import view from './views/index.js';
import actions from './actions/';
import state from './states/todos.js';

app(state, actions, view, document.body);
