// ============================================================
// 035. 分割数组的最大值
// ============================================================
// LeetCode 410. Split Array Largest Sum
// 将非负整数数组分成 m 个非空连续子数组，最小化各子数组和的最大值。

// 方法1：二分查找（O(n log(sum))）
function splitArray(nums: number[], m: number): number {
  let left = Math.max(...nums);
  let right = nums.reduce((a, b) => a + b, 0);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canSplit(nums, m, mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

function canSplit(nums: number[], m: number, maxSum: number): boolean {
  let count = 1;
  let currentSum = 0;
  for (const num of nums) {
    if (currentSum + num > maxSum) {
      count++;
      currentSum = num;
      if (count > m) return false;
    } else {
      currentSum += num;
    }
  }
  return true;
}

// 方法2：动态规划（O(n² m)）
function splitArrayDP(nums: number[], m: number): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  // dp[i][j] = 前i个元素分成j段的最小最大和
  const dp: number[][] = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    dp[i] = new Array(m + 1).fill(Infinity);
  }
  dp[0][0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      for (let k = 0; k < i; k++) {
        dp[i][j] = Math.min(dp[i][j], Math.max(dp[k][j - 1], prefix[i] - prefix[k]));
      }
    }
  }
  return dp[n][m];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 035. 分割数组的最大值 =====");
console.log("二分 [7,2,5,10,8],2:", splitArray([7, 2, 5, 10, 8], 2)); // 18
console.log("DP [7,2,5,10,8],2:", splitArrayDP([7, 2, 5, 10, 8], 2)); // 18
console.log("二分 [1,2,3,4,5],2:", splitArray([1, 2, 3, 4, 5], 2)); // 9

export {};
