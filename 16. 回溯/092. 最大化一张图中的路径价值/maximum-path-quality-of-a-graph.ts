// ============================================================
// 092. 最大化一张图中的路径价值
// ============================================================
// LeetCode 2065. Maximum Path Quality of a Graph
// 给定无向图（边权为时间）、节点价值和 maxTime，
// 从节点 0 出发并在 0 结束，路径总时间不超过 maxTime，可重复访问节点但价值只计一次，求最大价值。
// 时间复杂度：O(分支^深度), 空间复杂度：O(n)

// 方法1：DFS回溯+访问计数 (推荐)
// 用 visited[i] 标记是否已访问过；DFS 每条边扩展，时间不够则剪枝。
// 时间复杂度 O(分支^深度), 空间复杂度 O(n)
function maximalPathQuality(values: number[], edges: number[][], maxTime: number): number {
  const n: number = values.length;
  // 邻接表
  const adj: number[][][] = Array.from({ length: n }, () => []);
  for (const [u, v, t] of edges) {
    adj[u].push([v, t]);
    adj[v].push([u, t]);
  }

  let answer: number = 0;
  const visited: number[] = new Array(n).fill(0);
  visited[0] = 1;

  const dfs = (node: number, time: number, value: number): void => {
    // 回到 0 才是合法路径终点，更新答案
    if (node === 0) {
      answer = Math.max(answer, value);
    }
    for (const [nxt, t] of adj[node]) {
      if (time + t > maxTime) continue;
      if (visited[nxt] === 0) {
        visited[nxt] = 1;
        dfs(nxt, time + t, value + values[nxt]);
        visited[nxt] = 0;
      } else {
        // 重复访问，价值不增加
        dfs(nxt, time + t, value);
      }
    }
  };

  dfs(0, 0, values[0]);
  return answer;
}

// 方法2：DFS+剪枝 (Dijkstra 预处理最短路)
// 预处理 dist[i] = 从 i 回到 0 的最短时间，若 time + dist[nxt] > maxTime 则剪枝。
// 时间复杂度 O(n^2 + 分支^深度), 空间复杂度 O(n)
function maximalPathQuality2(values: number[], edges: number[][], maxTime: number): number {
  const n: number = values.length;
  const adj: number[][][] = Array.from({ length: n }, () => []);
  for (const [u, v, t] of edges) {
    adj[u].push([v, t]);
    adj[v].push([u, t]);
  }

  // Dijkstra 从 0 出发，求各点到 0 的最短时间
  const dist: number[] = new Array(n).fill(Infinity);
  dist[0] = 0;
  const visited2: boolean[] = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    // 找未访问中 dist 最小的
    let u: number = -1;
    let best: number = Infinity;
    for (let j = 0; j < n; j++) {
      if (!visited2[j] && dist[j] < best) {
        best = dist[j];
        u = j;
      }
    }
    if (u === -1) break;
    visited2[u] = true;
    for (const [v, t] of adj[u]) {
      if (dist[v] > dist[u] + t) dist[v] = dist[u] + t;
    }
  }

  let answer: number = 0;
  const visited: number[] = new Array(n).fill(0);
  visited[0] = 1;

  const dfs = (node: number, time: number, value: number): void => {
    if (node === 0) answer = Math.max(answer, value);
    for (const [nxt, t] of adj[node]) {
      // 剪枝：移动到 nxt 后还需至少 dist[nxt] 时间回到 0
      if (time + t + dist[nxt] > maxTime) continue;
      if (visited[nxt] === 0) {
        visited[nxt] = 1;
        dfs(nxt, time + t, value + values[nxt]);
        visited[nxt] = 0;
      } else {
        dfs(nxt, time + t, value);
      }
    }
  };

  dfs(0, 0, values[0]);
  return answer;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 092. 最大化一张图中的路径价值 =====");
console.log(
  maximalPathQuality(
    [0, 32, 10, 43],
    [
      [0, 1, 10],
      [1, 2, 15],
      [0, 3, 10],
    ],
    49,
  ),
); // 期望结果: 75
console.log(
  maximalPathQuality2(
    [0, 32, 10, 43],
    [
      [0, 1, 10],
      [1, 2, 15],
      [0, 3, 10],
    ],
    49,
  ),
); // 期望结果: 75

export {};
