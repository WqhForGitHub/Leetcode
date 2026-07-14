// ============================================================
// 108. 最长和谐子序列
// ============================================================
// LeetCode 594. Longest Harmonious Subsequence
// 和谐数组指最大值与最小值之差恰好为 1。给定整数数组，求最长和谐子序列长度。
// 子序列可不连续。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 思路：哈希表统计每个数出现次数
// 对每个数 x，和谐子序列由 x 和 x+1 组成，长度为 count[x] + count[x+1]
function findLHS(nums: number[]): number {
  const count = new Map<number, number>();
  for (const num of nums) {
    count.set(num, (count.get(num) || 0) + 1);
  }

  let maxLen = 0;
  for (const [num, cnt] of count) {
    if (count.has(num + 1)) {
      maxLen = Math.max(maxLen, cnt + count.get(num + 1)!);
    }
  }
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 108. 最长和谐子序列 =====");
// 测试 1
console.log(findLHS([1, 3, 2, 2, 5, 2, 3, 7])); // 期望: 5 ([3,2,2,2,3])
// 测试 2
console.log(findLHS([1, 2, 3, 4])); // 期望: 2
// 测试 3: 无和谐子序列
console.log(findLHS([1, 1, 1, 1])); // 期望: 0

export {};
