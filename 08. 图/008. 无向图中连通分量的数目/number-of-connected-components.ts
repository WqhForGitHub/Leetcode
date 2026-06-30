// ============================================================
// 008. 无向图中连通分量的数目
// ============================================================
// LeetCode 323. Number of Connected Components in an Undirected Graph
// n 个节点，edges 无向边，返回连通分量数。
// 时间复杂度：O(N α(N) + E) ~ O(N + E)，空间复杂度：O(N)

// 方法1：并查集（推荐）
function countComponentsUF(n: number, edges: number[][]): number {
  const parent = new Array(n).fill(0).map((_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]; // 路径压缩
      x = parent[x];
    }
    return x;
  };
  const union = (x: number, y: number): void => {
    parent[find(x)] = find(y);
  };
  for (const [u, v] of edges) union(u, v);
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (parent[i] === i) count++;
  }
  return count;
}

// 方法2：DFS
function countComponentsDFS(n: number, edges: number[][]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const visited = new Array(n).fill(false);
  let count = 0;
  const dfs = (u: number): void => {
    visited[u] = true;
    for (const v of adj[u]) {
      if (!visited[v]) dfs(v);
    }
  };
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      count++;
      dfs(i);
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 008. 无向图中连通分量的数目 =====");
console.log("UF:", countComponentsUF(5, [[0, 1], [1, 2], [3, 4]])); // 期望 2
console.log("DFS:", countComponentsDFS(5, [[0, 1], [1, 2], [3, 4]])); // 期望 2
console.log("UF:", countComponentsUF(5, [[0, 1], [1, 2], [2, 3], [3, 4]])); // 期望 1
console.log("DFS:", countComponentsDFS(5, [[0, 1], [1, 2], [2, 3], [3, 4]])); // 期望 1
console.log("UF:", countComponentsUF(3, [])); // 期望 3
console.log("DFS:", countComponentsDFS(3, [])); // 期望 3

export {};
