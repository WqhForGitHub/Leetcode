// ============================================================
// 022. 判断二分图
// ============================================================
// LeetCode 785. Is Graph Bipartite
// 给定无向图邻接表 graph，判断是否为二分图（能否把节点分成两个集合，
// 使每条边连接不同集合的节点）。
// 时间复杂度：O(V+E)，空间复杂度：O(V)

// 方法1：BFS 染色（推荐）
// 思路：用 0/1 两种颜色交替染色相邻节点，若冲突则非二分图。
function isBipartiteBFS(graph: number[][]): boolean {
  const n = graph.length;
  const color: number[] = new Array(n).fill(-1); // -1 未染色，0/1 两种颜色

  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue;
    const queue: number[] = [start];
    color[start] = 0;
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of graph[u]) {
        if (color[v] === -1) {
          color[v] = color[u] ^ 1;
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;
        }
      }
    }
  }
  return true;
}

// 方法2：DFS 染色
// 思路：递归染色，相邻节点染相反颜色，发现同色邻居则返回 false。
function isBipartiteDFS(graph: number[][]): boolean {
  const n = graph.length;
  const color: number[] = new Array(n).fill(-1);

  function dfs(u: number, c: number): boolean {
    color[u] = c;
    for (const v of graph[u]) {
      if (color[v] === -1) {
        if (!dfs(v, c ^ 1)) return false;
      } else if (color[v] === c) {
        return false;
      }
    }
    return true;
  }

  for (let i = 0; i < n; i++) {
    if (color[i] === -1 && !dfs(i, 0)) return false;
  }
  return true;
}

// 方法3：并查集
// 思路：同一节点的所有邻居必属同一集合（与该节点相反的集合）。
// 把每个节点的邻居 union 起来；若某条边两端已在同一集合则非二分图。
function isBipartiteUF(graph: number[][]): boolean {
  const n = graph.length;
  const parent: number[] = Array.from({ length: n }, (_, i) => i);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x: number, y: number): void {
    parent[find(x)] = find(y);
  }

  for (let u = 0; u < n; u++) {
    for (const v of graph[u]) {
      if (find(u) === find(v)) return false; // 相邻同集，冲突
      // 将 u 的所有邻居归到同一集合
      if (graph[u].length > 0) {
        const first = graph[u][0];
        union(first, v);
      }
    }
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 022. 判断二分图 =====");

console.log(
  isBipartiteBFS([
    [1, 2, 3],
    [0, 2],
    [0, 1, 3],
    [0, 2],
  ]),
); // 期望: false
console.log(
  isBipartiteBFS([
    [1, 3],
    [0, 2],
    [1, 3],
    [0, 2],
  ]),
); // 期望: true

console.log(
  isBipartiteDFS([
    [1, 2, 3],
    [0, 2],
    [0, 1, 3],
    [0, 2],
  ]),
); // 期望: false
console.log(
  isBipartiteDFS([
    [1, 3],
    [0, 2],
    [1, 3],
    [0, 2],
  ]),
); // 期望: true

console.log(
  isBipartiteUF([
    [1, 2, 3],
    [0, 2],
    [0, 1, 3],
    [0, 2],
  ]),
); // 期望: false
console.log(
  isBipartiteUF([
    [1, 3],
    [0, 2],
    [1, 3],
    [0, 2],
  ]),
); // 期望: true

export {};
