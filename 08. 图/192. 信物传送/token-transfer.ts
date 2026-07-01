// ============================================================
// 192. 信物传送
// ============================================================
// 自定义题：n 节点图 edges 带权传送成本，从 start 出发收集所有信物
// （信物分布在 tokenNodes 指定的节点上）后送达 target 的最小成本。
// 等价于：访问给定节点集合的 TSP 变体，起点 start，终点 target。
// 思路：Floyd 预处理全源最短路 + 状压 DP（Bitmask TSP）。
// 时间复杂度：O(V^3 + 2^K · K^2)，K 为信物节点数。

interface TokenEdge {
  u: number;
  v: number;
  w: number;
}

// 方法1：Floyd + 状压 DP（推荐）
function tokenTransfer(
  n: number,
  edges: TokenEdge[],
  tokenNodes: number[],
  start: number,
  target: number,
): number {
  const INF = Number.POSITIVE_INFINITY;
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(INF));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const { u, v, w } of edges) {
    dist[u][v] = Math.min(dist[u][v], w);
    dist[v][u] = Math.min(dist[v][u], w);
  }
  // Floyd 全源最短路
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      if (dist[i][k] === INF) continue;
      for (let j = 0; j < n; j++) {
        if (dist[k][j] === INF) continue;
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  const K = tokenNodes.length;
  // 关键点集合：信物节点 + start + target
  // dp[mask][i] 表示已访问信物集合 mask，当前在第 i 个信物节点
  const dp: number[][] = Array.from({ length: 1 << K }, () => new Array(K).fill(INF));
  // 从 start 出发到各信物节点
  for (let i = 0; i < K; i++) {
    dp[1 << i][i] = dist[start][tokenNodes[i]];
  }
  for (let mask = 0; mask < 1 << K; mask++) {
    for (let i = 0; i < K; i++) {
      if ((mask & (1 << i)) === 0) continue;
      if (dp[mask][i] === INF) continue;
      for (let j = 0; j < K; j++) {
        if (mask & (1 << j)) continue;
        const nm = mask | (1 << j);
        const cost = dp[mask][i] + dist[tokenNodes[i]][tokenNodes[j]];
        if (cost < dp[nm][j]) dp[nm][j] = cost;
      }
    }
  }
  const full = (1 << K) - 1;
  let ans = INF;
  for (let i = 0; i < K; i++) {
    if (dp[full][i] === INF) continue;
    ans = Math.min(ans, dp[full][i] + dist[tokenNodes[i]][target]);
  }
  return ans === INF ? -1 : ans;
}

// 方法2：DFS 记忆化搜索（状压）
function tokenTransferDFS(
  n: number,
  edges: TokenEdge[],
  tokenNodes: number[],
  start: number,
  target: number,
): number {
  const INF = Number.POSITIVE_INFINITY;
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(INF));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const { u, v, w } of edges) {
    dist[u][v] = Math.min(dist[u][v], w);
    dist[v][u] = Math.min(dist[v][u], w);
  }
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      if (dist[i][k] === INF) continue;
      for (let j = 0; j < n; j++) {
        if (dist[k][j] === INF) continue;
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  const K = tokenNodes.length;
  const memo: Map<number, number> = new Map();

  function dfs(mask: number, cur: number): number {
    if (mask === (1 << K) - 1) return dist[cur][target];
    const key = mask * n + cur;
    if (memo.has(key)) return memo.get(key)!;
    let best = INF;
    for (let j = 0; j < K; j++) {
      if (mask & (1 << j)) continue;
      const sub = dfs(mask | (1 << j), tokenNodes[j]);
      if (sub === INF) continue;
      best = Math.min(best, dist[cur][tokenNodes[j]] + sub);
    }
    memo.set(key, best);
    return best;
  }

  let ans = INF;
  for (let i = 0; i < K; i++) {
    const sub = dfs(1 << i, tokenNodes[i]);
    if (sub === INF) continue;
    ans = Math.min(ans, dist[start][tokenNodes[i]] + sub);
  }
  return ans === INF ? -1 : ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 192. 信物传送 =====");

// 4 节点：0-1-2-3 链，信物在 1,2，start=0, target=3
// 路径 0->1->2->3 = 1+1+1 = 3
const edges1: TokenEdge[] = [
  { u: 0, v: 1, w: 1 },
  { u: 1, v: 2, w: 1 },
  { u: 2, v: 3, w: 1 },
];
console.log(tokenTransfer(4, edges1, [1, 2], 0, 3)); // 期望: 3
console.log(tokenTransferDFS(4, edges1, [1, 2], 0, 3)); // 期望: 3

// 三角形图，信物在 1,2，start=0, target=0
// 0->1->2->0 = 2+3+1 = 6
const edges2: TokenEdge[] = [
  { u: 0, v: 1, w: 2 },
  { u: 1, v: 2, w: 3 },
  { u: 2, v: 0, w: 1 },
];
console.log(tokenTransfer(3, edges2, [1, 2], 0, 0)); // 期望: 6
console.log(tokenTransferDFS(3, edges2, [1, 2], 0, 0)); // 期望: 6

export {};
