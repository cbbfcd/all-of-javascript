import * as React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
declare global {
  interface Window {
    require: any;
  }
}
// 进程之间通信
const remote = window.require('electron').remote;

class Header extends React.Component {
  handleClose(){
    remote.app.quit();
  }
  render() {
    return (
      <section className="header">
        <section className="header-setting">
          <a className="close" onClick={()=>{this.handleClose()}}/>
          <Link className="setting" to='/set' />
        </section>
        <section className="header-c1">
          <img src={require('./static/img/speaker.png')}/>
        </section>
        <h1>
          <img src={require('./static/img/logo.png')} />
        </h1>
      </section>
    );
  }
}

export default Header;
