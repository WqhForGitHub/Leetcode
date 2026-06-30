// ============================================================
// 001. 克隆图
// ============================================================
// LeetCode 133. Clone Graph
// 给定连通无向图中一个节点的引用，返回该图的深拷贝。每个节点包含 val 与 neighbors。
// 时间复杂度：O(V + E)，空间复杂度：O(V)

class Node {
  val: number;
  neighbors: Node[];
  constructor(val?: number, neighbors?: Node[]) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
  }
}

// 方法1：DFS 递归 + HashMap（推荐）
// 用 Map 记录 原节点 -> 克隆节点，避免重复克隆与死循环。
function cloneGraphDFS(node: Node | null): Node | null {
  if (node === null) return null;
  const visited = new Map<Node, Node>();
  const dfs = (n: Node): Node => {
    if (visited.has(n)) return visited.get(n)!;
    const clone = new Node(n.val);
    visited.set(n, clone);
    for (const nb of n.neighbors) {
      clone.neighbors.push(dfs(nb));
    }
    return clone;
  };
  return dfs(node);
}

// 方法2：BFS + HashMap
// 队列遍历原图，逐个克隆节点并在弹栈时连接邻居。
function cloneGraphBFS(node: Node | null): Node | null {
  if (node === null) return null;
  const visited = new Map<Node, Node>();
  const queue: Node[] = [node];
  visited.set(node, new Node(node.val));
  while (queue.length > 0) {
    const cur = queue.shift()!;
    for (const nb of cur.neighbors) {
      if (!visited.has(nb)) {
        visited.set(nb, new Node(nb.val));
        queue.push(nb);
      }
      visited.get(cur)!.neighbors.push(visited.get(nb)!);
    }
  }
  return visited.get(node)!;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 001. 克隆图 =====");
// 构造 1--2--3--4--1 环形图
const n1 = new Node(1);
const n2 = new Node(2);
const n3 = new Node(3);
const n4 = new Node(4);
n1.neighbors = [n2, n4];
n2.neighbors = [n1, n3];
n3.neighbors = [n2, n4];
n4.neighbors = [n1, n3];

const cloneA = cloneGraphDFS(n1);
const cloneB = cloneGraphBFS(n1);
console.log("DFS 克隆起点 val:", cloneA?.val); // 期望 1
console.log("DFS 克隆邻居:", cloneA?.neighbors.map((n) => n.val)); // 期望 [2, 4]
console.log("BFS 克隆起点 val:", cloneB?.val); // 期望 1
console.log("BFS 克隆邻居:", cloneB?.neighbors.map((n) => n.val)); // 期望 [2, 4]
console.log("DFS 与原图不同对象:", cloneA !== n1); // 期望 true
console.log("空图:", cloneGraphDFS(null)); // 期望 null

export {};
