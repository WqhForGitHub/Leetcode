// ============================================================
// 021. 最长递增子序列
// ============================================================
// LeetCode 300. Longest Increasing Subsequence
// 给定整数数组，找到其中最长严格递增子序列的长度。

// 方法1：二分查找 + 贪心（O(n log n)）
function lengthOfLIS(nums: number[]): number {
  const tails: number[] = []; // tails[i] 为长度 i+1 的子序列的最小尾元素
  for (const num of nums) {
    let left = 0;
    let right = tails.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    if (left === tails.length) {
      tails.push(num);
    } else {
      tails[left] = num;
    }
  }
  return tails.length;
}

// 方法2：动态规划（O(n²)）
function lengthOfLISDP(nums: number[]): number {
  const n = nums.length;
  const dp = new Array(n).fill(1);
  let maxLen = 1;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 021. 最长递增子序列 =====");
console.log("二分 [10,9,2,5,3,7,101,18]:", lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4
console.log("二分 [0,1,0,3,2,3]:", lengthOfLIS([0, 1, 0, 3, 2, 3])); // 4
console.log("DP [10,9,2,5,3,7,101,18]:", lengthOfLISDP([10, 9, 2, 5, 3, 7, 101, 18])); // 4

export {};
