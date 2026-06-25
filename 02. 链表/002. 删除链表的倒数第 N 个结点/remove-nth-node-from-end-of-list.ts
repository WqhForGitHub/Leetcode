// ============================================================
// 002. 删除链表的倒数第 N 个结点
// ============================================================
// LeetCode 19. Remove Nth Node From End of List
// 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
// 使用快慢指针法，快指针先走 n 步，然后快慢指针同步移动。
// 时间复杂度：O(n)，空间复杂度：O(1)

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

// 方法1：快慢指针 + dummy 节点（推荐）
// 快指针先走 n 步，然后快慢指针同步移动，慢指针指向待删除节点的前驱
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  // 使用 dummy 节点统一处理头节点删除的情况
  const dummy = new ListNode(0, head);
  let fast: ListNode | null = dummy;
  let slow: ListNode | null = dummy;

  // 快指针先走 n+1 步，这样慢指针最终指向待删除节点的前驱
  for (let i = 0; i <= n; i++) {
    fast = fast!.next;
  }

  // 快慢指针同步移动，直到快指针到达末尾
  while (fast !== null) {
    fast = fast.next;
    slow = slow!.next;
  }

  // 删除倒数第 n 个节点
  slow!.next = slow!.next!.next;

  return dummy.next;
}

// 方法2：两次遍历法
// 第一次遍历计算链表长度，第二次遍历到待删除节点的前驱
function removeNthFromEnd2(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let cur: ListNode | null = dummy;
  let length = 0;

  // 第一次遍历，计算链表长度
  while (cur.next !== null) {
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
// 测试
// ============================================================
console.log("===== 002. 删除链表的倒数第 N 个结点 =====");
// 删除倒数第2个 => [1,2,3,5]
console.log("结果:", listToArray(removeNthFromEnd(arrayToList([1, 2, 3, 4, 5]), 2)));
// 删除倒数第1个 => []
console.log("结果:", listToArray(removeNthFromEnd(arrayToList([1]), 1)));
// 删除倒数第1个 => [1]
console.log("结果:", listToArray(removeNthFromEnd(arrayToList([1, 2]), 1)));

export {};
