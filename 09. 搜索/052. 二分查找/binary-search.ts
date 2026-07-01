// ============================================================
// 052. 二分查找
// ============================================================
// LeetCode 704. Binary Search
// 给定升序数组和目标值，返回目标值在数组中的索引，不存在返回 -1。

// 方法1：闭区间二分查找
function binarySearch704(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

// 方法2：左闭右开区间
function binarySearch704HalfOpen(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return -1;
}

// 方法3：递归
function binarySearch704Recursive(nums: number[], target: number): number {
  function helper(left: number, right: number): number {
    if (left > right) return -1;
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) return helper(mid + 1, right);
    return helper(left, mid - 1);
  }
  return helper(0, nums.length - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 052. 二分查找 =====");
console.log("闭区间 [-1,0,3,5,9,12],9:", binarySearch704([-1, 0, 3, 5, 9, 12], 9)); // 4
console.log("闭区间 [-1,0,3,5,9,12],2:", binarySearch704([-1, 0, 3, 5, 9, 12], 2)); // -1
console.log("半开 [-1,0,3,5,9,12],9:", binarySearch704HalfOpen([-1, 0, 3, 5, 9, 12], 9)); // 4
console.log("递归 [-1,0,3,5,9,12],2:", binarySearch704Recursive([-1, 0, 3, 5, 9, 12], 2)); // -1

export {};
