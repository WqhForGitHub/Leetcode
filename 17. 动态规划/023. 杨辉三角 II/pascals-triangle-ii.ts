// ============================================================
// 023. 杨辉三角 II
// ============================================================
// LeetCode 119. Pascal's Triangle II
// 给定 rowIndex，返回杨辉三角的第 rowIndex 行（从 0 开始）。
// 时间复杂度 O(n²)，空间复杂度 O(n)

// 方法1：动态规划一维数组滚动更新（推荐）
// 从右往左更新，dp[j] = dp[j] + dp[j-1]
// 时间复杂度 O(n²)，空间复杂度 O(n)
function getRow(rowIndex: number): number[] {
  const dp: number[] = new Array<number>(rowIndex + 1).fill(0);
  dp[0] = 1;

  for (let i: number = 1; i <= rowIndex; i++) {
    // 从右往左更新，避免覆盖还未使用的值
    for (let j: number = i; j >= 1; j--) {
      dp[j] = dp[j] + dp[j - 1];
    }
  }

  return dp;
}

// 方法2：组合公式
// C(n,k) = C(n,k-1) * (n-k+1) / k
// 时间复杂度 O(n)，空间复杂度 O(n)
function getRow2(rowIndex: number): number[] {
  const result: number[] = [1];
  let prev: number = 1;

  for (let k: number = 1; k <= rowIndex; k++) {
    // C(n,k) = C(n,k-1) * (n-k+1) / k
    prev = Math.floor((prev * (rowIndex - k + 1)) / k);
    result.push(prev);
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 023. 杨辉三角 II =====");
console.log(getRow(3)); // 期望结果: [1,3,3,1]
console.log(getRow(0)); // 期望结果: [1]
console.log(getRow(1)); // 期望结果: [1,1]
console.log(getRow2(3)); // 期望结果: [1,3,3,1]
console.log(getRow2(4)); // 期望结果: [1,4,6,4,1]

export {};
