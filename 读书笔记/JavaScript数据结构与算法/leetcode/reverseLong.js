// 参数是一个 number 。然后返回其反转值，但是如果超过 int32 范围，返回0
// 比如： 123  ->  321
// -123 -> -321
// 120 -> 21

function reverse(x){
	var map = {}, MAX = Math.pow(2,31)-1, res = 0, n = x;
	if(map[n]) return map[n];
	while(x !==0 ){
		res = res * 10 + x % 10;
		x = (x/10) | 0;
	}

	return map[n] = (n > MAX || n < -MAX) ? 0 : res; 
}