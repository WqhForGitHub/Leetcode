// ============================================================
// 028. 访问所有节点的最短路径
// ============================================================
// LeetCode 847. Shortest Path Visiting All Nodes
// 无向图 graph（邻接表），可重复访问节点、可重复走边。
// 求访问所有节点的最短路径长度（边数）。
// 时间复杂度：O(n * 2^n)，空间复杂度：O(n * 2^n)

// 方法1：BFS（状态 = (节点, 已访问位掩码)）（推荐）
// 思路：用位掩码记录已访问节点集合。BFS 每走一步路径长度 +1。
// 当某状态的掩码变为全 1 时返回当前步数。
// 用 visited[mask][node] 防止重复扩展同一状态。
function shortestPathLength(graph: number[][]): number {
  const n = graph.length;
  const fullMask = (1 << n) - 1;

  // visited[mask][node]：是否已入队
  const visited: boolean[][] = Array.from({ length: 1 << n }, () =>
    new Array(n).fill(false),
  );

  const queue: number[][] = []; // [node, mask, dist]
  // 每个节点都可作为起点
  for (let i = 0; i < n; i++) {
    queue.push([i, 1 << i, 0]);
    visited[1 << i][i] = true;
  }

  while (queue.length > 0) {
    const [u, mask, dist] = queue.shift()!;
    if (mask === fullMask) return dist;
    for (const v of graph[u]) {
      const newMask = mask | (1 << v);
      if (!visited[newMask][v]) {
        visited[newMask][v] = true;
        queue.push([v, newMask, dist + 1]);
      }
    }
  }
  return -1; // 不可达（连通图不会到这里）
}

// 方法2：预处理两点最短路 + 状压 DP
// 思路：先用 BFS 求任意两点最短路 dist[i][j]，再用 DP[mask][i] 表示
// 已访问 mask 集合且当前在 i 的最短路径，转移到 j。
// 适合 n 较小、需要精确最短路的场景。
function shortestPathLengthDP(graph: number[][]): number {
  const n = graph.length;
  const INF = Number.MAX_SAFE_INTEGER >> 1;

  // BFS 求任意两点最短路
  const dist: number[][] = Array.from({ length: n }, () =>
    new Array(n).fill(INF),
  );
  for (let s = 0; s < n; s++) {
    dist[s][s] = 0;
    const queue: number[] = [s];
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of graph[u]) {
        if (dist[s][v] > dist[s][u] + 1) {
          dist[s][v] = dist[s][u] + 1;
          queue.push(v);
        }
      }
    }
  }

  const fullMask = (1 << n) - 1;
  // dp[mask][i]：访问 mask 且终点在 i 的最短路径长度
  const dp: number[][] = Array.from({ length: 1 << n }, () =>
    new Array(n).fill(INF),
  );
  for (let i = 0; i < n; i++) dp[1 << i][i] = 0;

  for (let mask = 1; mask <= fullMask; mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue;
      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue; // 已访问
        const newMask = mask | (1 << v);
        if (dp[newMask][v] > dp[mask][u] + dist[u][v]) {
          dp[newMask][v] = dp[mask][u] + dist[u][v];
        }
      }
    }
  }

  let ans = INF;
  for (let i = 0; i < n; i++) ans = Math.min(ans, dp[fullMask][i]);
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 028. 访问所有节点的最短路径 =====");

console.log(shortestPathLength([[1, 2, 3], [0], [0], [0]])); // 期望: 4
console.log(shortestPathLength([[1], [0, 2, 4], [1, 3, 4], [2], [1, 2]])); // 期望: 4

console.log(shortestPathLengthDP([[1, 2, 3], [0], [0], [0]])); // 期望: 4
console.log(shortestPathLengthDP([[1], [0, 2, 4], [1, 3, 4], [2], [1, 2]])); // 期望: 4

export {};
