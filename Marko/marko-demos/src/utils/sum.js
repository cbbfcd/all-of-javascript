/*
* @Author: 28906
* @Date:   2017-10-12 09:52:20
* @Last Modified by:   28906
* @Last Modified time: 2017-10-12 10:07:13
*/

class SumUtils{
	sum(...args){
		//let args = Array.prototype.slice.apply(arguments);
		return args.reduce((sum,nextVal)=>{
			return sum + nextVal;
		},0)
	}
}

export default new SumUtils()