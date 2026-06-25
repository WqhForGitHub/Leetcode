// ============================================================
// 087. 两数相加 II
// ============================================================
// LeetCode 445. Add Two Numbers II
// 给你两个非空链表，代表两个非负整数。链表的头节点是数字的最高位。
// 请将这两个数相加，返回一个表示和的链表（同样是最高位在前）。
// 时间复杂度：O(m + n)，空间复杂度：O(m + n)（方法1）/ O(1)（方法2额外，不计结果）

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// 辅助函数：由数组构建链表
function buildList(arr: number[]): ListNode | null {
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
  const arr: number[] = [];
  let cur = head;
  while (cur) {
    arr.push(cur.val);
    cur = cur.next;
  }
  return arr;
}

// ------------------------------------------------------------
// 方法1：栈法
// ------------------------------------------------------------
// 由于链表高位在前，低位在后，而加法需从低位开始，故用栈将两链表逆序处理。
// 依次弹出栈顶元素相加，使用头插法构建结果链表（保证高位在前）。
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const stack1: number[] = [];
  const stack2: number[] = [];

  // 将两链表的值压入栈
  let cur: ListNode | null = l1;
  while (cur !== null) {
    stack1.push(cur.val);
    cur = cur.next;
  }
  cur = l2;
  while (cur !== null) {
    stack2.push(cur.val);
    cur = cur.next;
  }

  let carry = 0; // 进位
  let head: ListNode | null = null; // 结果链表头

  // 当栈非空或有进位时继续
  while (stack1.length > 0 || stack2.length > 0 || carry > 0) {
    const v1 = stack1.length > 0 ? stack1.pop()! : 0;
    const v2 = stack2.length > 0 ? stack2.pop()! : 0;
    const sum = v1 + v2 + carry;
    carry = Math.floor(sum / 10);
    const digit = sum % 10;

    // 头插法：新节点插到链表头部，保证高位在前
    const node = new ListNode(digit);
    node.next = head;
    head = node;
  }

  return head;
}

// ------------------------------------------------------------
// 方法2：反转链表法
// ------------------------------------------------------------
// 先反转两链表使其低位在前，从低位开始相加，结果再用头插法构建（或反转）。
// 避免使用栈的额外空间（但仍需反转链表）。
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

function addTwoNumbersReverse(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  // 反转两链表，使低位在前
  const r1 = reverseList(l1);
  const r2 = reverseList(l2);

  let carry = 0;
  let head: ListNode | null = null;

  let p1: ListNode | null = r1;
  let p2: ListNode | null = r2;

  // 从低位开始相加
  while (p1 !== null || p2 !== null || carry > 0) {
    const v1 = p1 !== null ? p1.val : 0;
    const v2 = p2 !== null ? p2.val : 0;
    const sum = v1 + v2 + carry;
    carry = Math.floor(sum / 10);
    const digit = sum % 10;

    // 头插法构建结果（高位在前）
    const node = new ListNode(digit);
    node.next = head;
    head = node;

    if (p1 !== null) p1 = p1.next;
    if (p2 !== null) p2 = p2.next;
  }

  return head;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  // 测试1：(7 -> 2 -> 4 -> 3) + (5 -> 6 -> 4) = 7 -> 8 -> 0 -> 7
  // 7243 + 564 = 7807
  const l1 = buildList([7, 2, 4, 3]);
  const l2 = buildList([5, 6, 4]);
  console.log("测试1 - 栈法:");
  console.log("  l1:", listToArray(l1));
  console.log("  l2:", listToArray(l2));
  const res1 = addTwoNumbers(l1, l2);
  console.log("  结果:", listToArray(res1));
  console.log("  期望: [7, 8, 0, 7]");

  // 测试2：反转法
  const l1b = buildList([7, 2, 4, 3]);
  const l2b = buildList([5, 6, 4]);
  console.log("测试2 - 反转链表法:");
  const res2 = addTwoNumbersReverse(l1b, l2b);
  console.log("  结果:", listToArray(res2));
  console.log("  期望: [7, 8, 0, 7]");

  // 测试3：产生进位到最高位 (9 -> 9) + (1) = 1 -> 0 -> 0
  const l3 = buildList([9, 9]);
  const l4 = buildList([1]);
  console.log("测试3 - 进位测试:");
  const res3 = addTwoNumbers(l3, l4);
  console.log("  结果:", listToArray(res3));
  console.log("  期望: [1, 0, 0]");

  // 测试4：(0) + (0) = 0
  const l5 = buildList([0]);
  const l6 = buildList([0]);
  console.log("测试4 - 零测试:");
  const res4 = addTwoNumbersReverse(l5, l6);
  console.log("  结果:", listToArray(res4));
  console.log("  期望: [0]");
}

test();

export {};
