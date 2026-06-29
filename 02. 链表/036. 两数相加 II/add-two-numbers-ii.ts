// ============================================================
// 036. 两数相加 II
// ============================================================
// LeetCode 445. Add Two Numbers II
// 给定两个非空链表表示两个非负整数（头节点是最高位），返回它们的和的链表。
// 不能反转输入链表（题目进阶要求）。
// 时间复杂度：O(max(m,n))，空间复杂度：O(m+n)（方法1栈）/ O(1)（方法2）

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
  let curr = dummy;
  for (const v of arr) {
    curr.next = new ListNode(v);
    curr = curr.next;
  }
  return dummy.next;
}

// 辅助函数：链表转数组
function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let curr = head;
  while (curr !== null) {
    result.push(curr.val);
    curr = curr.next;
  }
  return result;
}

// 反转链表辅助函数
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

// ============================================================
// 方法1：用两个栈存储数字，再从低位到高位相加（推荐，不修改原链表）
// ============================================================
// 把两个链表的值分别压入栈，然后弹出相加（从最低位开始），
// 用头插法构建结果链表。
// 时间复杂度 O(m+n)，空间复杂度 O(m+n)
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const stack1: number[] = [];
  const stack2: number[] = [];

  // 将两个链表的值压入栈
  let curr = l1;
  while (curr !== null) {
    stack1.push(curr.val);
    curr = curr.next;
  }
  curr = l2;
  while (curr !== null) {
    stack2.push(curr.val);
    curr = curr.next;
  }

  let carry = 0;
  let head: ListNode | null = null; // 结果链表头，用头插法

  // 从栈顶（最低位）开始相加
  while (stack1.length > 0 || stack2.length > 0 || carry > 0) {
    const digit1 = stack1.length > 0 ? stack1.pop()! : 0;
    const digit2 = stack2.length > 0 ? stack2.pop()! : 0;
    const sum = digit1 + digit2 + carry;
    carry = Math.floor(sum / 10);
    // 头插法：新节点作为新的头
    const node = new ListNode(sum % 10);
    node.next = head;
    head = node;
  }

  return head;
}

// ============================================================
// 方法2：反转链表后用 LC2 的方法相加
// ============================================================
// 反转两个链表（低位在前），从低位开始相加，最后反转结果。
// 注意：此方法会修改原链表结构。
// 时间复杂度 O(m+n)，空间复杂度 O(1)（不计结果链表）
function addTwoNumbersReverse(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  // 反转两个链表，使低位在前
  const r1 = reverseList(l1);
  const r2 = reverseList(l2);

  // 从低位开始相加
  const dummy = new ListNode();
  let curr = dummy;
  let carry = 0;
  let p1 = r1;
  let p2 = r2;

  while (p1 !== null || p2 !== null || carry > 0) {
    const digit1 = p1 !== null ? p1.val : 0;
    const digit2 = p2 !== null ? p2.val : 0;
    const sum = digit1 + digit2 + carry;
    carry = Math.floor(sum / 10);
    curr.next = new ListNode(sum % 10);
    curr = curr.next;
    if (p1 !== null) p1 = p1.next;
    if (p2 !== null) p2 = p2.next;
  }

  // 结果是低位在前，反转回高位在前
  return reverseList(dummy.next);
}

// 测试
console.log("===== 036. 两数相加 II =====");
console.log(
  "方法1 栈：[7,2,4,3] + [5,6,4] ->",
  listToArray(addTwoNumbers(arrayToList([7, 2, 4, 3]), arrayToList([5, 6, 4]))),
); // [7,8,0,7]
console.log(
  "方法1 栈：[2,4,3] + [5,6,4] ->",
  listToArray(addTwoNumbers(arrayToList([2, 4, 3]), arrayToList([5, 6, 4]))),
); // [8,0,7]
console.log(
  "方法1 栈：[0] + [0] ->",
  listToArray(addTwoNumbers(arrayToList([0]), arrayToList([0]))),
); // [0]
console.log(
  "方法1 栈：[9,9,9,9] + [1] ->",
  listToArray(addTwoNumbers(arrayToList([9, 9, 9, 9]), arrayToList([1]))),
); // [1,0,0,0,0]
console.log(
  "方法2 反转：[7,2,4,3] + [5,6,4] ->",
  listToArray(addTwoNumbersReverse(arrayToList([7, 2, 4, 3]), arrayToList([5, 6, 4]))),
); // [7,8,0,7]
console.log(
  "方法2 反转：[0] + [0] ->",
  listToArray(addTwoNumbersReverse(arrayToList([0]), arrayToList([0]))),
); // [0]
console.log(
  "方法2 反转：[9,9,9,9] + [1] ->",
  listToArray(addTwoNumbersReverse(arrayToList([9, 9, 9, 9]), arrayToList([1]))),
); // [1,0,0,0,0]

export {};
