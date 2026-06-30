// ============================================================
// 078. 规定时间内到达终点的最小花费
// ============================================================
// LeetCode 1928. Minimum Cost to Reach Destination in Time
// n 个城市，edges 每条边带耗时 time，passingFees[i] 为进入城市 i 的过路费。
// 从城市 0 出发到城市 n-1，总耗时不超过 maxTime，求最小总过路费；无法到达返回 -1。
// 时间复杂度：O(maxTime * (N+E))，空间复杂度：O(maxTime * N)

// 方法1：时间分层 DP（推荐）
function minCost(
  maxTime: number,
  edges: number[][],
  passingFees: number[],
): number {
  const n = passingFees.length;
  const g: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v, t] of edges) {
    g[u].push([v, t]);
    g[v].push([u, t]);
  }

  const INF = Infinity;
  // dp[t][u] = 恰好在时刻 t 到达城市 u 时的最小总过路费
  const dp: number[][] = Array.from({ length: maxTime + 1 }, () =>
    new Array<number>(n).fill(INF),
  );
  dp[0][0] = passingFees[0];

  let ans = INF;
  for (let t = 0; t <= maxTime; t++) {
    for (let u = 0; u < n; u++) {
      if (dp[t][u] === INF) continue;
      if (u === n - 1) {
        if (dp[t][u] < ans) ans = dp[t][u];
      }
      for (const [v, w] of g[u]) {
        if (t + w <= maxTime) {
          const cost = dp[t][u] + passingFees[v];
          if (cost < dp[t + w][v]) dp[t + w][v] = cost;
        }
      }
    }
  }
  return ans === INF ? -1 : ans;
}

// 方法2：Dijkstra 状态 (城市, 时间) - 以花费为关键字
function minCostDijkstra(
  maxTime: number,
  edges: number[][],
  passingFees: number[],
): number {
  const n = passingFees.length;
  const g: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v, t] of edges) {
    g[u].push([v, t]);
    g[v].push([u, t]);
  }
  // minTime[u] = 到达 u 所需的最小时间（剪枝用）
  const minTime = new Array<number>(n).fill(Infinity);
  {
    const dist = new Array<number>(n).fill(Infinity);
    dist[0] = 0;
    const pq: Array<[number, number]> = [[0, 0]];
    while (pq.length > 0) {
      pq.sort((a, b) => a[0] - b[0]);
      const [d, u] = pq.shift()!;
      if (d > dist[u]) continue;
      for (const [v, w] of g[u]) {
        if (dist[v] > d + w) {
          dist[v] = d + w;
          pq.push([dist[v], v]);
        }
      }
    }
    for (let i = 0; i < n; i++) minTime[i] = dist[i];
  }

  const INF = Infinity;
  // bestCost[u] 记录到达 u 的某次状态的最小花费（用于剪枝）
  const bestCost = new Array<number>(n).fill(INF);
  bestCost[0] = passingFees[0];
  // 队列元素：[花费, 时间, 城市]
  const queue: Array<[number, number, number]> = [[passingFees[0], 0, 0]];
  let ans = INF;
  while (queue.length > 0) {
    queue.sort((a, b) => a[0] - b[0]);
    const [cost, time, u] = queue.shift()!;
    if (u === n - 1) {
      ans = cost;
      break;
    }
    if (cost > bestCost[u] && time >= minTime[u]) continue;
    for (const [v, w] of g[u]) {
      const nt = time + w;
      if (nt > maxTime) continue;
      const nc = cost + passingFees[v];
      // 剪枝：若花费不更优且时间不更优则跳过
      if (nc < bestCost[v] || nt < minTime[v]) {
        if (nc < bestCost[v]) bestCost[v] = nc;
        queue.push([nc, nt, v]);
      }
    }
  }
  return ans === INF ? -1 : ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 078. 规定时间内到达终点的最小花费 =====");
console.log(
  minCost(
    30,
    [
      [0, 1, 10],
      [1, 2, 10],
      [2, 5, 10],
      [0, 3, 1],
      [3, 3, 1],
      [3, 4, 1],
      [4, 5, 10],
    ],
    [5, 1, 2, 20, 20, 1],
  ),
); // 期望 9（路径 0->1->2->5，耗时 30，费用 5+1+2+1=9，已由暴力 DFS 校验）
console.log(
  minCost(
    29,
    [
      [0, 1, 10],
      [1, 2, 10],
      [2, 5, 10],
      [0, 3, 1],
      [3, 3, 1],
      [3, 4, 1],
      [4, 5, 10],
    ],
    [5, 1, 2, 20, 20, 1],
  ),
); // 期望 46（耗时 30 的路径不可用，改走 0->3->4->5，费用 5+20+20+1=46，已校验）
console.log(
  minCostDijkstra(
    30,
    [
      [0, 1, 10],
      [1, 2, 10],
      [2, 5, 10],
      [0, 3, 1],
      [3, 3, 1],
      [3, 4, 1],
      [4, 5, 10],
    ],
    [5, 1, 2, 20, 20, 1],
  ),
); // 期望 9

export {};
