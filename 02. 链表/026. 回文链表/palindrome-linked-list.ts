// ============================================================
// 026. 回文链表
// ============================================================
// LeetCode 234. Palindrome Linked List
// 判断一个单链表是否为回文链表。要求 O(n) 时间和 O(1) 空间。
// 时间复杂度：O(n)，空间复杂度：O(1)（方法1）/ O(n)（方法2）

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

// ============================================================
// 方法1：快慢指针找中点 -> 反转后半部分 -> 比较（推荐）
// ============================================================
// 步骤：
//   1. 快慢指针找到链表中点（慢指针停在中间或前半部分末尾）
//   2. 反转后半部分链表
//   3. 双指针同时从头和后半部分头开始比较
//   4.（可选）恢复链表
// 时间复杂度 O(n)，空间复杂度 O(1)
function isPalindrome(head: ListNode | null): boolean {
  if (head === null || head.next === null) return true;

  // 1. 快慢指针找中点
  let slow: ListNode = head;
  let fast: ListNode | null = head;
  // fast 走两步，slow 走一步，循环结束后 slow 指向后半部分的头
  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  // 2. 反转后半部分（从 slow 开始）
  let secondHalf: ListNode | null = reverseList(slow);
  // 保存反转后的头，便于后续恢复
  const secondHead: ListNode | null = secondHalf;

  // 3. 比较前半部分和反转后的后半部分
  let p1: ListNode | null = head;
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

  // 4.（可选）恢复链表
  reverseList(secondHead);

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
// 方法2：复制到数组 + 双指针
// ============================================================
// 把链表值复制到数组中，再用左右指针判断回文。
// 时间复杂度 O(n)，空间复杂度 O(n)
function isPalindromeArray(head: ListNode | null): boolean {
  const arr: number[] = [];
  let curr = head;
  while (curr !== null) {
    arr.push(curr.val);
    curr = curr.next;
  }
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    if (arr[left] !== arr[right]) return false;
    left++;
    right--;
  }
  return true;
}

// 测试
console.log("===== 026. 回文链表 =====");
console.log("方法1：[1,2,2,1] ->", isPalindrome(arrayToList([1, 2, 2, 1]))); // true
console.log("方法1：[1,2] ->", isPalindrome(arrayToList([1, 2]))); // false
console.log("方法1：[1,0,1] ->", isPalindrome(arrayToList([1, 0, 1]))); // true
console.log("方法2：[1,2,2,1] ->", isPalindromeArray(arrayToList([1, 2, 2, 1]))); // true
console.log("方法2：[1,2] ->", isPalindromeArray(arrayToList([1, 2]))); // false

export {};
