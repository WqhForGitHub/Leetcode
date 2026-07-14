// ============================================================
// 049. 戳气球
// ============================================================
// LeetCode 312. Burst Balloons
// n 个气球有分数，戳破气球 i 得到 nums[i-1]*nums[i]*nums[i+1] 分，求最大分数。
// 时间复杂度 O(n³)，空间复杂度 O(n²)

// 方法1：动态规划（推荐）
// dp[i][j] 表示戳破开区间 (i, j) 内所有气球的最大得分
// 状态转移：dp[i][j] = max(dp[i][k] + nums[i]*nums[k]*nums[j] + dp[k][j])
// 其中 k 是 (i, j) 中最后被戳破的气球
// 时间复杂度 O(n³)，空间复杂度 O(n²)
function maxCoins(nums: number[]): number {
  const n: number = nums.length;
  // 在首尾各添加一个虚拟气球，值为1
  const arr: number[] = [1, ...nums, 1];
  const m: number = arr.length;

  // dp[i][j] 表示戳破开区间 (i, j) 内所有气球的最大得分
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(m).fill(0));

  // len 表示开区间长度，从2开始（至少间隔一个气球）
  for (let len: number = 2; len < m; len++) {
    for (let i: number = 0; i + len < m; i++) {
      const j: number = i + len;
      // k 是 (i, j) 中最后被戳破的气球
      for (let k: number = i + 1; k < j; k++) {
        // 戳破 k 时，k 左右相邻的就是 i 和 j（因为中间的都已被戳破）
        const coins: number = arr[i] * arr[k] * arr[j];
        dp[i][j] = Math.max(dp[i][j], dp[i][k] + coins + dp[k][j]);
      }
    }
  }

  // 返回戳破 (0, m-1) 开区间内所有气球的最大得分
  return dp[0][m - 1];
}

// 方法2：记忆化递归
// 自顶向下递归，用 memo 记录已计算的结果
// 时间复杂度 O(n³)，空间复杂度 O(n²)
function maxCoins2(nums: number[]): number {
  const arr: number[] = [1, ...nums, 1];
  const m: number = arr.length;
  const memo: number[][] = Array.from({ length: m }, () => new Array<number>(m).fill(-1));

  // 递归求解戳破开区间 (i, j) 内所有气球的最大得分
  function solve(i: number, j: number): number {
    if (i + 1 === j) return 0; // 区间内没有气球
    if (memo[i][j] !== -1) return memo[i][j];

    let result: number = 0;
    for (let k: number = i + 1; k < j; k++) {
      // k 是最后被戳破的气球
      const coins: number = arr[i] * arr[k] * arr[j];
      result = Math.max(result, solve(i, k) + coins + solve(k, j));
    }

    memo[i][j] = result;
    return result;
  }

  return solve(0, m - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 049. 戳气球 =====");
console.log(maxCoins([3, 1, 5, 8])); // 期望结果: 167
console.log(maxCoins([1, 5])); // 期望结果: 10
console.log(maxCoins2([3, 1, 5, 8])); // 期望结果: 167
console.log(maxCoins([1])); // 期望结果: 1

export {};
