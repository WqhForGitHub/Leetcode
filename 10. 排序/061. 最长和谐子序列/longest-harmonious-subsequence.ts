// ============================================================
// 061. 最长和谐子序列
// ============================================================
// LeetCode 594. Longest Harmonious Subsequence
// 和谐数组是指最大值与最小值之差恰好为 1 的数组。
// 给定整数数组，求最长和谐子序列的长度（子序列可不连续），不存在则返回 0。

// 方法1：哈希表计数（推荐，O(n) 时间，O(n) 空间）
// 统计每个数字出现次数，对每个 x 检查 x 与 x+1 出现次数之和取最大。
function findLHS(nums: number[]): number {
  const count = new Map<number, number>();
  for (const num of nums) {
    count.set(num, (count.get(num) ?? 0) + 1);
  }

  let maxLen = 0;
  for (const [x, c] of count) {
    const cNext = count.get(x + 1);
    if (cNext !== undefined) {
      maxLen = Math.max(maxLen, c + cNext);
    }
  }
  return maxLen;
}

// 方法2：排序 + 滑动窗口（O(n log n) 时间，O(1) 额外空间）
// 排序后用滑动窗口维护 [left, right]，保证窗口内最大值 - 最小值 <= 1。
// 当差值恰好为 1 时更新答案。
function findLHSSort(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let left = 0;
  let maxLen = 0;
  for (let right = 0; right < n; right++) {
    // 收缩窗口直到窗口内最大 - 最小 <= 1
    while (nums[right] - nums[left] > 1) {
      left++;
    }
    if (nums[right] - nums[left] === 1) {
      maxLen = Math.max(maxLen, right - left + 1);
    }
  }
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 061. 最长和谐子序列 =====");
console.log("哈希法 [1,3,2,2,5,2,3,7]:", findLHS([1, 3, 2, 2, 5, 2, 3, 7])); // 期望 5
console.log("哈希法 [1,2,3,4]:", findLHS([1, 2, 3, 4])); // 期望 2
console.log("哈希法 [1,1,1,1]:", findLHS([1, 1, 1, 1])); // 期望 0
console.log("排序法 [1,3,2,2,5,2,3,7]:", findLHSSort([1, 3, 2, 2, 5, 2, 3, 7])); // 期望 5
console.log("排序法 [1,2,3,4]:", findLHSSort([1, 2, 3, 4])); // 期望 2
console.log("排序法 [1,1,1,1]:", findLHSSort([1, 1, 1, 1])); // 期望 0

export {};
