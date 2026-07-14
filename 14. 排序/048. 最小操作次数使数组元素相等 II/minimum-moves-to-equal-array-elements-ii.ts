// ============================================================
// 048. 最小操作次数使数组元素相等 II
// ============================================================
// LeetCode 462. Minimum Moves to Equal Array Elements II
// 每次操作可使某元素 +1 或 -1，求使所有元素相等的最少操作次数。
// 答案为所有元素到中位数的距离之和。

// 方法1：排序 + 中位数（推荐，O(n log n) 时间，O(log n) 空间）
// 排序后取中位数（任意一个中位数均可），所有元素到中位数的距离之和即为答案。
// 数学上可证明：中位数使绝对偏差之和最小。
function minMoves2_sort(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const median = nums[n >> 1]; // 取中间元素作为中位数

  let moves = 0;
  for (const num of nums) {
    moves += Math.abs(num - median);
  }
  return moves;
}

// 方法2：快速选择 + 中位数（O(n) 平均时间，O(log n) 空间，最坏 O(n^2)）
// 用快速选择（QuickSelect）以平均 O(n) 找到第 k 小的元素作为中位数，
// 再累加所有元素到中位数的距离。
function minMoves2_quickselect(nums: number[]): number {
  const n = nums.length;
  const k = n >> 1; // 中位数下标

  // 快速选择：找到排序后下标为 k 的元素（第 k+1 小）
  const median = quickSelect(nums, 0, n - 1, k);

  let moves = 0;
  for (const num of nums) {
    moves += Math.abs(num - median);
  }
  return moves;
}

// 快速选择实现：在 [left, right] 范围内找到排序后位于 index 的元素
function quickSelect(nums: number[], left: number, right: number, index: number): number {
  if (left === right) return nums[left];

  // Lomuto 分区
  const pivotIndex = partition(nums, left, right);

  if (pivotIndex === index) {
    return nums[pivotIndex];
  } else if (pivotIndex < index) {
    return quickSelect(nums, pivotIndex + 1, right, index);
  } else {
    return quickSelect(nums, left, pivotIndex - 1, index);
  }
}

// 分区：以最右元素为 pivot，返回 pivot 最终下标
function partition(nums: number[], left: number, right: number): number {
  const pivot = nums[right];
  let i = left;
  for (let j = left; j < right; j++) {
    if (nums[j] < pivot) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
      i++;
    }
  }
  [nums[i], nums[right]] = [nums[right], nums[i]];
  return i;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 048. 最小操作次数使数组元素相等 II =====");
console.log("排序法 [1,2,3]:", minMoves2_sort([1, 2, 3])); // 期望: 2
console.log("排序法 [1,10,2,9]:", minMoves2_sort([1, 10, 2, 9])); // 期望: 16
console.log("排序法 [1,0,0,1,6]:", minMoves2_sort([1, 0, 0, 1, 6])); // 期望: 7（中位数为 1，距离和 1+1+0+0+5=7）

console.log("快速选择 [1,2,3]:", minMoves2_quickselect([1, 2, 3])); // 期望: 2
console.log("快速选择 [1,10,2,9]:", minMoves2_quickselect([1, 10, 2, 9])); // 期望: 16
console.log("快速选择 [1,0,0,1,6]:", minMoves2_quickselect([1, 0, 0, 1, 6])); // 期望: 7

export {};
