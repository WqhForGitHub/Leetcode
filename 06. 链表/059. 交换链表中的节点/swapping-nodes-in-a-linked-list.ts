// ============================================================
// 059. 交换链表中的节点
// ============================================================
// LeetCode 1721. Swapping Nodes in a Linked List
// 给定链表和整数 k，交换倒数第 k 个节点和正数第 k 个节点的值，返回链表头。
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

// 方法1：快慢指针。先找到正数第 k 个节点 first，
// 再用快慢指针找倒数第 k 个节点，交换它们的值。
function swapNodes(head: ListNode | null, k: number): ListNode | null {
  // 找正数第 k 个节点
  let first: ListNode | null = head;
  for (let i = 1; i < k; i++) {
    first = first!.next;
  }
  // 快指针从 first 出发，慢指针从头出发；
  // 快指针到末尾时，慢指针即倒数第 k 个节点
  let slow: ListNode | null = head;
  let fast: ListNode | null = first;
  while (fast!.next !== null) {
    slow = slow!.next;
    fast = fast!.next;
  }
  // 交换两个节点的值（不是节点本身）
  const tmp = first!.val;
  first!.val = slow!.val;
  slow!.val = tmp;
  return head;
}

// 测试
(function test() {
  console.log(listToArray(swapNodes(arrayToList([1, 2, 3, 4, 5]), 2))); // [1,4,3,2,5]
  console.log(listToArray(swapNodes(arrayToList([7, 9, 6, 6, 7, 8, 3, 0, 9, 5]), 5))); // [7,9,6,6,8,7,3,0,9,5]
  console.log(listToArray(swapNodes(arrayToList([1]), 1))); // [1]
  console.log(listToArray(swapNodes(arrayToList([1, 2]), 1))); // [2,1]
})();

export {};
