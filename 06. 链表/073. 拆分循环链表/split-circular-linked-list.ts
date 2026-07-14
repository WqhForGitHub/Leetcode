// ============================================================
// 073. 拆分循环链表
// ============================================================
// LeetCode 2674. Split a Circular Linked List
// 给定一个长度为偶数的循环链表，将其拆分成两个长度相等的循环链表。
// 第一个链表包含前一半节点，第二个链表包含后一半节点。
// 快慢指针找中点，断开成两个循环链表，返回两个头节点。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 循环链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 辅助函数：数组转循环链表
function arrayToCircularList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode();
  let cur = dummy;
  const nodes: ListNode[] = [];
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
    nodes.push(cur);
  }
  // 把尾节点指向头节点，形成环
  nodes[nodes.length - 1].next = nodes[0];
  return nodes[0];
}

// 辅助函数：从循环链表头开始遍历一圈，转成数组
function circularListToArray(head: ListNode | null): number[] {
  if (head === null) return [];
  const result: number[] = [];
  let cur: ListNode | null = head;
  do {
    result.push(cur!.val);
    cur = cur!.next;
  } while (cur !== head && cur !== null);
  return result;
}

// ============================================================
// 方法：快慢指针找中点，断开成两个循环链表
// ============================================================
// 思路：
//   1. 使用快慢指针，slow 每次走 1 步，fast 每次走 2 步
//   2. 当 fast.next === head（回到头）或 fast.next.next === head 时，
//      slow 刚好走到前半部分的最后一个节点
//   3. 第二个链表的头 = slow.next
//   4. 找到原链表的尾节点，将其 next 指向第二个链表的头
//   5. slow.next 指向第一个链表的头，分别成环
// 时间复杂度 O(n)，空间复杂度 O(1)
function splitCircularLinkedList(head: ListNode | null): [ListNode | null, ListNode | null] {
  if (head === null) return [null, null];

  let slow: ListNode = head;
  let fast: ListNode = head;

  // 快慢指针：fast 走两步，slow 走一步
  // 循环条件：fast.next 不能回到 head，fast.next.next 不能回到 head
  while (fast.next !== head && fast.next!.next !== head) {
    slow = slow.next!;
    fast = fast.next!.next!;
  }

  // slow 现在指向前半部分的最后一个节点
  // 第二个链表的头节点
  const secondHead = slow.next!;

  // 找到原链表的尾节点
  // 如果 fast.next === head，说明尾节点是 fast
  // 否则尾节点是 fast.next（长度为偶数时 fast 停在倒数第二个）
  let tail: ListNode;
  if (fast.next === head) {
    tail = fast;
  } else {
    tail = fast.next!;
  }

  // 第二个链表成环：尾节点的 next 指向第二个链表的头
  tail.next = secondHead;

  // 第一个链表成环：slow.next 指向第一个链表的头
  slow.next = head;

  return [head, secondHead];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 073. 拆分循环链表 =====");

// 测试1：[1,5,7] 和 [2,6,6]（来自 [1,5,7,2,6,6]）
const list1 = arrayToCircularList([1, 5, 7, 2, 6, 6]);
const [h1a, h1b] = splitCircularLinkedList(list1);
console.log("链表1前半:", circularListToArray(h1a)); // [1, 5, 7]
console.log("链表1后半:", circularListToArray(h1b)); // [2, 6, 6]

// 测试2：[1,2] -> [1] 和 [2]
const list2 = arrayToCircularList([1, 2]);
const [h2a, h2b] = splitCircularLinkedList(list2);
console.log("链表2前半:", circularListToArray(h2a)); // [1]
console.log("链表2后半:", circularListToArray(h2b)); // [2]

// 测试3：[3,5,1,9,7,2,4,8] -> [3,5,1,9] 和 [7,2,4,8]
const list3 = arrayToCircularList([3, 5, 1, 9, 7, 2, 4, 8]);
const [h3a, h3b] = splitCircularLinkedList(list3);
console.log("链表3前半:", circularListToArray(h3a)); // [3, 5, 1, 9]
console.log("链表3后半:", circularListToArray(h3b)); // [7, 2, 4, 8]

export {};
