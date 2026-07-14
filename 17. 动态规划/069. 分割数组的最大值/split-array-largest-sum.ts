// ============================================================
// 069. 分割数组的最大值
// ============================================================
// LeetCode 410. Split Array Largest Sum
// 给定非负整数数组和整数 m，将数组分成 m 个连续子数组，使最大子数组和最小。
// 时间复杂度 O(n^2 * m)，空间复杂度 O(n * m)

// 方法1：动态规划（推荐）
// dp[i][j] = 前 i 个数分成 j 段的最小最大和
// 状态转移：dp[i][j] = min over k of max(dp[k][j-1], sum(k+1..i))
// 其中 k 从 j-1 到 i-1，表示前 k 个数分成 j-1 段，第 j 段是 k+1 到 i
// 时间复杂度 O(n^2 * m)，空间复杂度 O(n * m)
function splitArray(nums: number[], m: number): number {
  const n: number = nums.length;

  // 前缀和，prefix[i] = nums[0] + ... + nums[i-1]
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i: number = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // dp[i][j] 表示前 i 个数分成 j 段的最小最大和
  const dp: number[][] = new Array(n + 1);
  for (let i: number = 0; i <= n; i++) {
    dp[i] = new Array(m + 1).fill(Infinity);
  }
  dp[0][0] = 0;

  for (let i: number = 1; i <= n; i++) {
    for (let j: number = 1; j <= Math.min(i, m); j++) {
      // 前 k 个数分成 j-1 段，第 j 段是 [k, i)
      for (let k: number = j - 1; k < i; k++) {
        // 第 j 段的和为 prefix[i] - prefix[k]
        const currentSum: number = prefix[i] - prefix[k];
        dp[i][j] = Math.min(dp[i][j], Math.max(dp[k][j - 1], currentSum));
      }
    }
  }

  return dp[n][m];
}

// 方法2：二分 + 贪心
// 二分搜索最大子数组和的值，验证是否能分成不超过 m 段
// 时间复杂度 O(n * log(sum))，空间复杂度 O(1)
function splitArray2(nums: number[], m: number): number {
  // 二分搜索下界：单个元素最大值；上界：所有元素之和
  let left: number = 0;
  let right: number = 0;
  for (const num of nums) {
    left = Math.max(left, num);
    right += num;
  }

  // 验证：以 maxSum 为上限，最少需要分多少段
  function canSplit(maxSum: number): boolean {
    let count: number = 1; // 段数
    let currentSum: number = 0;
    for (const num of nums) {
      if (currentSum + num > maxSum) {
        count++;
        currentSum = num;
      } else {
        currentSum += num;
      }
    }
    return count <= m;
  }

  while (left < right) {
    const mid: number = Math.floor((left + right) / 2);
    if (canSplit(mid)) {
      right = mid; // 可以分，尝试更小的上限
    } else {
      left = mid + 1; // 不行，增大上限
    }
  }

  return left;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 069. 分割数组的最大值 =====");
console.log(splitArray([7, 2, 5, 10, 8], 2)); // 期望结果: 18
console.log(splitArray([1, 2, 3, 4, 5], 2)); // 期望结果: 9
console.log(splitArray([1, 4, 4], 3)); // 期望结果: 4
console.log(splitArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 3)); // 期望结果: 17

export {};
