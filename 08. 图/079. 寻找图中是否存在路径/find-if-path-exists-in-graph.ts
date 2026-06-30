// ============================================================
// 079. 寻找图中是否存在路径
// ============================================================
// LeetCode 1971. Find if Path Exists in Graph
// 给定 n 个节点的无向图 edges，判断从 source 到 destination 是否存在路径。
// 时间复杂度：O(N+E)，空间复杂度：O(N+E)

// 方法1：并查集（推荐）
function validPath(n: number, edges: number[][], source: number, destination: number): boolean {
  const parent = new Array<number>(n);
  for (let i = 0; i < n; i++) parent[i] = i;
  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(x: number, y: number): void {
    parent[find(x)] = find(y);
  }
  for (const [u, v] of edges) union(u, v);
  return find(source) === find(destination);
}

// 方法2：DFS
function validPathDFS(n: number, edges: number[][], source: number, destination: number): boolean {
  if (source === destination) return true;
  const g: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    g[u].push(v);
    g[v].push(u);
  }
  const visited = new Array<boolean>(n).fill(false);
  function dfs(u: number): boolean {
    if (u === destination) return true;
    visited[u] = true;
    for (const v of g[u]) {
      if (!visited[v] && dfs(v)) return true;
    }
    return false;
  }
  return dfs(source);
}

// 方法3：BFS
function validPathBFS(n: number, edges: number[][], source: number, destination: number): boolean {
  if (source === destination) return true;
  const g: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    g[u].push(v);
    g[v].push(u);
  }
  const visited = new Array<boolean>(n).fill(false);
  visited[source] = true;
  const queue: number[] = [source];
  while (queue.length > 0) {
    const u = queue.shift()!;
    if (u === destination) return true;
    for (const v of g[u]) {
      if (!visited[v]) {
        visited[v] = true;
        queue.push(v);
      }
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 079. 寻找图中是否存在路径 =====");
console.log(
  validPath(
    3,
    [
      [0, 1],
      [1, 2],
      [2, 0],
    ],
    0,
    2,
  ),
); // 期望 true
console.log(
  validPath(
    6,
    [
      [0, 1],
      [0, 2],
      [3, 5],
      [5, 4],
      [4, 3],
    ],
    0,
    5,
  ),
); // 期望 false
console.log(
  validPathDFS(
    3,
    [
      [0, 1],
      [1, 2],
    ],
    0,
    2,
  ),
); // 期望 true
console.log(
  validPathBFS(
    3,
    [
      [0, 1],
      [1, 2],
    ],
    0,
    2,
  ),
); // 期望 true

export {};
