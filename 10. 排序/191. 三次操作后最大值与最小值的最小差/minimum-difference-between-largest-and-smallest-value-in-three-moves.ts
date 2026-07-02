// ============================================================
// 191. 三次操作后最大值与最小值的最小差
// ============================================================
// LeetCode 1509. Minimum Difference Between Largest and Smallest Value in Three Moves
// 给定数组 nums，最多进行 3 次操作（每次可将一个元素改为任意值），
// 求操作后数组最大值与最小值之差的最小值。

// 方法1：排序 + 枚举 4 种情况（O(n log n)）
// 3 次操作等价于可丢弃两端共 3 个元素，保留长度 n-3 的窗口。
function minDifference(nums: number[]): number {
  const n = nums.length;
  if (n <= 4) return 0;
  nums.sort((a, b) => a - b);
  // 4 种丢弃方案：左丢 i 个、右丢 3-i 个
  let result = Infinity;
  for (let i = 0; i <= 3; i++) {
    result = Math.min(result, nums[n - 1 - (3 - i)] - nums[i]);
  }
  return result;
}

// 方法2：排序 + 滑动窗口（O(n log n)）
// 在排序数组上取长度为 n-3 的窗口，最小化窗口内 max-min。
function minDifference2(nums: number[]): number {
  const n = nums.length;
  if (n <= 4) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const windowSize = n - 3;
  let result = Infinity;
  for (let i = 0; i + windowSize - 1 < n; i++) {
    result = Math.min(result, sorted[i + windowSize - 1] - sorted[i]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 191. 三次操作后最大值与最小值的最小差 =====");
console.log("方法1 [5,3,2,4]:", minDifference([5, 3, 2, 4])); // 0
console.log("方法1 [1,5,0,10,14]:", minDifference([1, 5, 0, 10, 14])); // 1
console.log("方法1 [6,6,0,1,1,4,6]:", minDifference([6, 6, 0, 1, 1, 4, 6])); // 2
console.log("方法2 [5,3,2,4]:", minDifference2([5, 3, 2, 4])); // 0
console.log("方法2 [1,5,0,10,14]:", minDifference2([1, 5, 0, 10, 14])); // 1
console.log("方法2 [6,6,0,1,1,4,6]:", minDifference2([6, 6, 0, 1, 1, 4, 6])); // 2

export {};
