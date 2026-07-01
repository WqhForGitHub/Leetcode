// ============================================================
// 050. 连通网络的操作次数
// ============================================================
// LeetCode 1319. Number of Operations to Make Network Connected
// n 台电脑，connections 网线。最少几次操作（拔一根插另一处）使全部连通，
// 不可行返回 -1。操作数 = 连通分量数 - 1；前提是冗余线 >= 连通分量数 - 1。
// 时间复杂度：O(n + E)，空间复杂度：O(n + E)

// 方法1：并查集（推荐）
function makeConnected(n: number, connections: number[][]): number {
  // 网线数不够：n 台电脑至少需要 n-1 条线
  if (connections.length < n - 1) return -1;

  const parent: number[] = new Array(n).fill(0).map((_, i) => i);
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

  for (const [u, v] of connections) {
    union(u, v);
  }

  // 统计连通分量数
  let components = 0;
  for (let i = 0; i < n; i++) {
    if (parent[i] === i) components++;
  }
  // 把 components 个连通分量连起来需要 components - 1 次操作
  return components - 1;
}

// 方法2：DFS 求连通分量数
function makeConnectedDFS(n: number, connections: number[][]): number {
  if (connections.length < n - 1) return -1;

  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of connections) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const visited: boolean[] = new Array(n).fill(false);
  const dfs = (u: number): void => {
    visited[u] = true;
    for (const v of graph[u]) {
      if (!visited[v]) dfs(v);
    }
  };

  let components = 0;
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      components++;
      dfs(i);
    }
  }
  return components - 1;
}

// 方法3：BFS 求连通分量数
function makeConnectedBFS(n: number, connections: number[][]): number {
  if (connections.length < n - 1) return -1;

  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of connections) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const visited: boolean[] = new Array(n).fill(false);
  let components = 0;
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      components++;
      const queue: number[] = [i];
      visited[i] = true;
      while (queue.length > 0) {
        const u = queue.shift()!;
        for (const v of graph[u]) {
          if (!visited[v]) {
            visited[v] = true;
            queue.push(v);
          }
        }
      }
    }
  }
  return components - 1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 050. 连通网络的操作次数 =====");
console.log(
  "并查集:",
  makeConnected(4, [
    [0, 1],
    [0, 2],
    [1, 2],
  ]),
); // 期望 1
console.log(
  "并查集:",
  makeConnected(6, [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
  ]),
); // 期望 2
console.log(
  "并查集 已连通:",
  makeConnected(6, [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 5],
  ]),
); // 期望 0（线足够且已全部连通）
console.log(
  "并查集 线不足:",
  makeConnected(5, [
    [0, 1],
    [2, 3],
  ]),
); // 期望 -1
console.log(
  "DFS:",
  makeConnectedDFS(4, [
    [0, 1],
    [0, 2],
    [1, 2],
  ]),
); // 期望 1
console.log(
  "BFS:",
  makeConnectedBFS(6, [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
  ]),
); // 期望 2

export {};
