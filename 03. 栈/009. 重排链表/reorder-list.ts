// ============================================================
// 009. 重排链表
// ============================================================
// LeetCode 143. Reorder List
// 给定单链表 L: L0→L1→…→Ln-1→Ln，重新排列为 L0→Ln→L1→Ln-1→L2→Ln-2→…

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
// 把所有节点压栈，再用双指针从头和尾交替取出。
// 时间 O(n)，空间 O(n)。
function reorderList(head: ListNode | null): void {
  if (head === null) return;
  const stack: ListNode[] = [];
  let cur: ListNode | null = head;
  while (cur !== null) {
    stack.push(cur);
    cur = cur.next;
  }
  let left = head;
  const n = stack.length;
  for (let i = 0; i < Math.floor(n / 2); i++) {
    const tail = stack.pop()!;
    const next = left.next;
    left.next = tail;
    tail.next = next;
    left = next!;
  }
  left.next = null;
}

// ------------------------------------------------------------
// 方法2：找中点 + 翻转 + 合并（O(1) 空间）
// ------------------------------------------------------------
function reorderListO1(head: ListNode | null): void {
  if (head === null) return;
  // 1. 快慢指针找中点
  let slow: ListNode = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  // 2. 翻转后半部分
  let prev: ListNode | null = null;
  let cur: ListNode | null = slow.next;
  slow.next = null;
  while (cur !== null) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  // 3. 交替合并
  let l1: ListNode | null = head;
  let l2: ListNode | null = prev;
  while (l2 !== null) {
    const n1: ListNode | null = l1!.next;
    const n2: ListNode | null = l2.next;
    l1!.next = l2;
    l2.next = n1;
    l1 = n1;
    l2 = n2;
  }
}

// 辅助函数
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
  const head1 = buildList([1, 2, 3, 4]);
  reorderList(head1);
  console.log('测试1 - 栈法:', listToArray(head1), '期望: [1,4,2,3]');

  const head2 = buildList([1, 2, 3, 4, 5]);
  reorderListO1(head2);
  console.log('测试2 - O1法:', listToArray(head2), '期望: [1,5,2,4,3]');
}

test();

export {};
