// ============================================================
// 084. 环形链表 II
// ============================================================
// LeetCode 142. Linked List Cycle II
// 给定一个链表的头节点，返回链表开始入环的第一个节点。如果链表无环，则返回 null。
// 与 018 相同题目，这里提供不同实现。
// 方法1：快慢指针找相遇点再找入口（Floyd 判圈法）
// 方法2：哈希集合
// 时间复杂度：O(n)，空间复杂度：O(1)（方法1）/ O(n)（方法2）

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

// 辅助函数：构造带环链表
// pos 表示尾节点连接到的节点索引（-1 表示无环）
function arrayToCycleList(arr: number[], pos: number): ListNode | null {
  if (arr.length === 0) return null;
  const nodes: ListNode[] = [];
  const dummy = new ListNode();
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
    nodes.push(cur);
  }
  // 构造环
  if (pos >= 0 && pos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[pos];
  }
  return nodes[0];
}

// ============================================================
// 方法1：Floyd 判圈法（快慢指针，推荐）
// ============================================================
// 思路：
//   1. 快指针每次走 2 步，慢指针每次走 1 步，若有环必相遇
//   2. 相遇后，把其中一个指针移回头节点，两指针每次都走 1 步，
//      再次相遇的节点即为环的入口
//   数学证明：设头到入口距离 a，入口到相遇点距离 b，相遇点到入口距离 c
//     慢指针走了 a+b，快指针走了 a+b+n(b+c)，且 2(a+b)=a+b+n(b+c)
//     推得 a = (n-1)(b+c) + c，即从头走 a 步等于从相遇点走 c 步到达入口
// 时间复杂度 O(n)，空间复杂度 O(1)
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

  // 第二阶段：找环入口
  // 把其中一个指针移回头节点，两指针同速前进，相遇点即入口
  let p1: ListNode | null = head;
  let p2: ListNode | null = slow; // 相遇点
  while (p1 !== p2) {
    p1 = p1!.next;
    p2 = p2!.next;
  }
  return p1;
}

// ============================================================
// 方法2：哈希集合
// ============================================================
// 思路：遍历链表，把访问过的节点加入 Set，第一次遇到已存在的节点即为环入口。
// 时间复杂度 O(n)，空间复杂度 O(n)
function detectCycleHashSet(head: ListNode | null): ListNode | null {
  const visited = new Set<ListNode>();
  let cur = head;
  while (cur !== null) {
    if (visited.has(cur)) {
      return cur; // 第一次重复访问的节点即环入口
    }
    visited.add(cur);
    cur = cur.next;
  }
  return null; // 无环
}

// ============================================================
// 测试
// ============================================================
console.log("===== 084. 环形链表 II =====");

// [3,2,0,-4], pos=1 -> 入口是节点 2
const list1 = arrayToCycleList([3, 2, 0, -4], 1);
const entry1 = detectCycle(list1);
console.log("方法1 入口值:", entry1 ? entry1.val : null); // 2

// [1,2], pos=0 -> 入口是节点 1
const list2 = arrayToCycleList([1, 2], 0);
const entry2 = detectCycle(list2);
console.log("方法1 入口值:", entry2 ? entry2.val : null); // 1

// [1], pos=-1 -> 无环
const list3 = arrayToCycleList([1], -1);
const entry3 = detectCycle(list3);
console.log("方法1 入口值:", entry3 ? entry3.val : null); // null

// 方法2 测试
const list4 = arrayToCycleList([3, 2, 0, -4], 1);
const entry4 = detectCycleHashSet(list4);
console.log("方法2 入口值:", entry4 ? entry4.val : null); // 2

const list5 = arrayToCycleList([1, 2], 0);
const entry5 = detectCycleHashSet(list5);
console.log("方法2 入口值:", entry5 ? entry5.val : null); // 1

const list6 = arrayToCycleList([1], -1);
const entry6 = detectCycleHashSet(list6);
console.log("方法2 入口值:", entry6 ? entry6.val : null); // null

export {};
