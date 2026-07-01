// ============================================================
// 004. 搜索插入位置
// ============================================================
// LeetCode 35. Search Insert Position
// 给定排序数组和目标值，找到目标值的索引；若不存在，返回它将会被按顺序插入的位置。
// 时间复杂度 O(log n)。

// 方法1：标准二分查找（左边界）
function searchInsert(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

// 方法2：半开区间二分
function searchInsertHalfOpen(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 004. 搜索插入位置 =====");
console.log("标准 [1,3,5,6],5:", searchInsert([1, 3, 5, 6], 5)); // 2
console.log("标准 [1,3,5,6],2:", searchInsert([1, 3, 5, 6], 2)); // 1
console.log("标准 [1,3,5,6],7:", searchInsert([1, 3, 5, 6], 7)); // 4
console.log("标准 [1,3,5,6],0:", searchInsert([1, 3, 5, 6], 0)); // 0
console.log("半开 [1,3,5,6],7:", searchInsertHalfOpen([1, 3, 5, 6], 7)); // 4

export {};
