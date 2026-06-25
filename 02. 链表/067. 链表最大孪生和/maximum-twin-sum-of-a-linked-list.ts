// ============================================================
// 067. 链表最大孪生和
// ============================================================
// LeetCode 2130. Maximum Twin Sum of a Linked List
// 长度为 n 的链表，第 i 节点(0-indexed) 与第 n-1-i 节点为孪生节点。
// 求所有孪生节点之和的最大值。
// 思路：快慢指针找中点 -> 反转后半部分 -> 双指针同时遍历前后半部分求和取最大。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 数组转链表辅助函数
function arrayToList(arr: number[]): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  for (const v of arr) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
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

function pairSum(head: ListNode | null): number {
  if (head === null) return 0;

  // 1. 快慢指针找中点
  let slow: ListNode = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  // 2. 反转后半部分（从 slow 开始）
  const secondHalfHead = reverseList(slow);

  // 3. 双指针遍历前半部分和反转后的后半部分，求最大孪生和
  let maxSum = 0;
  let first: ListNode | null = head;
  let second: ListNode | null = secondHalfHead;
  while (second !== null) {
    maxSum = Math.max(maxSum, first!.val + second.val);
    first = first!.next;
    second = second.next;
  }

  return maxSum;
}

// ============================================================
// 测试
// ============================================================
function testPairSum(): void {
  // [5,4,2,1] -> 6 (5+1, 4+2)
  console.log(pairSum(arrayToList([5, 4, 2, 1]))); // 预期 6

  // [4,2,2,3] -> 7 (4+3, 2+2)
  console.log(pairSum(arrayToList([4, 2, 2, 3]))); // 预期 7

  // [1,100000] -> 100001
  console.log(pairSum(arrayToList([1, 100000]))); // 预期 100001

  console.log("pairSum 测试完成");
}

testPairSum();

export {};
