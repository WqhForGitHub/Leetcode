// ============================================================
// 247. 学生分数的最小差值
// ============================================================
// LeetCode 1984. Minimum Difference Between Highest and Lowest of K Scores
// 从 nums 中选 k 个元素，使最大值与最小值之差最小。返回最小差值。

// 方法1：排序 + 滑动窗口（O(n log n)）
function minimumDifference(nums: number[], k: number): number {
  if (k === 1) return 0;
  nums.sort((a, b) => a - b);
  let minDiff = Infinity;
  for (let i = 0; i + k - 1 < nums.length; i++) {
    minDiff = Math.min(minDiff, nums[i + k - 1] - nums[i]);
  }
  return minDiff;
}

// 方法2：排序 + 滑动窗口（显式双指针）（O(n log n)）
function minimumDifference2(nums: number[], k: number): number {
  if (k === 1) return 0;
  const n = nums.length;
  const sorted = [...nums].sort((a, b) => a - b);
  let left = 0;
  let right = k - 1;
  let best = Infinity;
  while (right < n) {
    best = Math.min(best, sorted[right] - sorted[left]);
    left++;
    right++;
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 247. 学生分数的最小差值 =====");
console.log("方法1:", minimumDifference([90], 1)); // 0
console.log("方法2:", minimumDifference2([90], 1)); // 0
console.log("方法1:", minimumDifference([9, 4, 1, 7], 2)); // 2
console.log("方法2:", minimumDifference2([9, 4, 1, 7], 2)); // 2

export {};
