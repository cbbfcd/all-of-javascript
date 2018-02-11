import * as React from 'react';
import './App.css';
import Header from './header';
import Btns from './btns';
//const ipcRenderer = window.require('electron').ipcRenderer;

class App extends React.Component<any, any> {
  // componentWillMount(){
  // 	ipcRenderer.send('put-in-tray');
  // }
  render() {
    return (
      <div className="App">
        <Header />
        <Btns />
      </div>
    );
  }
}

export default App;
