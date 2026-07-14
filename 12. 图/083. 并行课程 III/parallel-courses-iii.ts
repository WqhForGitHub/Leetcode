// ============================================================
// 083. 并行课程 III
// ============================================================
// LeetCode 2050. Parallel Courses III
// n 门课，relations 给出先修依赖，time[i] 为课程 i 的完成时长，可并行修读。
// 求完成所有课程的最少月数。拓扑排序 + DP 最长路径。
// 时间复杂度：O(n + m)，空间复杂度：O(n + m)

function minimumTime(n: number, relations: number[][], time: number[]): number {
  // 建图与入度
  const g: number[][] = Array.from({ length: n }, () => []);
  const indeg: number[] = new Array(n).fill(0);
  for (const [u, v] of relations) {
    g[u - 1].push(v - 1);
    indeg[v - 1]++;
  }
  // dp[i] 完成课程 i 的最早时间（含自身耗时）
  const dp: number[] = new Array(n).fill(0);
  const queue: number[] = [];
  for (let i: number = 0; i < n; i++) {
    if (indeg[i] === 0) {
      dp[i] = time[i];
      queue.push(i);
    }
  }
  let head: number = 0;
  while (head < queue.length) {
    const u: number = queue[head++];
    for (const v of g[u]) {
      dp[v] = Math.max(dp[v], dp[u] + time[v]);
      indeg[v]--;
      if (indeg[v] === 0) queue.push(v);
    }
  }
  let ans: number = 0;
  for (let i: number = 0; i < n; i++) ans = Math.max(ans, dp[i]);
  return ans;
}

// 方法1：拓扑排序 + DP
function f1(n: number, relations: number[][], time: number[]): number {
  return minimumTime(n, relations, time);
}

// 方法2：记忆化 DFS 求关键路径
function f2(n: number, relations: number[][], time: number[]): number {
  const g: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of relations) g[u - 1].push(v - 1);
  const memo: number[] = new Array(n).fill(-1);
  const dfs = (u: number): number => {
    if (memo[u] !== -1) return memo[u];
    let maxPrev: number = 0;
    for (const v of g[u]) maxPrev = Math.max(maxPrev, dfs(v));
    return (memo[u] = maxPrev + time[u]);
  };
  let ans: number = 0;
  for (let i: number = 0; i < n; i++) ans = Math.max(ans, dfs(i));
  return ans;
}

console.log("===== 083. 并行课程 III =====");
// 测试
console.log(
  f1(
    3,
    [
      [1, 3],
      [2, 3],
    ],
    [3, 2, 5],
  ),
); // 8
console.log(
  f2(
    3,
    [
      [1, 3],
      [2, 3],
    ],
    [3, 2, 5],
  ),
); // 8
console.log(
  f1(
    5,
    [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
    [1, 1, 1, 1, 1],
  ),
); // 5
console.log(
  f2(
    5,
    [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
    [1, 1, 1, 1, 1],
  ),
); // 5

export {};
