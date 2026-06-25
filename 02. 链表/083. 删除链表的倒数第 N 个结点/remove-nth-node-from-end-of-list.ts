// ============================================================
// 083. 删除链表的倒数第 N 个结点
// ============================================================
// LeetCode 19. Remove Nth Node From End of List
// 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
// 与 002 相同题目，这里提供不同实现。
// 方法1：快慢指针 + dummy 节点
// 方法2：计算长度后正向定位
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

// ============================================================
// 方法1：快慢指针 + dummy 节点（一次遍历，推荐）
// ============================================================
// 思路：
//   1. 设置 dummy 节点指向 head，统一处理删除头节点的情况
//   2. 快指针先走 n+1 步，使慢指针最终停在待删除节点的前驱
//   3. 快慢同步移动直到快指针为 null
//   4. 慢指针的 next 即为待删除节点，跳过它
// 时间复杂度 O(n)（一次遍历），空间复杂度 O(1)
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let fast: ListNode | null = dummy;
  let slow: ListNode | null = dummy;

  // 快指针先走 n+1 步
  for (let i = 0; i <= n; i++) {
    fast = fast!.next;
  }

  // 快慢同步移动
  while (fast !== null) {
    fast = fast.next;
    slow = slow!.next;
  }

  // 删除倒数第 n 个节点
  slow!.next = slow!.next!.next;

  return dummy.next;
}

// ============================================================
// 方法2：先计算长度，再正向定位（两次遍历）
// ============================================================
// 思路：
//   1. 第一次遍历计算链表长度 length
//   2. 待删除节点的前驱位置 = length - n（从 dummy 开始数）
//   3. 第二次遍历走到前驱，删除 next 节点
// 时间复杂度 O(n)（两次遍历），空间复杂度 O(1)
function removeNthFromEndByLength(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let length = 0;
  let cur: ListNode | null = head;

  // 第一次遍历，计算长度
  while (cur !== null) {
    length++;
    cur = cur.next;
  }

  // 第二次遍历，走到待删除节点的前驱
  cur = dummy;
  for (let i = 0; i < length - n; i++) {
    cur = cur!.next;
  }

  // 删除节点
  cur!.next = cur!.next!.next;

  return dummy.next;
}

// ============================================================
// 方法3：栈方法（借助数组模拟栈）
// ============================================================
// 思路：把所有节点入栈，然后弹出 n 个，栈顶即为待删除节点的前驱。
// 时间复杂度 O(n)，空间复杂度 O(n)
function removeNthFromEndByStack(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  const stack: ListNode[] = [];
  let cur: ListNode | null = dummy;
  // 全部入栈
  while (cur !== null) {
    stack.push(cur);
    cur = cur.next;
  }
  // 弹出 n 个，栈顶为前驱
  for (let i = 0; i < n; i++) {
    stack.pop();
  }
  const prev = stack[stack.length - 1];
  prev.next = prev.next!.next;
  return dummy.next;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 083. 删除链表的倒数第 N 个结点 =====");

// [1,2,3,4,5], n=2 -> [1,2,3,5]
console.log("方法1:", listToArray(removeNthFromEnd(arrayToList([1, 2, 3, 4, 5]), 2)));
// [1], n=1 -> []
console.log("方法1:", listToArray(removeNthFromEnd(arrayToList([1]), 1)));
// [1,2], n=1 -> [1]
console.log("方法1:", listToArray(removeNthFromEnd(arrayToList([1, 2]), 1)));

// 方法2 测试
console.log("方法2:", listToArray(removeNthFromEndByLength(arrayToList([1, 2, 3, 4, 5]), 2))); // [1,2,3,5]
console.log("方法2:", listToArray(removeNthFromEndByLength(arrayToList([1]), 1))); // []
console.log("方法2:", listToArray(removeNthFromEndByLength(arrayToList([1, 2]), 1))); // [1]

// 方法3 测试
console.log("方法3:", listToArray(removeNthFromEndByStack(arrayToList([1, 2, 3, 4, 5]), 2))); // [1,2,3,5]
console.log("方法3:", listToArray(removeNthFromEndByStack(arrayToList([1]), 1))); // []
console.log("方法3:", listToArray(removeNthFromEndByStack(arrayToList([1, 2]), 1))); // [1]

export {};
