// ============================================================
// 017. 环形链表
// ============================================================
// LeetCode 141. Linked List Cycle
// 判断链表是否有环。pos 表示尾节点连接到的节点索引（-1 表示无环）。
// 时间复杂度：O(n)，空间复杂度：O(1)（方法1）/ O(n)（方法2）

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

// 辅助函数：数组转带环链表，pos 为环入口索引（-1 表示无环）
function arrayToListWithCycle(arr: number[], pos: number): ListNode | null {
  if (arr.length === 0) return null;
  const nodes: ListNode[] = arr.map((val) => new ListNode(val));
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }
  // pos >= 0 表示尾节点连接到索引 pos 的节点，形成环
  if (pos >= 0 && pos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[pos];
  }
  return nodes[0];
}

// ============================================================
// 方法1：快慢指针（Floyd 判圈法）（推荐）
// ============================================================
function hasCycle(head: ListNode | null): boolean {
  if (head === null || head.next === null) return false;
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next; // 慢指针走一步
    fast = fast.next.next; // 快指针走两步
    if (slow === fast) {
      return true; // 相遇说明有环
    }
  }
  return false;
}

// ============================================================
// 方法2：哈希集合
// ============================================================
function hasCycleSet(head: ListNode | null): boolean {
  const visited = new Set<ListNode>();
  let curr: ListNode | null = head;
  while (curr !== null) {
    if (visited.has(curr)) {
      return true;
    }
    visited.add(curr);
    curr = curr.next;
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 017. 环形链表 =====");

// 测试1: [3,2,0,-4], pos = 1（有环）
const list1 = arrayToListWithCycle([3, 2, 0, -4], 1);
console.log("测试1 (有环, pos=1):", hasCycle(list1));
// 预期: true

// 测试2: [1,2], pos = 0（有环）
const list2 = arrayToListWithCycle([1, 2], 0);
console.log("测试2 (有环, pos=0):", hasCycle(list2));
// 预期: true

// 测试3: [1,2], pos = -1（无环）
const list3 = arrayToListWithCycle([1, 2], -1);
console.log("测试3 (无环):", hasCycle(list3));
// 预期: false

// 测试4: 哈希集合方法
console.log("测试4 (哈希集合, 有环):", hasCycleSet(arrayToListWithCycle([3, 2, 0, -4], 1)));
// 预期: true

// 测试5: 单节点无环
console.log("测试5 (单节点无环):", hasCycle(arrayToList([1])));
// 预期: false

// 测试6: 空链表
console.log("测试6 (空链表):", hasCycle(null));
// 预期: false

export {};
