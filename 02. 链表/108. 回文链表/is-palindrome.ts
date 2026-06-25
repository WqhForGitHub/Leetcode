// ============================================================
// 108. 回文链表
// ============================================================
// 面试题 02.06. 回文链表
// 编写一个函数，检查输入的链表是否是回文。
// 时间复杂度：O(n)，空间复杂度：O(1)（快慢指针）/ O(n)（递归栈）

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
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

// 反转链表辅助函数
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
// 方法一：快慢指针 + 反转后半部分 + 比较
// ============================================================
// 1. 快慢指针找到链表中点（慢指针停在第一半的末尾）。
// 2. 反转后半部分链表。
// 3. 从头和从反转后的后半部分同步比较。
// 4.（可选）恢复链表。
// 时间 O(n)，空间 O(1)。
function isPalindrome(head: ListNode | null): boolean {
  if (head === null || head.next === null) return true;

  // 1. 快慢指针找中点
  let slow: ListNode = head;
  let fast: ListNode | null = head;
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  // slow 位于前半段的最后一个节点

  // 2. 反转后半部分
  let secondHalf: ListNode | null = reverseList(slow.next);
  let firstHalf: ListNode | null = head;

  // 3. 比较前半段与反转后的后半段
  let p1: ListNode | null = firstHalf;
  let p2: ListNode | null = secondHalf;
  let result = true;
  while (p2 !== null) {
    if (p1!.val !== p2.val) {
      result = false;
      break;
    }
    p1 = p1!.next;
    p2 = p2.next;
  }

  // 4. 恢复链表（可选）
  slow.next = reverseList(secondHalf);

  return result;
}

// ============================================================
// 方法二：递归 + 双指针
// ============================================================
// 利用递归天然从链表尾部回溯的特性，
// 配合一个从头部前进的前驱指针 front，实现从两端向中间比较。
// 时间 O(n)，空间 O(n)（递归栈）。
function isPalindromeRecursive(head: ListNode | null): boolean {
  let front: ListNode | null = head;

  function check(cur: ListNode | null): boolean {
    if (cur !== null) {
      // 递归到链表末尾
      if (!check(cur.next)) return false;
      // 回溯时比较：cur 从尾向头，front 从头向尾
      if (cur.val !== front!.val) return false;
      front = front!.next;
    }
    return true;
  }

  return check(head);
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  // 测试用例 1: [1,2,2,1] -> true
  console.log("测试1（快慢指针）:", isPalindrome(arrayToList([1, 2, 2, 1]))); // true
  console.log("测试1（递归）:", isPalindromeRecursive(arrayToList([1, 2, 2, 1]))); // true

  // 测试用例 2: [1,2] -> false
  console.log("测试2:", isPalindrome(arrayToList([1, 2]))); // false
  console.log("测试2（递归）:", isPalindromeRecursive(arrayToList([1, 2]))); // false

  // 测试用例 3: [1] -> true
  console.log("测试3:", isPalindrome(arrayToList([1]))); // true

  // 测试用例 4: [1,2,1] -> true（奇数长度）
  console.log("测试4:", isPalindrome(arrayToList([1, 2, 1]))); // true
  console.log("测试4（递归）:", isPalindromeRecursive(arrayToList([1, 2, 1]))); // true

  // 测试用例 5: 空链表 -> true
  console.log("测试5:", isPalindrome(arrayToList([]))); // true

  // 验证链表恢复（不应破坏原链表）
  const list = arrayToList([1, 2, 3, 2, 1])!;
  isPalindrome(list);
  let cur: ListNode | null = list;
  const restored: number[] = [];
  while (cur !== null) {
    restored.push(cur.val);
    cur = cur.next;
  }
  console.log("测试6（链表恢复）:", restored); // [1,2,3,2,1]
}

test();

export {};
