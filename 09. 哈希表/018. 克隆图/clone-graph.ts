// ============================================================
// 018. 克隆图
// ============================================================
// LeetCode 133. Clone Graph
// 给定无向连通图中一个节点的引用，返回该图的深拷贝（克隆）。
// 图中每个节点包含其值 val 和其邻居列表 neighbors。
// 使用哈希表存储已克隆的节点，BFS 遍历。
// 时间复杂度：O(V+E)，空间复杂度：O(V)，V 为节点数，E 为边数

class _Node {
  val: number;
  neighbors: _Node[];
  constructor(val?: number, neighbors?: _Node[]) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
  }
}

function cloneGraph(node: _Node | null): _Node | null {
  if (node === null) return null;

  // 哈希表：原节点 -> 克隆节点
  const visited = new Map<_Node, _Node>();
  const cloneStart = new _Node(node.val);
  visited.set(node, cloneStart);

  // BFS 队列
  const queue: _Node[] = [node];

  while (queue.length > 0) {
    const cur = queue.shift()!;
    const cloneCur = visited.get(cur)!;

    for (const neighbor of cur.neighbors) {
      if (!visited.has(neighbor)) {
        visited.set(neighbor, new _Node(neighbor.val));
        queue.push(neighbor);
      }
      // 把克隆的邻居加入到当前克隆节点的邻居列表
      cloneCur.neighbors.push(visited.get(neighbor)!);
    }
  }

  return cloneStart;
}

// 辅助函数：根据邻接表构造图
function buildGraph(adjList: number[][]): _Node | null {
  if (adjList.length === 0) return null;

  const nodes: _Node[] = [];
  for (let i = 0; i < adjList.length; i++) {
    nodes.push(new _Node(i + 1));
  }
  for (let i = 0; i < adjList.length; i++) {
    for (const idx of adjList[i]) {
      nodes[i].neighbors.push(nodes[idx - 1]);
    }
  }
  return nodes[0];
}

// 辅助函数：将图序列化为邻接表（用于测试）
function graphToAdjList(node: _Node | null): number[][] {
  if (node === null) return [];

  const visited = new Set<_Node>();
  const result: number[][] = [];
  const queue: _Node[] = [node];
  visited.add(node);

  while (queue.length > 0) {
    const cur = queue.shift()!;
    const neighbors: number[] = [];
    for (const n of cur.neighbors) {
      neighbors.push(n.val);
      if (!visited.has(n)) {
        visited.add(n);
        queue.push(n);
      }
    }
    neighbors.sort((a, b) => a - b);
    result.push(neighbors);
  }

  // 按 val 排序保证输出顺序稳定
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 018. 克隆图 =====");
const g1 = buildGraph([
  [2, 4],
  [1, 3],
  [2, 4],
  [1, 3],
]);
console.log(graphToAdjList(cloneGraph(g1))); // [[2,4],[1,3],[2,4],[1,3]]

const g2 = buildGraph([[]]);
console.log(graphToAdjList(cloneGraph(g2))); // [[]]

const g3 = buildGraph([[2], [1]]);
console.log(graphToAdjList(cloneGraph(g3))); // [[2],[1]]

export {};
