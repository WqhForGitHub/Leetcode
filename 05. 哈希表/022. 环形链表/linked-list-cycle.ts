// ============================================================
// 022. 环形链表
// ============================================================
// LeetCode 141. Linked List Cycle
// 判断链表是否有环。使用哈希集合方法记录访问过的节点。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function hasCycle(head: ListNode | null): boolean {
  // 哈希集合记录已访问的节点引用
  const visited: Set<ListNode> = new Set();
  let cur: ListNode | null = head;
  while (cur !== null) {
    // 如果节点已经在集合中，说明有环
    if (visited.has(cur)) {
      return true;
    }
    visited.add(cur);
    cur = cur.next;
  }
  // 走到末尾，无环
  return false;
}

// 辅助函数：根据数组和位置构造带环链表
function buildCycleList(arr: number[], pos: number): ListNode | null {
  if (arr.length === 0) return null;
  const nodes: ListNode[] = arr.map((v) => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }
  // pos 表示尾节点连接到的节点索引，-1 表示无环
  if (pos !== -1) {
    nodes[nodes.length - 1].next = nodes[pos];
  }
  return nodes[0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 022. 环形链表 =====");
console.log(hasCycle(buildCycleList([3, 2, 0, -4], 1))); // true
console.log(hasCycle(buildCycleList([1, 2], 0))); // true
console.log(hasCycle(buildCycleList([1], -1))); // false
console.log(hasCycle(buildCycleList([1, 2, 3, 4], -1))); // false

export {};
