// ============================================================
// 070. LCR 077. 排序链表
// ============================================================
// LeetCode 148. Sort List
// 给定链表的头结点 head，请将其按升序排列并返回排序后的链表。
// 要求时间复杂度 O(n log n)，空间复杂度 O(1)。
// 时间复杂度：O(n log n), 空间复杂度：O(log n) 递归栈

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 方法1：归并排序（分治）- 自顶向下（推荐）
// 用快慢指针找中点，递归排序左右两半，再合并
// 时间复杂度 O(n log n)，空间复杂度 O(log n) 递归栈
function sortListTopDown(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) {
    return head;
  }

  // 快慢指针找中点，slow 前一步记为 mid，用于断开
  let slow: ListNode = head;
  let fast: ListNode = head;
  let prev: ListNode | null = null;
  while (fast !== null && fast.next !== null) {
    prev = slow;
    slow = slow.next!;
    fast = fast.next.next!;
  }
  // 断开
  if (prev !== null) {
    prev.next = null;
  }

  const left: ListNode | null = sortListTopDown(head);
  const right: ListNode | null = sortListTopDown(slow);
  return mergeTwoLists(left, right);
}

// 合并两个有序链表
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy: ListNode = new ListNode(0);
  let cur: ListNode = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }
    cur = cur.next;
  }
  cur.next = l1 !== null ? l1 : l2;
  return dummy.next;
}

// 方法2：自底向上归并排序
// 每次合并长度为 size 的子链表，逐步翻倍 size，避免递归栈
// 时间复杂度 O(n log n)，空间复杂度 O(1)
function sortListBottomUp(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) {
    return head;
  }

  // 统计链表长度
  let length: number = 0;
  let node: ListNode | null = head;
  while (node !== null) {
    length++;
    node = node.next;
  }

  const dummy: ListNode = new ListNode(0, head);

  for (let size: number = 1; size < length; size *= 2) {
    let prev: ListNode = dummy;
    let cur: ListNode | null = dummy.next;
    while (cur !== null) {
      // 切出第一段长度为 size
      const left: ListNode | null = cur;
      let leftTail: ListNode = cur;
      let count: number = 1;
      while (leftTail.next !== null && count < size) {
        leftTail = leftTail.next;
        count++;
      }
      // 切出第二段长度为 size
      const right: ListNode | null = leftTail.next;
      leftTail.next = null;
      let rightTail: ListNode | null = right;
      count = 1;
      while (rightTail !== null && rightTail.next !== null && count < size) {
        rightTail = rightTail.next;
        count++;
      }
      // 记录下一段起点
      let nextStart: ListNode | null = null;
      if (rightTail !== null) {
        nextStart = rightTail.next;
        rightTail.next = null;
      }
      // 合并两段
      const merged: ListNode | null = mergeTwoLists(left, right);
      prev.next = merged;
      // 移动 prev 到合并后末尾
      while (prev.next !== null) {
        prev = prev.next;
      }
      cur = nextStart;
    }
  }

  return dummy.next;
}

// 辅助：数组转链表
function arrayToList(arr: number[]): ListNode | null {
  const dummy: ListNode = new ListNode(0);
  let cur: ListNode = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

// 辅助：链表转数组
function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let cur: ListNode | null = head;
  while (cur !== null) {
    result.push(cur.val);
    cur = cur.next;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 070. LCR 077. 排序链表 =====");
console.log(listToArray(sortListTopDown(arrayToList([4, 2, 1, 3])))); // 期望结果: [1, 2, 3, 4]
console.log(listToArray(sortListTopDown(arrayToList([-1, 5, 3, 4, 0])))); // 期望结果: [-1, 0, 3, 4, 5]
console.log(listToArray(sortListTopDown(arrayToList([])))); // 期望结果: []
console.log("--- 方法2测试 ---");
console.log(listToArray(sortListBottomUp(arrayToList([4, 2, 1, 3])))); // 期望结果: [1, 2, 3, 4]
console.log(listToArray(sortListBottomUp(arrayToList([-1, 5, 3, 4, 0])))); // 期望结果: [-1, 0, 3, 4, 5]

export {};
