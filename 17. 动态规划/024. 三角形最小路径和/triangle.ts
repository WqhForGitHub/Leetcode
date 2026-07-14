// ============================================================
// 024. 三角形最小路径和
// ============================================================
// LeetCode 120. Triangle
// 给定三角形，从顶到底找最小路径和，每步只能走到下一行相邻位置。
// 时间复杂度 O(n²)，空间复杂度 O(n)

// 方法1：动态规划自底向上（推荐）
// dp[j] 表示从当前位置到底部的最小路径和
// 状态转移：dp[j] = triangle[i][j] + min(dp[j], dp[j+1])
// 时间复杂度 O(n²)，空间复杂度 O(n)
function minimumTotal(triangle: number[][]): number {
  const n: number = triangle.length;
  // dp 数组初始化为最后一行
  const dp: number[] = [...triangle[n - 1]];

  // 从倒数第二行开始自底向上递推
  for (let i: number = n - 2; i >= 0; i--) {
    for (let j: number = 0; j <= i; j++) {
      // 当前位置的最小路径和 = 当前值 + 下方两个位置的最小值
      dp[j] = triangle[i][j] + Math.min(dp[j], dp[j + 1]);
    }
  }

  return dp[0];
}

// 方法2：动态规划自顶向下
// dp[j] 表示从顶部到当前位置的最小路径和
// 时间复杂度 O(n²)，空间复杂度 O(n)
function minimumTotal2(triangle: number[][]): number {
  const n: number = triangle.length;
  const dp: number[] = new Array<number>(n).fill(0);
  dp[0] = triangle[0][0];

  for (let i: number = 1; i < n; i++) {
    // 从右往左更新，避免覆盖
    dp[i] = dp[i - 1] + triangle[i][i]; // 最右端只能从上一行最右端来
    for (let j: number = i - 1; j >= 1; j--) {
      // 中间元素取上方两个位置的最小值
      dp[j] = Math.min(dp[j], dp[j - 1]) + triangle[i][j];
    }
    dp[0] = dp[0] + triangle[i][0]; // 最左端只能从上一行最左端来
  }

  // 返回 dp 数组中的最小值
  let minResult: number = dp[0];
  for (let j: number = 1; j < n; j++) {
    minResult = Math.min(minResult, dp[j]);
  }
  return minResult;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 024. 三角形最小路径和 =====");
console.log(minimumTotal([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]])); // 期望结果: 11
console.log(minimumTotal([[-10]])); // 期望结果: -10
console.log(minimumTotal2([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]])); // 期望结果: 11
console.log(minimumTotal2([[-10]])); // 期望结果: -10
console.log(minimumTotal([[1], [2, 3]])); // 期望结果: 3

export {};
