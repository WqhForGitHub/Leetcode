// ============================================================
// 019. 回文链表
// ============================================================
// LeetCode 234. Palindrome Linked List
// 给你一个单链表的头节点 head，判断该链表是否为回文链表。

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
// 把所有节点值压栈，再遍历依次比较。
// 时间 O(n)，空间 O(n)。
function isPalindrome(head: ListNode | null): boolean {
  const stack: number[] = [];
  let cur = head;
  while (cur !== null) {
    stack.push(cur.val);
    cur = cur.next;
  }
  cur = head;
  while (cur !== null) {
    if (cur.val !== stack.pop()) return false;
    cur = cur.next;
  }
  return true;
}

// ------------------------------------------------------------
// 方法2：快慢指针 + 翻转后半部分（O(1) 空间）
// ------------------------------------------------------------
function isPalindromeO1(head: ListNode | null): boolean {
  if (head === null || head.next === null) return true;
  // 找中点
  let slow = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  // 翻转后半部分
  let prev: ListNode | null = null;
  let cur: ListNode | null = slow;
  while (cur !== null) {
    const next: ListNode | null = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  // 比较
  let l: ListNode | null = head;
  let r: ListNode | null = prev;
  while (r !== null) {
    if (l!.val !== r.val) return false;
    l = l!.next;
    r = r.next;
  }
  return true;
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

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1 - 栈法:', isPalindrome(buildList([1, 2, 2, 1])), '期望: true');
  console.log('测试2 - 栈法:', isPalindrome(buildList([1, 2])), '期望: false');
  console.log('测试3 - O1法:', isPalindromeO1(buildList([1, 2, 2, 1])), '期望: true');
  console.log('测试4 - O1法:', isPalindromeO1(buildList([1, 2, 3, 2, 1])), '期望: true');
}

test();

export {};
