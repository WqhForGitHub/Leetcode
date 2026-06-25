// ============================================================
// 049. 从链表中删去总和值为零的连续节点
// ============================================================
// LeetCode 1171. Remove Zero Sum Consecutive Nodes from Linked List
// 给定链表头节点，反复删除链表中总和值为 0 的连续节点序列，直到不存在这样的序列。
// 返回结果链表头节点。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 辅助函数：数组转链表
function arrayToList(arr: number[]): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

// 辅助函数：链表转数组
function listToArray(head: ListNode | null): number[] {
  const res: number[] = [];
  let cur = head;
  while (cur !== null) {
    res.push(cur.val);
    cur = cur.next;
  }
  return res;
}

// 方法1：前缀和 + 哈希表（两次遍历）
// 思路：若两个位置的前缀和相等，则它们之间的连续节点和为 0。
// 第一次遍历记录每个前缀和最后出现的节点；第二次遍历利用哈希表跳过和为 0 的段。
function removeZeroSumSublists(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0, head);
  const prefixSumMap = new Map<number, ListNode>();
  let sum = 0;
  // 第一次遍历：记录每个前缀和对应的最后出现的节点
  for (let cur: ListNode | null = dummy; cur !== null; cur = cur.next) {
    sum += cur.val;
    prefixSumMap.set(sum, cur);
  }
  // 第二次遍历：相同前缀和说明中间段和为 0，直接跳过
  sum = 0;
  for (let cur: ListNode | null = dummy; cur !== null; cur = cur.next) {
    sum += cur.val;
    const nextNode = prefixSumMap.get(sum)!;
    cur.next = nextNode.next;
  }
  return dummy.next;
}

// 测试
(function test() {
  console.log(listToArray(removeZeroSumSublists(arrayToList([1, 2, -3, 3, 1])))); // [3,1]
  console.log(listToArray(removeZeroSumSublists(arrayToList([1, 2, 3, -3, 4])))); // [1,2,4]
  console.log(listToArray(removeZeroSumSublists(arrayToList([1, 2, 3, -3, -2])))); // [1]
  console.log(listToArray(removeZeroSumSublists(arrayToList([0, 0, 0])))); // []
})();

export {};
