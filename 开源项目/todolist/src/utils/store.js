/*
* @Author: 28906
* @Date:   2018-01-16 16:55:16
* @Last Modified by:   28906
* @Last Modified time: 2018-01-21 00:02:07
* @Description: simple implements a localStorage
*/

const store = {};

if(window.localStorage){
	store.setItem = (k, v) => {
		if(typeof v === 'object'){
			localStorage.setItem(k, JSON.stringify(v));
		}else{
			localStorage.setItem(k, v);
		}
	}

	store.getItem = (k) => {
		return JSON.parse(localStorage.getItem(k));
	}

	store.forEach = (callback) => {
		for(let i = 0, len = localStorage.length; i < len; i++){
			callback(localStorage.getItem(localStorage.key(i)));
		}
	}

	store.clear = () => {
		localStorage.clear();
	}

	store.remove = (key) => {
		localStorage.removeItem(key);
	}

	store.update = (key) => {
		let temp = JSON.parse(localStorage.getItem(key));
		temp.completed = true;
		localStorage.setItem(key, JSON.stringify(temp));
	}
}

export default store;
