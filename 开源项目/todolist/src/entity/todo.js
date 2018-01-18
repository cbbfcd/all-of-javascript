/*
* @Author: 28906
* @Date:   2018-01-06 01:01:44
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 17:29:36
* @Description: the todo pojo!
*/

class TODO {

	constructor(id, title, completed){
		this.id = id;
		this.title = title;
		this.completed = completed || false;
	}

	toggle(){
		this.completed = !completed;
	}

	setTitle(title){
		this.title = title;
	}

}

export default TODO;
