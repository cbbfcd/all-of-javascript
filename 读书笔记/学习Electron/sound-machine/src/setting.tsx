/* 设置界面 */
import * as React from 'react';
import "./App.css";
import {Link} from 'react-router-dom';
const fs = window.require('fs');
const ipcRenderer = window.require('electron').ipcRenderer;
interface CheckInput {
	inputEl: any;
}
interface Props {
	text: string;
	sets: string[];
}
// child component
class CheckInput extends React.Component<Props, any> {
	constructor(props: Props){
		super(props);
	}

	componentDidMount(){
		// 从配置文件中读取默认的初始化配置。
		let {sets, text} = this.props;
		sets.indexOf(text) !== -1 && (this.inputEl.checked = true);
	}

	handleClick(text: string){
		// 遍历获取check了的快捷键
		let nodes = this.inputEl.parentNode.parentNode.childNodes, arr: string[] = [];
		for(let i = 0, node; node = nodes[i++];){
			node.childNodes[0].checked ? arr.push(node.childNodes[0].attributes['data-ctrl'].value) : ''
		}
		let shortcuts = {
			data: arr
		}
		// 写入文件
		fs.writeFileSync('./setting.json', JSON.stringify(shortcuts));
		// 告诉主进程
		ipcRenderer.send('shortcuts-changed');
	}

	render(){
		let {text} = this.props;
		return(
			<li>
				<input 
					data-ctrl={text} 
					onClick={()=>this.handleClick(text)} 
					type="checkbox" 
					id={`${text}`} 
					ref={input => this.inputEl = input}
				/>
				<label htmlFor={`${text}`}>{text}</label>
			</li>
		)
	}
}

// setting component
class Setting extends React.Component<any, any> {
	constructor(props: any){
		super(props)
		this.state = {
			data: ['CommandOrControl', 'Shift', 'Alt'],
			sets: []
		}
	}

	componentWillMount(){
		let file = JSON.parse(fs.readFileSync('./setting.json', 'utf-8'));
		this.setState({
			sets: file.data
		})
	}

	render() {
		let { data,sets } = this.state;
		return (
			<section className="setting-page">
				<section className="setting-header">
					<a>Settings</a>
					<Link className="setting-header-link" to='/'/>
				</section>
				<section className="setting-content">
					<p>Modifier keys for global shortcuts</p>
					<ul>
					  {
					  	data.map((item: string) => <CheckInput text={item} key={Math.random()} sets={sets}/>
					  )}
					</ul>
				</section>
			</section>
		)
	}
}


export default Setting;