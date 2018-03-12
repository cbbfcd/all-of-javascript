import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
// demo1
import RouteDemo from './example/route-demo/';
// demo2
//import SwitchDemo from './example/switch-demo/';

ReactDOM.render(<RouteDemo />, document.getElementById('root'));
registerServiceWorker();
