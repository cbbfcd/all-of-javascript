
// 要求：
// 给你一个数组，如：[2,3,5,7] 和一个 target: 8
// 你得返回数组中和为target的数字对应下标组成的数组 [1,2]


/**
 * 第一个实现版本  结果：Your runtime beats 30.64 % of javascript submissions
 * 有一些 bug。
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target){
	for(var i = 0, len = nums.length; i < len; i++ ){
        var start = target - nums[i];
        if((nums.indexOf(start) !== -1) && nums.indexOf(start) !== i){
            return [i, nums.indexOf(start)]
        }
    }
}


// 第二种：加了缓存的写法，更好的实现！
// Your runtime beats 92.40 % of javascript submissions
var twoSum2 = function(nums, target) {
    var map = {}, res = [];
    for(var i = 0, len = nums.length; i < len; i++){
        if(typeof (map[target- nums[i]]) !== 'undefined'){
           res.push(map[target-nums[i]]);
           res.push(i)
        }
        map[nums[i]] = i;
    }
    return res;
};