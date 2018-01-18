/*
* @Author: 28906
* @Date:   2018-01-16 16:55:16
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 17:20:49
* @Description: simple implements a localStorage
*/

const store = {};

if(window.localStorage){
	store.setItem = (k, v) => {
		if(typeof v === 'object'){
			localStorage.setItem(k, JSON.stringify(v));
		}
		localStorage.setItem(k, v);
	}

	store.getItem = (k) => {
		return JSON.parse(localStorage.getItem(k));
	}

	store.forEach = (callback) => {
		for(let i = 0, len = localStorage.length; i < len; i++){
			return callback(localStorage.key(i));
		}
	}

	store.clear = () => {
		localStorage.clear();
	}

	store.remove = (key) => {
		localStorage.removeItem(key);
	}
}

export default store;
