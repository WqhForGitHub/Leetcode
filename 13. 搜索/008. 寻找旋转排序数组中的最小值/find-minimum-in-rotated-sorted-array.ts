// ============================================================
// 008. 寻找旋转排序数组中的最小值
// ============================================================
// LeetCode 153. Find Minimum in Rotated Sorted Array
// 旋转后的升序数组（无重复元素），找出其中最小元素。
// 时间复杂度 O(log n)。

// 方法1：二分查找（与右端点比较）
function findMin(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[right]) {
      // 最小值在右半部分
      left = mid + 1;
    } else {
      // 最小值在左半部分（含 mid）
      right = mid;
    }
  }
  return nums[left];
}

// 方法2：二分查找（与左端点比较）
function findMinByLeft(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  let left = 0;
  let right = nums.length - 1;
  // 如果已经有序
  if (nums[right] > nums[0]) return nums[0];
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[mid + 1]) return nums[mid + 1];
    if (nums[mid - 1] > nums[mid]) return nums[mid];
    if (nums[mid] > nums[0]) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 008. 寻找旋转排序数组中的最小值 =====");
console.log("右端点 [3,4,5,1,2]:", findMin([3, 4, 5, 1, 2])); // 1
console.log("右端点 [4,5,6,7,0,1,2]:", findMin([4, 5, 6, 7, 0, 1, 2])); // 0
console.log("左端点 [3,4,5,1,2]:", findMinByLeft([3, 4, 5, 1, 2])); // 1

export {};
