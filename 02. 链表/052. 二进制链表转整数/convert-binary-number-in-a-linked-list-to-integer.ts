// ============================================================
// 052. 二进制链表转整数
// ============================================================
// LeetCode 1290. Convert Binary Number in a Linked List to Integer
// 给定一个单链表，每个节点存储一位二进制数（0 或 1），链表整体表示一个二进制数，
// 返回其十进制值。
// 时间复杂度：O(n)，空间复杂度：O(1)

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

// 方法1：数学运算 result = result * 2 + node.val
function getDecimalValue(head: ListNode | null): number {
  let result = 0;
  let cur = head;
  while (cur !== null) {
    result = result * 2 + cur.val;
    cur = cur.next;
  }
  return result;
}

// 方法2：位运算 result = (result << 1) | node.val
function getDecimalValueBit(head: ListNode | null): number {
  let result = 0;
  let cur = head;
  while (cur !== null) {
    result = (result << 1) | cur.val;
    cur = cur.next;
  }
  return result;
}

// 测试
(function test() {
  console.log(getDecimalValue(arrayToList([1, 0, 1]))); // 5
  console.log(getDecimalValue(arrayToList([0]))); // 0
  console.log(getDecimalValueBit(arrayToList([1, 0, 1]))); // 5
  console.log(getDecimalValueBit(arrayToList([1, 1, 1, 1, 1]))); // 31
})();

export {};
