import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <Routes />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
