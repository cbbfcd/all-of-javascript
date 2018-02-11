import * as React from 'react';
import './App.css';
import Btn from './btn';
import { wavs } from './wavs';
const { ipcRenderer } = window.require('electron');

class Btns extends React.Component<any,any> {

  componentDidMount(){
    // 绑定原生事件
    let btns = document.querySelectorAll('.btn-s');
    for(let i: number = 0, btn :Element ; btn = btns[i++];){
      btn.addEventListener('click', () => {
      let wav = btn.attributes['data-wav'].value;
      let audio = new Audio(require(`${wav}`));
      audio.currentTime = 0;
      audio.play();
      })
    }
    // 监听全局键盘事件
    ipcRenderer.on('global-short', (event: any, param: number) => {
      let e = new MouseEvent('click');
      btns[param].dispatchEvent(e);
    })
  }

  render() {
    return (
      <section className="btns">
        {
          wavs.map( item => (
            <Btn 
              key={Math.random()}
              wav={item}
            />
          ))
        }
      </section>
    );
  }
}

export default Btns;