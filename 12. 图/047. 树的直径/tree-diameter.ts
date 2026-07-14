// ============================================================
// 047. 树的直径
// ============================================================
// LeetCode 1245. Tree Diameter
// 无向树 edges，返回直径（最长路径边数）。
// 方法：两次 BFS（任一点找最远点 A，再从 A 找最远点）、树形 DP。
// 时间复杂度：O(V)，空间复杂度：O(V)

// 方法1：两次 BFS（推荐）
function treeDiameterBFS(edges: number[][]): number {
  if (edges.length === 0) return 0;

  const graph: Map<number, number[]> = new Map();
  for (const [u, v] of edges) {
    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }

  // BFS 返回 [最远节点, 距离]
  const bfs = (start: number): [number, number] => {
    const visited = new Set<number>([start]);
    const queue: Array<[number, number]> = [[start, 0]];
    let farthest: [number, number] = [start, 0];
    while (queue.length > 0) {
      const [u, d] = queue.shift()!;
      if (d > farthest[1]) farthest = [u, d];
      for (const v of graph.get(u) ?? []) {
        if (!visited.has(v)) {
          visited.add(v);
          queue.push([v, d + 1]);
        }
      }
    }
    return farthest;
  };

  const startNode = edges[0][0];
  const [farA] = bfs(startNode);
  const [, diameter] = bfs(farA);
  return diameter;
}

// 方法2：树形 DP（DFS，对每个节点记录经过它的最长路径）
function treeDiameterDP(edges: number[][]): number {
  if (edges.length === 0) return 0;

  const graph: Map<number, number[]> = new Map();
  for (const [u, v] of edges) {
    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }

  let diameter = 0;

  // 返回从 node 出发向下的最长路径长度（边数），parent 防止回走
  const dfs = (node: number, parent: number): number => {
    let max1 = 0; // 最长子路径
    let max2 = 0; // 次长子路径
    for (const child of graph.get(node) ?? []) {
      if (child === parent) continue;
      const childDepth = dfs(child, node) + 1;
      if (childDepth > max1) {
        max2 = max1;
        max1 = childDepth;
      } else if (childDepth > max2) {
        max2 = childDepth;
      }
    }
    // 经过 node 的最长路径 = max1 + max2
    diameter = Math.max(diameter, max1 + max2);
    return max1;
  };

  dfs(edges[0][0], -1);
  return diameter;
}

// 方法3：两次 DFS（递归版）
function treeDiameterDFS(edges: number[][]): number {
  if (edges.length === 0) return 0;

  const graph: Map<number, number[]> = new Map();
  for (const [u, v] of edges) {
    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }

  let farNode = edges[0][0];
  let maxDist = 0;

  const dfs = (node: number, parent: number, dist: number): void => {
    if (dist > maxDist) {
      maxDist = dist;
      farNode = node;
    }
    for (const child of graph.get(node) ?? []) {
      if (child !== parent) dfs(child, node, dist + 1);
    }
  };

  dfs(edges[0][0], -1, 0); // 第一次找最远点
  maxDist = 0;
  dfs(farNode, -1, 0); // 第二次从最远点再找最远
  return maxDist;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 047. 树的直径 =====");
console.log(
  "BFS:",
  treeDiameterBFS([
    [0, 1],
    [1, 2],
    [2, 3],
    [1, 4],
    [4, 5],
  ]),
); // 期望 4
console.log(
  "DP:",
  treeDiameterDP([
    [0, 1],
    [1, 2],
    [2, 3],
    [1, 4],
    [4, 5],
  ]),
); // 期望 4
console.log(
  "DFS:",
  treeDiameterDFS([
    [0, 1],
    [1, 2],
    [2, 3],
    [1, 4],
    [4, 5],
  ]),
); // 期望 4
console.log("BFS 单边:", treeDiameterBFS([[0, 1]])); // 期望 1
console.log(
  "BFS 三节点:",
  treeDiameterBFS([
    [0, 1],
    [0, 2],
  ]),
); // 期望 2

export {};
