// ============================================================
// 055. 删除链表 M 个节点之后的 N 个节点
// ============================================================
// LeetCode 1474. Delete N Nodes After M Nodes of a Linked List
// 给定链表，遍历时保留 M 个节点，删除其后 N 个节点，重复直至链表末尾。
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

// 方法1：遍历，跳过 m 个，删除 n 个，循环至末尾
function deleteNodes(head: ListNode | null, m: number, n: number): ListNode | null {
  let cur = head;
  let prev: ListNode | null = null;
  while (cur !== null) {
    // 保留 m 个节点
    let mCount = m;
    while (cur !== null && mCount > 0) {
      prev = cur;
      cur = cur.next;
      mCount--;
    }
    // 删除 n 个节点
    let nCount = n;
    while (cur !== null && nCount > 0) {
      cur = cur.next;
      nCount--;
    }
    // 将保留段的最后一个节点连到删除段之后的节点
    if (prev !== null) {
      prev.next = cur;
    }
  }
  return head;
}

// 测试
(function test() {
  console.log(
    listToArray(deleteNodes(arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]), 2, 3))
  ); // [1,2,6,7,11,12]
  console.log(listToArray(deleteNodes(arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]), 1, 3))); // [1,5,9]
})();

export {};
