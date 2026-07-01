// ============================================================
// 007. 搜索旋转排序数组 II
// ============================================================
// LeetCode 81. Search in Rotated Sorted Array II
// 旋转后的升序数组中可能包含重复元素，判断目标值是否在数组中。

// 方法1：二分查找（处理重复元素时跳过）
function searchII(nums: number[], target: number): boolean {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return true;
    // 处理重复元素：无法判断哪侧有序
    if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
      left++;
      right--;
    } else if (nums[left] <= nums[mid]) {
      // 左半部分有序
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // 右半部分有序
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return false;
}

// 方法2：线性扫描（O(n)，简单直接）
function searchIILinear(nums: number[], target: number): boolean {
  return nums.includes(target);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 007. 搜索旋转排序数组 II =====");
console.log("二分 [2,5,6,0,0,1,2],0:", searchII([2, 5, 6, 0, 0, 1, 2], 0)); // true
console.log("二分 [2,5,6,0,0,1,2],3:", searchII([2, 5, 6, 0, 0, 1, 2], 3)); // false
console.log("线性 [2,5,6,0,0,1,2],0:", searchIILinear([2, 5, 6, 0, 0, 1, 2], 0)); // true

export {};
