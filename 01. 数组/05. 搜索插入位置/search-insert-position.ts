// ============================================================
// 05. 搜索插入位置
// ============================================================
// LeetCode 35. Search Insert Position
// 给定排序数组和目标值，找到目标值的索引，如不存在则返回应插入的位置。
// 时间复杂度：O(log n)，空间复杂度：O(1)

// 方法1：二分查找-左闭右闭（推荐）
function searchInsert(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1; // 左闭右闭 [left, right]
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  // 退出时 left > right，left 即为应插入位置
  return left;
}

// 方法2：二分查找-左闭右开
function searchInsertOpenRight(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length; // 左闭右开 [left, right)
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid; // 右开区间，mid 不在范围内
    }
  }
  return left;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 05. 搜索插入位置 =====");
console.log("左闭右闭 [1,3,5,6], 5:", searchInsert([1, 3, 5, 6], 5)); // 期望结果 2
console.log("左闭右闭 [1,3,5,6], 2:", searchInsert([1, 3, 5, 6], 2)); // 期望结果 1
console.log("左闭右闭 [1,3,5,6], 7:", searchInsert([1, 3, 5, 6], 7)); // 期望结果 4
console.log("左闭右闭 [1,3,5,6], 0:", searchInsert([1, 3, 5, 6], 0)); // 期望结果 0
console.log("左闭右闭 [1], 0:", searchInsert([1], 0)); // 期望结果 0
console.log("左闭右开 [1,3,5,6], 5:", searchInsertOpenRight([1, 3, 5, 6], 5)); // 期望结果 2
console.log("左闭右开 [1,3,5,6], 2:", searchInsertOpenRight([1, 3, 5, 6], 2)); // 期望结果 1
console.log("左闭右开 [1,3,5,6], 7:", searchInsertOpenRight([1, 3, 5, 6], 7)); // 期望结果 4

export {};
