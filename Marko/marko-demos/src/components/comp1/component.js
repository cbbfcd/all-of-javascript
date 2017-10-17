/*
* @Author: 28906
* @Date:   2017-10-12 15:43:41
* @Last Modified by:   28906
* @Last Modified time: 2017-10-12 15:44:17
* @Description: ''
*/

module.exports = class {
	onCreate(){
		this.state = {
			count: 1
		}
	}

	increment() {
		this.state.count++;
	}
}