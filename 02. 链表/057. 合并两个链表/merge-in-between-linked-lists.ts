// ============================================================
// 057. 合并两个链表
// ============================================================
// LeetCode 1669. Merge In Between Linked Lists
// 给定 list1 和 list2，以及两个整数 a、b。删除 list1 中下标 [a, b] 的节点，
// 并将 list2 插入到该位置。返回结果链表头。
// 时间复杂度：O(n + m)，空间复杂度：O(1)

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

// 方法1：定位 a-1 和 b 节点，拼接 list2
function mergeInBetween(
  list1: ListNode | null,
  a: number,
  b: number,
  list2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0, list1);
  // 找到下标 a-1 的节点 preA
  let preA: ListNode = dummy;
  for (let i = 0; i < a; i++) {
    preA = preA.next!;
  }
  // 从 preA 继续走到下标 b 的节点 postB
  let postB: ListNode = preA;
  for (let i = a; i <= b; i++) {
    postB = postB.next!;
  }
  // 找到 list2 的尾节点
  let list2Tail: ListNode | null = list2;
  while (list2Tail !== null && list2Tail.next !== null) {
    list2Tail = list2Tail.next;
  }
  // 拼接：preA -> list2 -> postB.next
  preA.next = list2;
  list2Tail!.next = postB.next;
  return dummy.next;
}

// 测试
(function test() {
  console.log(
    listToArray(
      mergeInBetween(
        arrayToList([0, 1, 2, 3, 4, 5]),
        3,
        4,
        arrayToList([1000000, 1000001, 1000002])
      )
    )
  ); // [0,1,2,1000000,1000001,1000002,5]
  console.log(
    listToArray(
      mergeInBetween(
        arrayToList([0, 1, 2, 3, 4, 5, 6]),
        2,
        5,
        arrayToList([1000000, 1000001, 1000002, 1000003, 1000004])
      )
    )
  ); // [0,1,1000000,1000001,1000002,1000003,1000004,6]
})();

export {};
