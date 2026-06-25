// ============================================================
// 001. 两数相加
// ============================================================
// LeetCode 2. Add Two Numbers
// 给你两个非空链表，表示两个非负整数。每位数字都是逆序方式存储的，
// 每个节点只能存储一位数字。请将两个数相加，并以相同形式返回一个表示和的链表。
// 时间复杂度：O(max(m, n))，空间复杂度：O(max(m, n))

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

// 方法1：模拟进位（推荐）
// 遍历两个链表，逐位相加，处理进位
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let cur = dummy;
  let carry = 0; // 进位

  while (l1 !== null || l2 !== null || carry > 0) {
    const sum = carry + (l1 ? l1.val : 0) + (l2 ? l2.val : 0);
    carry = Math.floor(sum / 10); // 计算进位
    cur.next = new ListNode(sum % 10); // 当前位的值
    cur = cur.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }

  return dummy.next;
}

// 方法2：递归法
// 用递归处理每一位的相加
function addTwoNumbers2(
  l1: ListNode | null,
  l2: ListNode | null,
  carry: number = 0
): ListNode | null {
  // 递归终止条件：两个链表都遍历完且无进位
  if (l1 === null && l2 === null && carry === 0) {
    return null;
  }

  const sum = carry + (l1 ? l1.val : 0) + (l2 ? l2.val : 0);
  const node = new ListNode(sum % 10);
  node.next = addTwoNumbers2(l1 ? l1.next : null, l2 ? l2.next : null, Math.floor(sum / 10));
  return node;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 001. 两数相加 =====");
// 342 + 465 = 807 => [7, 0, 8]
console.log("结果:", listToArray(addTwoNumbers(arrayToList([2, 4, 3]), arrayToList([5, 6, 4]))));
// 0 + 0 = 0 => [0]
console.log("结果:", listToArray(addTwoNumbers(arrayToList([0]), arrayToList([0]))));
// 9999999 + 9999 = 10009998 => [8,9,9,9,0,0,0,1]
console.log(
  "结果:",
  listToArray(addTwoNumbers(arrayToList([9, 9, 9, 9, 9, 9, 9]), arrayToList([9, 9, 9, 9])))
);

export {};
