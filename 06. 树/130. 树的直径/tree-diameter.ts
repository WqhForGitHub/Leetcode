// ============================================================
// 130. 树的直径
// ============================================================
// LeetCode 1245. Tree Diameter
// 给定一棵无向树（用边表示），返回树的直径。
// 直径是树中任意两节点之间最长路径的边数。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：两次BFS（推荐）
// 1) 从任意节点（如 0）出发 BFS 找到最远节点 u
// 2) 从 u 出发 BFS 找到最远节点 v，u 到 v 的距离即为直径
function treeDiameter(edges: number[][]): number {
  if (edges.length === 0) return 0;

  // 建立邻接表
  const adj = new Map<number, number[]>();
  for (const [u, v] of edges) {
    if (!adj.has(u)) adj.set(u, []);
    if (!adj.has(v)) adj.set(v, []);
    adj.get(u)!.push(v);
    adj.get(v)!.push(u);
  }

  // 第一次 BFS 从任意节点出发，找到最远节点
  const farthest1 = bfs(adj, edges[0][0]);
  // 第二次 BFS 从最远节点出发，距离即为直径
  const farthest2 = bfs(adj, farthest1.node);
  return farthest2.dist;
}

function bfs(adj: Map<number, number[]>, start: number): { node: number; dist: number } {
  const visited = new Set<number>([start]);
  const queue: [number, number][] = [[start, 0]];
  let farthest = { node: start, dist: 0 };

  while (queue.length > 0) {
    const [node, dist] = queue.shift()!;
    if (dist > farthest.dist) {
      farthest = { node, dist };
    }
    const neighbors = adj.get(node) ?? [];
    for (const next of neighbors) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([next, dist + 1]);
      }
    }
  }
  return farthest;
}

// 方法2：DFS
// 对于每个节点，计算到其子树中最远叶节点的距离
// 经过该节点的最长路径 = 两个最长子路径之和
// 维护全局最大值
let diameter: number;
function treeDiameterDFS(edges: number[][]): number {
  if (edges.length === 0) return 0;

  const adj = new Map<number, number[]>();
  for (const [u, v] of edges) {
    if (!adj.has(u)) adj.set(u, []);
    if (!adj.has(v)) adj.set(v, []);
    adj.get(u)!.push(v);
    adj.get(v)!.push(u);
  }

  diameter = 0;
  const visited = new Set<number>();
  // 从节点 0 开始 DFS
  visited.add(edges[0][0]);
  dfs(edges[0][0], adj, visited);
  return diameter;
}

// 返回从当前节点出发到子树中最远叶节点的距离（边数）
function dfs(node: number, adj: Map<number, number[]>, visited: Set<number>): number {
  // 收集所有子节点的最长路径
  let max1 = 0; // 最长
  let max2 = 0; // 次长
  const neighbors = adj.get(node) ?? [];
  for (const next of neighbors) {
    if (visited.has(next)) continue;
    visited.add(next);
    const childDist = dfs(next, adj, visited) + 1;
    if (childDist > max1) {
      max2 = max1;
      max1 = childDist;
    } else if (childDist > max2) {
      max2 = childDist;
    }
  }
  // 经过当前节点的最长路径
  diameter = Math.max(diameter, max1 + max2);
  return max1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 130. 树的直径 =====");

// 测试1: edges = [[0,1],[0,2]]
//   0
//  / \
// 1   2
// 直径 = 2
console.log(
  "测试1 BFS:",
  treeDiameter([
    [0, 1],
    [0, 2],
  ]),
); // 期望 2
console.log(
  "测试1 DFS:",
  treeDiameterDFS([
    [0, 1],
    [0, 2],
  ]),
); // 期望 2

// 测试2: edges = [[0,1],[1,2],[2,3],[1,4],[4,5]]
//     0
//     |
//     1
//    / \
//   2   4
//   |   |
//   3   5
// 直径路径：3-2-1-4-5，长度 4
console.log(
  "测试2 BFS:",
  treeDiameter([
    [0, 1],
    [1, 2],
    [2, 3],
    [1, 4],
    [4, 5],
  ]),
); // 期望 4
console.log(
  "测试2 DFS:",
  treeDiameterDFS([
    [0, 1],
    [1, 2],
    [2, 3],
    [1, 4],
    [4, 5],
  ]),
); // 期望 4

// 测试3: 单边 [[0,1]]
console.log("测试3 BFS:", treeDiameter([[0, 1]])); // 期望 1

export {};
