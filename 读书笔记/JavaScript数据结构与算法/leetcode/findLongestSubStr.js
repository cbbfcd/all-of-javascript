// 返回给定字符串最长的不含重复项的子字符串的长度
// 比如： 'abcabcbb' --> 最长不重复子串是 'abc' 长度 3
//        'bbbbbbb' --> 最长不重复子串是 'b' 长度 1
//        'pwwkew' --> 最长不重复子串是 'wke' 长度 3



// 此乃一大牛作品
var findLongestSubStr = str => {
	const map = {};
	var left = 0;
	return str.split('').reduce((max,v,i)=>{
		left = map[v] >= left ? map[v]+1 : left;
		map[v] = i;
		return Math.max(max, i-left+1)
	},0)
}