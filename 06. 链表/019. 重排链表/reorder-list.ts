// ============================================================
// 019. 重排链表
// ============================================================
// LeetCode 143. Reorder List
// 将链表重排为 L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ... 的形式。
// 三步：1.快慢指针找中点 2.反转后半部分 3.交错合并
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
  const head = new ListNode(arr[0]);
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    curr.next = new ListNode(arr[i]);
    curr = curr.next;
  }
  return head;
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
// 方法1：快慢指针找中点 + 反转后半 + 交错合并（推荐）
// ============================================================
function reorderList(head: ListNode | null): void {
  if (head === null || head.next === null) return;

  // 第一步：快慢指针找中点（slow 在前半部分最后一个节点）
  let slow: ListNode = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null && fast.next.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  // 第二步：反转后半部分链表
  let second: ListNode | null = reverseList(slow.next);
  slow.next = null; // 断开前后两半

  // 第三步：交错合并
  let first: ListNode | null = head;
  while (second !== null) {
    const temp1: ListNode | null = first!.next;
    const temp2: ListNode | null = second.next;
    first!.next = second;
    second.next = temp1;
    first = temp1;
    second = temp2;
  }
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
// 测试
// ============================================================
console.log("===== 019. 重排链表 =====");

// 测试1: [1,2,3,4] -> [1,4,2,3]
const list1 = arrayToList([1, 2, 3, 4]);
reorderList(list1);
console.log("测试1:", listToArray(list1));
// 预期: [1,4,2,3]

// 测试2: [1,2,3,4,5] -> [1,5,2,4,3]
const list2 = arrayToList([1, 2, 3, 4, 5]);
reorderList(list2);
console.log("测试2:", listToArray(list2));
// 预期: [1,5,2,4,3]

// 测试3: 单节点 [1]
const list3 = arrayToList([1]);
reorderList(list3);
console.log("测试3:", listToArray(list3));
// 预期: [1]

// 测试4: 两节点 [1,2]
const list4 = arrayToList([1, 2]);
reorderList(list4);
console.log("测试4:", listToArray(list4));
// 预期: [1,2]

// 测试5: 空链表
const list5 = arrayToList([]);
reorderList(list5);
console.log("测试5:", listToArray(list5));
// 预期: []

export {};
