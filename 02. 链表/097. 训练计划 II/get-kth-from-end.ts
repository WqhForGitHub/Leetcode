// ============================================================
// 097. 训练计划 II
// ============================================================
// 剑指 Offer 22. 链表中倒数第k个节点
// 输入一个链表，输出该链表中倒数第k个节点。
// 快慢指针：快指针先走 k 步，然后快慢指针同步移动，
// 当快指针到达末尾时，慢指针正好指向倒数第 k 个节点。
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

// ============================================================
// 方法一：快慢指针（一次遍历）
// ============================================================
// 快指针先走 k 步，然后快慢指针同步前进，
// 快指针走到 null 时，慢指针恰好位于倒数第 k 个节点。
function getKthFromEnd(head: ListNode | null, k: number): ListNode | null {
  let fast: ListNode | null = head;
  let slow: ListNode | null = head;

  // 快指针先走 k 步
  for (let i = 0; i < k; i++) {
    if (fast === null) return null; // k 大于链表长度
    fast = fast.next;
  }

  // 快慢指针同步移动
  while (fast !== null) {
    fast = fast.next;
    slow = slow!.next;
  }

  return slow;
}

// ============================================================
// 方法二：先求长度再定位
// ============================================================
// 先遍历一遍求出链表长度 n，倒数第 k 个即正数第 n - k 个。
function getKthFromEndByLength(head: ListNode | null, k: number): ListNode | null {
  let n = 0;
  let cur = head;
  while (cur !== null) {
    n++;
    cur = cur.next;
  }
  // 倒数第 k 个 = 正数第 n - k 个（从 0 开始计数）
  cur = head;
  for (let i = 0; i < n - k; i++) {
    cur = cur!.next;
  }
  return cur;
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  // 测试用例 1: [1,2,3,4,5], k=2 -> 返回节点 4
  const list1 = arrayToList([1, 2, 3, 4, 5]);
  const res1 = getKthFromEnd(list1, 2);
  console.log("测试1（快慢指针）:", res1 ? listToArray(res1) : null); // [4, 5]
  const res1b = getKthFromEndByLength(arrayToList([1, 2, 3, 4, 5]), 2);
  console.log("测试1（求长度）:", res1b ? listToArray(res1b) : null); // [4, 5]

  // 测试用例 2: [1], k=1 -> 返回节点 1
  const res2 = getKthFromEnd(arrayToList([1]), 1);
  console.log("测试2:", res2 ? listToArray(res2) : null); // [1]

  // 测试用例 3: k 等于链表长度
  const res3 = getKthFromEnd(arrayToList([1, 2, 3]), 3);
  console.log("测试3:", res3 ? listToArray(res3) : null); // [1, 2, 3]
}

test();

export {};
