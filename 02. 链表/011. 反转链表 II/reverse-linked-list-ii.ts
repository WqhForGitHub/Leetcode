// ============================================================
// 011. 反转链表 II
// ============================================================
// LeetCode 92. Reverse Linked List II
// 给你单链表的头指针 head 和两个整数 left 和 right，其中 left <= right。
// 请反转从位置 left 到位置 right 的链表节点，返回反转后的链表。
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

// 方法1：头插法（推荐）
// 找到 left 前一个节点，然后用头插法逐个反转 [left, right] 区间
function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev = dummy; // 指向 left 的前一个节点

  // 移动到 left 的前一个节点
  for (let i = 0; i < left - 1; i++) {
    prev = prev.next!;
  }

  // cur 指向 left 位置的节点
  const cur = prev.next!;

  // 头插法：将 [left+1, right] 的节点逐个插到 prev 之后
  for (let i = 0; i < right - left; i++) {
    const nextNode = cur.next!; // 待移动的节点
    cur.next = nextNode.next; // cur 跳过 nextNode
    nextNode.next = prev.next; // nextNode 指向当前区间的头
    prev.next = nextNode; // prev 指向新的区间头
  }

  return dummy.next;
}

// 方法2：反转后拼接
// 找到需要反转的区间，断开后反转，再重新连接
function reverseBetween2(head: ListNode | null, left: number, right: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev = dummy;

  // 移动到 left 的前一个节点
  for (let i = 0; i < left - 1; i++) {
    prev = prev.next!;
  }

  // 移动到 right 位置的节点
  let rightNode = prev;
  for (let i = 0; i < right - left + 1; i++) {
    rightNode = rightNode.next!;
  }

  const leftNode = prev.next; // 区间头
  const succ = rightNode.next; // 区间后继

  // 断开区间，准备反转
  rightNode.next = null;

  // 反转 [leftNode, rightNode]
  prev.next = reverseList(leftNode);

  // 反转后 leftNode 变成尾，连接后继
  leftNode!.next = succ;

  return dummy.next;
}

// 反转整个链表
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let cur: ListNode | null = head;
  while (cur !== null) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 011. 反转链表 II =====");
// [1,2,3,4,5], left=2, right=4 => [1,4,3,2,5]
console.log("结果:", listToArray(reverseBetween(arrayToList([1, 2, 3, 4, 5]), 2, 4)));
// [5], left=1, right=1 => [5]
console.log("结果:", listToArray(reverseBetween(arrayToList([5]), 1, 1)));
// [1,2,3,4,5], left=1, right=5 => [5,4,3,2,1]
console.log("结果:", listToArray(reverseBetween(arrayToList([1, 2, 3, 4, 5]), 1, 5)));

export {};
