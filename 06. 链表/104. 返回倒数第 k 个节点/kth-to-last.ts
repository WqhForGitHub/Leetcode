// ============================================================
// 104. 返回倒数第 k 个节点
// ============================================================
// 面试题 02.02. 返回倒数第 k 个节点
// 实现一种算法，找出单向链表中倒数第 k 个节点，返回该节点的值。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// 辅助函数：数组转链表
function arrayToList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode();
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

// ============================================================
// 方法一：快慢指针
// ============================================================
// 快指针先走 k 步，然后快慢指针同步移动，
// 快指针到达末尾（null）时，慢指针正好在倒数第 k 个节点。
function kthToLast(head: ListNode | null, k: number): number {
  let fast: ListNode | null = head;
  let slow: ListNode | null = head;

  // 快指针先走 k 步
  for (let i = 0; i < k; i++) {
    fast = fast!.next;
  }

  // 同步移动
  while (fast !== null) {
    fast = fast.next;
    slow = slow!.next;
  }

  return slow!.val;
}

// ============================================================
// 方法二：先求长度
// ============================================================
// 先遍历一遍求长度 n，再遍历到第 n - k 个节点。
function kthToLastByLength(head: ListNode | null, k: number): number {
  let n = 0;
  let cur = head;
  while (cur !== null) {
    n++;
    cur = cur.next;
  }
  cur = head;
  for (let i = 0; i < n - k; i++) {
    cur = cur!.next;
  }
  return cur!.val;
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  // 测试用例 1: [1,2,3,4,5], k=2 -> 4
  console.log("测试1（快慢指针）:", kthToLast(arrayToList([1, 2, 3, 4, 5]), 2)); // 4
  console.log("测试1（求长度）:", kthToLastByLength(arrayToList([1, 2, 3, 4, 5]), 2)); // 4

  // 测试用例 2: 单节点 [1], k=1 -> 1
  console.log("测试2:", kthToLast(arrayToList([1]), 1)); // 1

  // 测试用例 3: k 等于链表长度
  console.log("测试3:", kthToLast(arrayToList([1, 2, 3]), 3)); // 1
}

test();

export {};
