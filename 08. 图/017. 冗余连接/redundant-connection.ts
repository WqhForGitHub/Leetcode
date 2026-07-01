// ============================================================
// 017. 冗余连接
// ============================================================
// LeetCode 684. Redundant Connection
// 无向图由一棵树加一条边形成，返回删去后可成树的边（输入中最后出现的那条）
// 时间复杂度：并查集 O(E·α(N))；DFS O(E^2)；空间 O(N)

// 方法1：并查集（推荐）—— 首次成环的边即为答案
function findRedundantConnection(edges: number[][]): number[] {
  let maxN = 0;
  for (const [u, v] of edges) maxN = Math.max(maxN, u, v);
  const parent: number[] = new Array(maxN + 1);
  const rank: number[] = new Array(maxN + 1).fill(0);
  for (let i = 0; i <= maxN; i++) parent[i] = i;

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (x: number, y: number): boolean => {
    let rx = find(x);
    let ry = find(y);
    if (rx === ry) return false;
    if (rank[rx] < rank[ry]) [rx, ry] = [ry, rx];
    parent[ry] = rx;
    if (rank[rx] === rank[ry]) rank[rx]++;
    return true;
  };

  for (const [u, v] of edges) {
    if (!union(u, v)) return [u, v];
  }
  return [];
}

// 方法2：DFS —— 逆序尝试删除每条边，若两端仍连通则该边冗余
function findRedundantConnectionDFS(edges: number[][]): number[] {
  const n = edges.length;
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);

  const buildExcept = (excludeIdx: number): void => {
    for (let i = 0; i <= n; i++) adj[i] = [];
    for (let i = 0; i < edges.length; i++) {
      if (i === excludeIdx) continue;
      const [u, v] = edges[i];
      adj[u].push(v);
      adj[v].push(u);
    }
  };
  const connected = (u: number, v: number): boolean => {
    const visited: boolean[] = new Array(n + 1).fill(false);
    const stack: number[] = [u];
    visited[u] = true;
    while (stack.length > 0) {
      const x = stack.pop()!;
      if (x === v) return true;
      for (const nb of adj[x]) {
        if (!visited[nb]) {
          visited[nb] = true;
          stack.push(nb);
        }
      }
    }
    return false;
  };

  for (let i = edges.length - 1; i >= 0; i--) {
    const [u, v] = edges[i];
    buildExcept(i);
    if (connected(u, v)) return [u, v];
  }
  return [];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 017. 冗余连接 =====");
console.log(
  findRedundantConnection([
    [1, 2],
    [1, 3],
    [2, 3],
  ]),
); // [2,3]
console.log(
  findRedundantConnectionDFS([
    [1, 2],
    [1, 3],
    [2, 3],
  ]),
); // [2,3]
console.log(
  findRedundantConnection([
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 4],
    [1, 5],
  ]),
); // [1,4]
console.log(
  findRedundantConnectionDFS([
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 4],
    [1, 5],
  ]),
); // [1,4]

export {};
