// ============================================================
// 080. 最长等差数列
// ============================================================
// LeetCode 1027. Longest Arithmetic Subsequence
// 给定整数数组，返回最长等差子序列的长度。

// 方法1：动态规划（O(n²)）
function longestArithSeqLength(nums: number[]): number {
  const n = nums.length;
  if (n <= 2) return n;
  // dp[i][d] = 以 nums[i] 结尾，公差为 d 的最长等差子序列长度
  const dp: Map<number, number>[] = new Array(n);
  for (let i = 0; i < n; i++) dp[i] = new Map();
  let maxLen = 2;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      const diff = nums[i] - nums[j];
      const prevLen = dp[j].get(diff) || 1;
      dp[i].set(diff, prevLen + 1);
      maxLen = Math.max(maxLen, dp[i].get(diff)!);
    }
  }
  return maxLen;
}

// 方法2：动态规划（偏移数组优化，适合公差范围小）
function longestArithSeqLengthOffset(nums: number[]): number {
  const n = nums.length;
  if (n <= 2) return n;
  const offset = 500; // 公差范围 [-500, 500]
  const dp: number[][] = new Array(n);
  for (let i = 0; i < n; i++) {
    dp[i] = new Array(1001).fill(1);
  }
  let maxLen = 2;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      const diff = nums[i] - nums[j] + offset;
      dp[i][diff] = dp[j][diff] + 1;
      maxLen = Math.max(maxLen, dp[i][diff]);
    }
  }
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 080. 最长等差数列 =====");
console.log("DP [3,6,9,12]:", longestArithSeqLength([3, 6, 9, 12])); // 4
console.log("DP [9,4,7,2,10]:", longestArithSeqLength([9, 4, 7, 2, 10])); // 3
console.log("DP [20,1,15,3,10,5,8]:", longestArithSeqLength([20, 1, 15, 3, 10, 5, 8])); // 4
console.log("偏移 [3,6,9,12]:", longestArithSeqLengthOffset([3, 6, 9, 12])); // 4

export {};
