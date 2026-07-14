// ============================================================
// 009. 寻找旋转排序数组中的最小值 II
// ============================================================
// LeetCode 154. Find Minimum in Rotated Sorted Array II
// 旋转后的升序数组可能包含重复元素，找出其中最小元素。

// 方法1：二分查找（处理重复元素时收缩右边界）
function findMinII(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else if (nums[mid] < nums[right]) {
      right = mid;
    } else {
      // nums[mid] === nums[right]，无法判断，收缩右边界
      right--;
    }
  }
  return nums[left];
}

// 方法2：分治
function findMinIIDivide(nums: number[]): number {
  return helper(nums, 0, nums.length - 1);
}

function helper(nums: number[], lo: number, hi: number): number {
  if (lo === hi) return nums[lo];
  if (nums[lo] < nums[hi]) return nums[lo]; // 已经有序
  const mid = Math.floor((lo + hi) / 2);
  return Math.min(helper(nums, lo, mid), helper(nums, mid + 1, hi));
}

// ============================================================
// 测试
// ============================================================
console.log("===== 009. 寻找旋转排序数组中的最小值 II =====");
console.log("二分 [1,3,5]:", findMinII([1, 3, 5])); // 1
console.log("二分 [2,2,2,0,1]:", findMinII([2, 2, 2, 0, 1])); // 0
console.log("分治 [2,2,2,0,1]:", findMinIIDivide([2, 2, 2, 0, 1])); // 0

export {};
