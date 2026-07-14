// 169. 电网维护
// n 电站无向图 edges，某些故障需维护，从维修站出发访问所有故障电站最小总成本。
// 解法：Floyd 求最短路 + TSP 状压 DP。

function powerGridMaintenance(
  n: number,
  edges: [number, number, number][],
  faults: number[],
  depot: number,
): number {
  const INF = Infinity;
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(INF));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const [u, v, w] of edges) {
    dist[u][v] = Math.min(dist[u][v], w);
    dist[v][u] = Math.min(dist[v][u], w);
  }
  // Floyd
  for (let kk = 0; kk < n; kk++) {
    for (let i = 0; i < n; i++) {
      if (dist[i][kk] === INF) continue;
      for (let j = 0; j < n; j++) {
        if (dist[kk][j] === INF) continue;
        if (dist[i][kk] + dist[kk][j] < dist[i][j]) {
          dist[i][j] = dist[i][kk] + dist[kk][j];
        }
      }
    }
  }
  const m = faults.length;
  if (m === 0) return 0;
  // dp[mask][i] = 访问 mask 中故障，最后在 faults[i] 的最小成本
  const dp: number[][] = Array.from({ length: 1 << m }, () => new Array(m).fill(INF));
  for (let i = 0; i < m; i++) {
    dp[1 << i][i] = dist[depot][faults[i]];
  }
  for (let mask = 1; mask < 1 << m; mask++) {
    for (let i = 0; i < m; i++) {
      if (!(mask & (1 << i))) continue;
      if (dp[mask][i] === INF) continue;
      for (let j = 0; j < m; j++) {
        if (mask & (1 << j)) continue;
        const nmask = mask | (1 << j);
        const cost = dp[mask][i] + dist[faults[i]][faults[j]];
        if (cost < dp[nmask][j]) dp[nmask][j] = cost;
      }
    }
  }
  let ans = INF;
  const full = (1 << m) - 1;
  for (let i = 0; i < m; i++) ans = Math.min(ans, dp[full][i]);
  return ans === INF ? -1 : ans;
}

// 方法二：DFS 记忆化 TSP
function powerGridMaintenanceMemo(
  n: number,
  edges: [number, number, number][],
  faults: number[],
  depot: number,
): number {
  const INF = Infinity;
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(INF));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const [u, v, w] of edges) {
    dist[u][v] = Math.min(dist[u][v], w);
    dist[v][u] = Math.min(dist[v][u], w);
  }
  for (let kk = 0; kk < n; kk++) {
    for (let i = 0; i < n; i++) {
      if (dist[i][kk] === INF) continue;
      for (let j = 0; j < n; j++) {
        if (dist[kk][j] === INF) continue;
        if (dist[i][kk] + dist[kk][j] < dist[i][j]) dist[i][j] = dist[i][kk] + dist[kk][j];
      }
    }
  }
  const m = faults.length;
  if (m === 0) return 0;
  const memo = new Map<string, number>();
  const dfs = (mask: number, last: number): number => {
    if (mask === (1 << m) - 1) return 0;
    const key = `${mask},${last}`;
    if (memo.has(key)) return memo.get(key)!;
    let best = INF;
    for (let j = 0; j < m; j++) {
      if (mask & (1 << j)) continue;
      const from = last === -1 ? depot : faults[last];
      const cost = dist[from][faults[j]] + dfs(mask | (1 << j), j);
      best = Math.min(best, cost);
    }
    memo.set(key, best);
    return best;
  };
  const ans = dfs(0, -1);
  return ans === INF ? -1 : ans;
}

// 测试
console.log(
  powerGridMaintenance(
    5,
    [
      [0, 1, 2],
      [1, 2, 3],
      [2, 3, 1],
      [3, 4, 4],
      [0, 4, 10],
    ],
    [2, 3],
    0,
  ),
);
console.log(
  powerGridMaintenanceMemo(
    5,
    [
      [0, 1, 2],
      [1, 2, 3],
      [2, 3, 1],
      [3, 4, 4],
      [0, 4, 10],
    ],
    [2, 3],
    0,
  ),
);

export {};
