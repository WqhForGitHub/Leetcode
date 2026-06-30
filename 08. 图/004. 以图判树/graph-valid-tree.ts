// ============================================================
// 004. 以图判树
// ============================================================
// LeetCode 261. Graph Valid Tree
// n 个节点 [0,n-1]，edges 无向边。判断是否为有效树（连通且无环，等价于连通且边数=n-1）。
// 时间复杂度：O(N α(N)) ~ O(N)，空间复杂度：O(N)

// 方法1：并查集（检测环 + 连通）（推荐）
// 1) 边数 != n-1 直接 false；2) 逐条合并，若两端已同集合则存在环；3) 边数=n-1 且无环必然连通。
function validTreeUF(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false; // 树的必要条件
  const parent = new Array(n).fill(0).map((_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]; // 路径压缩
      x = parent[x];
    }
    return x;
  };
  const union = (x: number, y: number): boolean => {
    const px = find(x);
    const py = find(y);
    if (px === py) return false; // 已同集合，出现环
    parent[px] = py;
    return true;
  };
  for (const [u, v] of edges) {
    if (!union(u, v)) return false; // 环
  }
  return true;
}

// 方法2：DFS 检测环 + 连通
// 建无向邻接表，DFS 避免走父节点回边；遇到已访问的非父节点则存在环；最后访问数=n 才连通。
function validTreeDFS(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const visited = new Array(n).fill(false);
  const dfs = (u: number, parent: number): boolean => {
    visited[u] = true;
    for (const v of adj[u]) {
      if (v === parent) continue;
      if (visited[v]) return false; // 环
      if (!dfs(v, u)) return false;
    }
    return true;
  };
  if (!dfs(0, -1)) return false;
  return visited.every((v) => v); // 全连通
}

// ============================================================
// 测试
// ============================================================
console.log("===== 004. 以图判树 =====");
console.log("UF:", validTreeUF(5, [[0, 1], [0, 2], [0, 3], [1, 4]])); // 期望 true
console.log("DFS:", validTreeDFS(5, [[0, 1], [0, 2], [0, 3], [1, 4]])); // 期望 true
console.log("UF:", validTreeUF(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]])); // 期望 false（有环）
console.log("DFS:", validTreeDFS(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]])); // 期望 false
console.log("UF:", validTreeUF(4, [[0, 1], [2, 3]])); // 期望 false（不连通）
console.log("DFS:", validTreeDFS(4, [[0, 1], [2, 3]])); // 期望 false

export {};
