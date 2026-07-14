// ============================================================
// 084. 最大化一张图中的路径价值
// ============================================================
// LeetCode 2065. Maximum Path Quality of a Graph
// n 个节点 values，edges 耗时，maxTime 限制。从 0 出发在时间内返回 0，
// 节点价值只计一次。DFS 回溯求最大价值。
// 时间复杂度：O(指数级)，空间复杂度：O(n)

function maximalPathQuality(values: number[], edges: number[][], maxTime: number): number {
  const n: number = values.length;
  // 邻接表 [邻居, 耗时]
  const g: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, t] of edges) {
    g[u].push([v, t]);
    g[v].push([u, t]);
  }
  const visited: number[] = new Array(n).fill(0);
  let ans: number = 0;
  // DFS：当前节点、已用时间、累计价值
  const dfs = (u: number, usedTime: number, quality: number): void => {
    if (usedTime > maxTime) return;
    // 每次到达 0 都更新答案
    if (u === 0) ans = Math.max(ans, quality);
    for (const [v, t] of g[u]) {
      if (visited[v] === 0) {
        // 首次访问，加上价值
        visited[v] = 1;
        dfs(v, usedTime + t, quality + values[v]);
        visited[v] = 0;
      } else {
        // 重复访问，不加价值
        visited[v]++;
        dfs(v, usedTime + t, quality);
        visited[v]--;
      }
    }
  };
  visited[0] = 1;
  dfs(0, 0, values[0]);
  return ans;
}

// 方法1：DFS 回溯，visited 计数
function f1(values: number[], edges: number[][], maxTime: number): number {
  return maximalPathQuality(values, edges, maxTime);
}

// 方法2：DFS 回溯，用 Set 记录已访问节点
function f2(values: number[], edges: number[][], maxTime: number): number {
  const n: number = values.length;
  const g: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, t] of edges) {
    g[u].push([v, t]);
    g[v].push([u, t]);
  }
  const seen: Set<number> = new Set([0]);
  let ans: number = 0;
  const dfs = (u: number, usedTime: number, quality: number): void => {
    if (usedTime > maxTime) return;
    if (u === 0) ans = Math.max(ans, quality);
    for (const [v, t] of g[u]) {
      const isNew: boolean = !seen.has(v);
      if (isNew) seen.add(v);
      dfs(v, usedTime + t, isNew ? quality + values[v] : quality);
      if (isNew) seen.delete(v);
    }
  };
  dfs(0, 0, values[0]);
  return ans;
}

console.log("===== 084. 最大化一张图中的路径价值 =====");
// 测试
console.log(
  f1(
    [0, 32, 10, 43],
    [
      [0, 1, 10],
      [1, 2, 15],
      [0, 3, 10],
    ],
    49,
  ),
); // 75
console.log(
  f2(
    [0, 32, 10, 43],
    [
      [0, 1, 10],
      [1, 2, 15],
      [0, 3, 10],
    ],
    49,
  ),
); // 75
console.log(
  f1(
    [5, 10, 15, 20],
    [
      [0, 1, 10],
      [1, 2, 10],
      [0, 3, 10],
    ],
    30,
  ),
); // 25
console.log(
  f2(
    [5, 10, 15, 20],
    [
      [0, 1, 10],
      [1, 2, 10],
      [0, 3, 10],
    ],
    30,
  ),
); // 25

export {};
