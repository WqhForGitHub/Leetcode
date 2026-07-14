// ============================================================
// 059. 最短无序连续子数组
// ============================================================
// LeetCode 581. Shortest Unsorted Continuous Subarray
// 给定一个整数数组，找出最短的一个连续子数组，使得只要把这个子数组排序，
// 整个数组就变成升序。返回该子数组的长度。

// 方法1：排序后逐位比较（O(n log n) 时间，O(n) 空间）
// 将原数组排序，从左右两端找到第一个与原数组不同的位置。
function findUnsortedSubarray(nums: number[]): number {
  const n = nums.length;
  const sorted = [...nums].sort((a, b) => a - b);
  let left = 0;
  let right = n - 1;
  while (left < n && nums[left] === sorted[left]) left++;
  while (right >= 0 && nums[right] === sorted[right]) right--;
  // 若已经有序，left > right，长度为 0
  return Math.max(0, right - left + 1);
}

// 方法2：一次扫描找边界（推荐，O(n) 时间，O(1) 空间）
// 从左到右维护最大值，记录最后一次"当前值小于最大值"的位置（即右边界）；
// 从右到左维护最小值，记录最后一次"当前值大于最小值"的位置（即左边界）。
function findUnsortedSubarrayOnePass(nums: number[]): number {
  const n = nums.length;
  if (n <= 1) return 0;

  // 找右边界：从左向右扫描，maxSeen 为已扫描部分最大值
  let maxSeen = -Infinity;
  let end = -1;
  for (let i = 0; i < n; i++) {
    if (nums[i] < maxSeen) {
      end = i; // 当前值偏小，说明它需要被包含进待排序区间
    } else {
      maxSeen = nums[i];
    }
  }

  // 找左边界：从右向左扫描，minSeen 为已扫描部分最小值
  let minSeen = Infinity;
  let start = 0;
  for (let i = n - 1; i >= 0; i--) {
    if (nums[i] > minSeen) {
      start = i; // 当前值偏大，说明它需要被包含进待排序区间
    } else {
      minSeen = nums[i];
    }
  }

  return end === -1 ? 0 : end - start + 1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 059. 最短无序连续子数组 =====");
console.log("排序法 [2,6,4,8,10,9,15]:", findUnsortedSubarray([2, 6, 4, 8, 10, 9, 15])); // 期望 5
console.log("排序法 [1,2,3,4]:", findUnsortedSubarray([1, 2, 3, 4])); // 期望 0
console.log("排序法 [1]:", findUnsortedSubarray([1])); // 期望 0
console.log("一次扫描 [2,6,4,8,10,9,15]:", findUnsortedSubarrayOnePass([2, 6, 4, 8, 10, 9, 15])); // 期望 5
console.log("一次扫描 [1,2,3,4]:", findUnsortedSubarrayOnePass([1, 2, 3, 4])); // 期望 0
console.log("一次扫描 [1]:", findUnsortedSubarrayOnePass([1])); // 期望 0
console.log("一次扫描 [1,3,2,2,2]:", findUnsortedSubarrayOnePass([1, 3, 2, 2, 2])); // 期望 4

export {};
