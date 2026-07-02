// ============================================================
// 162. 跳跃游戏 V
// ============================================================
// LeetCode 1340. Jump Game V
// 给定数组 arr 和整数 d。从下标 i 可以跳到下标 j（|i-j|<=d），要求路径上所有中间元素
// 都严格小于 arr[i]，且 arr[j] < arr[i]。可任选起点，求最多能访问的下标个数。

// 方法1：记忆化 DFS（O(n*d)）
function maxJumps1(arr: number[], d: number): number {
  const n = arr.length;
  const memo = new Array<number>(n).fill(0);
  const dfs = (i: number): number => {
    if (memo[i] > 0) return memo[i];
    let best = 1;
    // 向右跳
    for (let j = i + 1; j <= Math.min(n - 1, i + d); j++) {
      if (arr[j] >= arr[i]) break;
      best = Math.max(best, 1 + dfs(j));
    }
    // 向左跳
    for (let j = i - 1; j >= Math.max(0, i - d); j--) {
      if (arr[j] >= arr[i]) break;
      best = Math.max(best, 1 + dfs(j));
    }
    memo[i] = best;
    return best;
  };
  let ans = 0;
  for (let i = 0; i < n; i++) ans = Math.max(ans, dfs(i));
  return ans;
}

// 方法2：按值升序 DP（O(n log n + n*d)）
// 先按 arr 值升序处理，保证计算 dp[i] 时所有更低值的 dp[j] 已就绪。
function maxJumps2(arr: number[], d: number): number {
  const n = arr.length;
  const dp = new Array<number>(n).fill(1);
  const idx = arr.map((_, i) => i).sort((a, b) => arr[a] - arr[b]);
  for (const i of idx) {
    // 向右跳：所有可达 j 的 arr[j] < arr[i]，dp[j] 已计算
    for (let j = i + 1; j <= Math.min(n - 1, i + d); j++) {
      if (arr[j] >= arr[i]) break;
      dp[i] = Math.max(dp[i], 1 + dp[j]);
    }
    // 向左跳
    for (let j = i - 1; j >= Math.max(0, i - d); j--) {
      if (arr[j] >= arr[i]) break;
      dp[i] = Math.max(dp[i], 1 + dp[j]);
    }
  }
  return Math.max(...dp);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 162. 跳跃游戏 V =====");
console.log("方法1:", maxJumps1([6, 4, 14, 6, 8, 13, 9, 7, 10, 6, 12], 2)); // 4
console.log("方法2:", maxJumps2([6, 4, 14, 6, 8, 13, 9, 7, 10, 6, 12], 2)); // 4
console.log("方法1:", maxJumps1([3, 3, 3, 3, 3], 3)); // 1
console.log("方法2:", maxJumps2([3, 3, 3, 3, 3], 3)); // 1

export {};
