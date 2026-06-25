// ============================================================
// 007. 旋转链表
// ============================================================
// LeetCode 61. Rotate List
// 给你一个链表的头节点 head，旋转链表，将链表每个节点向右移动 k 个位置。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 节点定义
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
  const result: number[] = [];
  while (head) {
    result.push(head.val);
    head = head.next;
  }
  return result;
}

// 方法1：成环再断开（推荐）
// 先计算长度 n，k = k % n，将链表连成环后从新头前断开
function rotateRight(head: ListNode | null, k: number): ListNode | null {
  if (head === null || head.next === null || k === 0) {
    return head;
  }

  // 计算链表长度，同时找到尾节点
  let n = 1;
  let tail: ListNode = head;
  while (tail.next !== null) {
    n++;
    tail = tail.next;
  }

  // k 取模，避免重复旋转
  k = k % n;
  if (k === 0) return head;

  // 连成环
  tail.next = head;

  // 新的尾节点是倒数第 k+1 个节点，即正数第 n-k 个
  let newTail: ListNode = head;
  for (let i = 0; i < n - k - 1; i++) {
    newTail = newTail.next!;
  }

  // 新的头节点是新尾的下一个，断开环
  const newHead = newTail.next;
  newTail.next = null;

  return newHead;
}

// 方法2：双指针法
// 快指针先走 k 步，然后快慢同步移动，慢指针指向断开点
function rotateRight2(head: ListNode | null, k: number): ListNode | null {
  if (head === null || head.next === null || k === 0) {
    return head;
  }

  // 计算链表长度
  let n = 0;
  let cur: ListNode | null = head;
  while (cur !== null) {
    n++;
    cur = cur.next;
  }

  k = k % n;
  if (k === 0) return head;

  // 快指针先走 k 步
  let fast: ListNode = head;
  for (let i = 0; i < k; i++) {
    fast = fast.next!;
  }

  // 快慢指针同步移动，慢指针指向新尾
  let slow: ListNode = head;
  while (fast.next !== null) {
    fast = fast.next;
    slow = slow.next!;
  }

  // fast 是尾节点，slow.next 是新的头节点
  const newHead = slow.next;
  slow.next = null;
  fast.next = head;

  return newHead;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 007. 旋转链表 =====");
// [1,2,3,4,5], k=2 => [4,5,1,2,3]
console.log("结果:", listToArray(rotateRight(arrayToList([1, 2, 3, 4, 5]), 2)));
// [0,1,2], k=4 => [2,0,1]
console.log("结果:", listToArray(rotateRight(arrayToList([0, 1, 2]), 4)));
// [1,2,3], k=0 => [1,2,3]
console.log("结果:", listToArray(rotateRight(arrayToList([1, 2, 3]), 0)));

export {};
