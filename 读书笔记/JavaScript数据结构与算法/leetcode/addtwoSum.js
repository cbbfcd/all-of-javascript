// Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
// Output: 7 -> 0 -> 8
// Explanation: 342 + 465 = 807.

// 意思是输入两个非空链表，然后输出一个经过计算的链表。对应的计算方式如上


/**
 * Definition for singly-linked list.
 * 定义这个链表的过程已经实现了，不用写。
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

 // Your runtime beats 95.17 % of javascript submissions
var addTwoNumbers = function(l1, l2) {
    var list = new ListNode(0), head = list, sum = 0, curry = 0;
    
    while(l1 !== null || l2 !== null || sum > 0){
        if(l1 !== null){
            sum += l1.val;
            l1 = l1.next;
        }
        
        if(l2 !== null){
            sum += l2.val;
            l2 = l2.next;
        }
        
        if(sum >= 10){
            curry = 1;
            sum -= 10;
        }
        
        head.next = new ListNode(sum);
        head = head.next;
        sum = curry;
        curry = 0;
    }
    
    return list.next;
};