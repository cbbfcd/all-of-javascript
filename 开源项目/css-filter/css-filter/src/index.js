
import React from 'react';
import ReactDOM from 'react-dom';
import FilterWrapper from './RootApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<FilterWrapper />, document.getElementById('root'));
registerServiceWorker();