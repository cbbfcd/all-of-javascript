/*
* @Author: huangteng
* @Date:   2018-02-27 17:23:30
* @Last Modified by:   huangteng
* @Last Modified time: 2018-02-27 17:31:58
* @Description: ''
*/

export const requestAnimFrame = () => (
    window.requestAnimationFrame       || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function(/* function */ callback){
        window.setTimeout(callback, 1000 / 60);
    }
);

export const cancelAnimFrame = () => (
	window.cancelAnimationFrame || 
	window.webkitCancelAnimationFrame || 
	window.mozCancelAnimationFrame || 
	function (callback) {
        window.clearTimeout(callback);
    }
);