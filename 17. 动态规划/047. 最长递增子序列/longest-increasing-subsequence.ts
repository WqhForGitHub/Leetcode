// ============================================================
// 047. 最长递增子序列
// ============================================================
// LeetCode 300. Longest Increasing Subsequence
// 给定整数数组，返回最长严格递增子序列的长度。
// 时间复杂度 O(n²) 或 O(n log n)

// 方法1：动态规划（推荐）
// dp[i] 表示以 nums[i] 结尾的最长递增子序列长度
// 状态转移：dp[i] = max(dp[j] + 1) for all j < i and nums[j] < nums[i]
// 时间复杂度 O(n²)，空间复杂度 O(n)
function lengthOfLIS(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;

  // dp[i] 表示以 nums[i] 结尾的最长递增子序列长度
  const dp: number[] = new Array<number>(n).fill(1);
  let maxLen: number = 1;

  for (let i: number = 1; i < n; i++) {
    for (let j: number = 0; j < i; j++) {
      // 只有前面的数更小才能构成递增子序列
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }

  return maxLen;
}

// 方法2：二分查找 + 贪心
// 维护一个递增数组 tails，tails[i] 表示长度为 i+1 的递增子序列的最小末尾值
// 对每个数用二分查找确定其在 tails 中的位置
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function lengthOfLIS2(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;

  // tails[i] 表示长度为 i+1 的递增子序列的最小末尾元素
  const tails: number[] = [];
  tails.push(nums[0]);

  for (let i: number = 1; i < n; i++) {
    if (nums[i] > tails[tails.length - 1]) {
      // 比末尾大，直接扩展
      tails.push(nums[i]);
    } else {
      // 二分查找第一个 >= nums[i] 的位置并替换
      let left: number = 0;
      let right: number = tails.length - 1;
      while (left < right) {
        const mid: number = Math.floor((left + right) / 2);
        if (tails[mid] < nums[i]) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }
      tails[left] = nums[i];
    }
  }

  return tails.length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 047. 最长递增子序列 =====");
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 期望结果: 4
console.log(lengthOfLIS([0, 1, 0, 3, 2, 3])); // 期望结果: 4
console.log(lengthOfLIS([7, 7, 7, 7])); // 期望结果: 1
console.log(lengthOfLIS2([10, 9, 2, 5, 3, 7, 101, 18])); // 期望结果: 4
console.log(lengthOfLIS2([1, 3, 6, 7, 9, 4, 10, 5, 6])); // 期望结果: 6

export {};
