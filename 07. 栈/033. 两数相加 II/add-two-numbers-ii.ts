// ============================================================
// 033. 两数相加 II
// ============================================================
// LeetCode 445. Add Two Numbers II
// 给你两个非空链表，代表两个非负整数（最高位在前），返回相加结果链表。

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 用两个栈分别存两个链表的值，从低位（栈顶）开始相加，头插法构建结果。
// 时间 O(max(m,n))，空间 O(m+n)。
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const s1: number[] = [];
  const s2: number[] = [];
  while (l1) {
    s1.push(l1.val);
    l1 = l1.next;
  }
  while (l2) {
    s2.push(l2.val);
    l2 = l2.next;
  }
  let carry = 0;
  let head: ListNode | null = null;
  while (s1.length > 0 || s2.length > 0 || carry > 0) {
    const a = s1.length > 0 ? s1.pop()! : 0;
    const b = s2.length > 0 ? s2.pop()! : 0;
    const sum = a + b + carry;
    carry = Math.floor(sum / 10);
    const node = new ListNode(sum % 10);
    node.next = head;
    head = node;
  }
  return head;
}

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
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    listToArray(addTwoNumbers(buildList([7, 2, 4, 3]), buildList([5, 6, 4]))),
    "期望: [7,8,0,7]",
  );
  console.log("测试2:", listToArray(addTwoNumbers(buildList([0]), buildList([0]))), "期望: [0]");
}

test();

export {};
