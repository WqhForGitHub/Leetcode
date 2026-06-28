// ============================================================
// 023. 环形链表 II
// ============================================================
// LeetCode 142. Linked List Cycle II
// 找到环的入口节点。使用哈希集合方法记录访问过的节点。
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

function detectCycle(head: ListNode | null): ListNode | null {
  // 哈希集合记录已访问的节点引用
  const visited: Set<ListNode> = new Set();
  let cur: ListNode | null = head;
  while (cur !== null) {
    // 第一个重复出现的节点即为环的入口
    if (visited.has(cur)) {
      return cur;
    }
    visited.add(cur);
    cur = cur.next;
  }
  // 无环
  return null;
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
console.log("===== 023. 环形链表 II =====");
const node1 = detectCycle(buildCycleList([3, 2, 0, -4], 1));
console.log(node1 ? node1.val : null); // 2 (入口节点)
const node2 = detectCycle(buildCycleList([1, 2], 0));
console.log(node2 ? node2.val : null); // 1 (入口节点)
const node3 = detectCycle(buildCycleList([1], -1));
console.log(node3 ? node3.val : null); // null (无环)
const node4 = detectCycle(buildCycleList([1, 2, 3, 4, 5], 2));
console.log(node4 ? node4.val : null); // 3 (入口节点)

export {};
