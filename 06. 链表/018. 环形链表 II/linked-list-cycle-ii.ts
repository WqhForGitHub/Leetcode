// ============================================================
// 018. 环形链表 II
// ============================================================
// LeetCode 142. Linked List Cycle II
// 找到环形链表的入环节点。若无环返回 null。
// 数学推导：设 a 为环外距离，b+c 为环长。
//   快慢指针相遇时：2(a+b) = a + b + n(b+c)  =>  a = (n-1)(b+c) + c
//   即从头走 a 步 == 从相遇点走 c 步再绕 (n-1) 圈，会在入口相遇。
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

// 辅助函数：数组转带环链表，pos 为环入口索引（-1 表示无环）
function arrayToListWithCycle(arr: number[], pos: number): ListNode | null {
  if (arr.length === 0) return null;
  const nodes: ListNode[] = arr.map((val) => new ListNode(val));
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }
  if (pos >= 0 && pos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[pos];
  }
  return nodes[0];
}

// ============================================================
// 方法1：快慢指针找相遇点，再从头出发找入口（推荐）
// ============================================================
function detectCycle(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return null;

  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  // 第一阶段：快慢指针找相遇点
  let hasCycle = false;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      hasCycle = true;
      break;
    }
  }

  if (!hasCycle) return null;

  // 第二阶段：一个指针从头出发，一个从相遇点出发，两者相遇即入口
  let ptr: ListNode | null = head;
  while (ptr !== slow) {
    ptr = ptr!.next;
    slow = slow!.next;
  }
  return ptr;
}

// ============================================================
// 方法2：哈希集合
// ============================================================
function detectCycleSet(head: ListNode | null): ListNode | null {
  const visited = new Set<ListNode>();
  let curr: ListNode | null = head;
  while (curr !== null) {
    if (visited.has(curr)) {
      return curr;
    }
    visited.add(curr);
    curr = curr.next;
  }
  return null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 018. 环形链表 II =====");

// 测试1: [3,2,0,-4], pos = 1，入口节点值为 2
const list1 = arrayToListWithCycle([3, 2, 0, -4], 1);
const entry1 = detectCycle(list1);
console.log("测试1 (pos=1, 快慢指针):", entry1 ? entry1.val : null);
// 预期: 2

// 测试2: [1,2], pos = 0，入口节点值为 1
const list2 = arrayToListWithCycle([1, 2], 0);
const entry2 = detectCycle(list2);
console.log("测试2 (pos=0, 快慢指针):", entry2 ? entry2.val : null);
// 预期: 1

// 测试3: [1], pos = -1，无环
const list3 = arrayToListWithCycle([1], -1);
const entry3 = detectCycle(list3);
console.log("测试3 (无环):", entry3 ? entry3.val : null);
// 预期: null

// 测试4: 哈希集合方法
const list4 = arrayToListWithCycle([3, 2, 0, -4], 1);
const entry4 = detectCycleSet(list4);
console.log("测试4 (哈希集合):", entry4 ? entry4.val : null);
// 预期: 2

// 测试5: 空链表
console.log("测试5 (空链表):", detectCycle(null) ? "有值" : null);
// 预期: null

export {};
