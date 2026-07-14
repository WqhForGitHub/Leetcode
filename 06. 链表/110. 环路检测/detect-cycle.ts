// ============================================================
// 110. 环路检测
// ============================================================
// 面试题 02.08. 环路检测
// 给定一个有环链表，实现算法返回环的开头节点。若链表无环，返回 null。
// 时间复杂度：O(n)，空间复杂度：O(1)（方法1）

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// 辅助函数：用数组构建链表，并在 pos 位置形成环（pos 为尾节点指向的索引）
function buildCycleList(arr: number[], pos: number): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode();
  let cur = dummy;
  const nodes: ListNode[] = [];
  for (const v of arr) {
    cur.next = new ListNode(v);
    nodes.push(cur.next);
    cur = cur.next;
  }
  // pos >= 0 时，尾节点指向第 pos 个节点形成环
  if (pos >= 0 && pos < nodes.length) {
    cur.next = nodes[pos];
  }
  return dummy.next;
}

// ============================================================
// 方法1：快慢指针法（Floyd 判圈算法）
// ============================================================
// 1. 快指针每次走2步，慢指针每次走1步，若有环必然在环内相遇。
// 2. 相遇后，将慢指针重置到 head，快指针改为每次走1步，
//    两者再次相遇的位置即为环的入口。
// 数学证明：设头到入口距离 a，入口到相遇点距离 b，相遇点到入口距离 c（环长 b+c）。
//   慢指针走 a+b，快指针走 a + b + n(b+c) = 2(a+b)
//   => a = (n-1)(b+c) + c，即从头走 a 步 = 从相遇点走 c 步到入口。
// 时间复杂度：O(n)，空间复杂度：O(1)
function detectCycle(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  let hasCycle = false;

  // 第一阶段：快慢指针找相遇点
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      hasCycle = true;
      break;
    }
  }

  // 无环
  if (!hasCycle) return null;

  // 第二阶段：慢指针回到 head，两者同速走，相遇点即环入口
  slow = head;
  while (slow !== fast) {
    slow = slow!.next;
    fast = fast!.next;
  }

  return slow;
}

// ============================================================
// 方法2：哈希集合法
// ============================================================
// 遍历链表，用 Set 记录已访问的节点。
// 第一次遇到已访问的节点即为环的入口。
// 时间复杂度：O(n)，空间复杂度：O(n)
function detectCycleBySet(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  const visited = new Set<ListNode>();
  let cur: ListNode | null = head;

  while (cur !== null) {
    if (visited.has(cur)) {
      return cur; // 已访问过，即环入口
    }
    visited.add(cur);
    cur = cur.next;
  }

  return null; // 无环
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  console.log("===== 110. 环路检测 测试 =====\n");

  // 测试1：有环，环入口在索引1（值为2）
  // 3 -> 2 -> 0 -> -4 -> (回到 2)
  const head1 = buildCycleList([3, 2, 0, -4], 1);
  const result1 = detectCycle(head1);
  const result1b = detectCycleBySet(head1);
  console.log("测试1 - 环入口值:");
  console.log("  方法1(快慢指针):", result1 ? result1.val : null);
  console.log("  方法2(哈希集合):", result1b ? result1b.val : null);
  console.log("  期望: 2\n");

  // 测试2：有环，环入口在索引0（值为1）
  // 1 -> 2 -> (回到 1)
  const head2 = buildCycleList([1, 2], 0);
  const result2 = detectCycle(head2);
  const result2b = detectCycleBySet(head2);
  console.log("测试2 - 环入口值:");
  console.log("  方法1(快慢指针):", result2 ? result2.val : null);
  console.log("  方法2(哈希集合):", result2b ? result2b.val : null);
  console.log("  期望: 1\n");

  // 测试3：无环
  // 1 -> 2 -> 3 -> 4
  const head3 = buildCycleList([1, 2, 3, 4], -1);
  const result3 = detectCycle(head3);
  const result3b = detectCycleBySet(head3);
  console.log("测试3 - 无环:");
  console.log("  方法1(快慢指针):", result3 ? result3.val : null);
  console.log("  方法2(哈希集合):", result3b ? result3b.val : null);
  console.log("  期望: null\n");

  // 测试4：单节点无环
  const head4 = buildCycleList([1], -1);
  const result4 = detectCycle(head4);
  console.log("测试4 - 单节点无环:");
  console.log("  方法1(快慢指针):", result4 ? result4.val : null);
  console.log("  期望: null\n");

  // 测试5：单节点自环
  const head5 = buildCycleList([1], 0);
  const result5 = detectCycle(head5);
  console.log("测试5 - 单节点自环:");
  console.log("  方法1(快慢指针):", result5 ? result5.val : null);
  console.log("  期望: 1\n");
}

test();

export {};
