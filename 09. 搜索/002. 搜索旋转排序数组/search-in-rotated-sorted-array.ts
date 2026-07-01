// ============================================================
// 002. 搜索旋转排序数组
// ============================================================
// LeetCode 33. Search in Rotated Sorted Array
// 升序排列的整数数组在预先未知的某个点进行了旋转，搜索目标值，返回下标。
// 时间复杂度 O(log n)。

// 方法1：二分查找（判断哪半部分有序）
function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    // 左半部分有序
    if (nums[left] <= nums[mid]) {
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
  return -1;
}

// 方法2：先找旋转点再二分
function searchByFindRotate(nums: number[], target: number): number {
  // 找到最小值的下标（旋转点）
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] > nums[hi]) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  const rot = lo; // 旋转点
  lo = 0;
  hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const realMid = (mid + rot) % nums.length;
    if (nums[realMid] === target) return realMid;
    if (nums[realMid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 002. 搜索旋转排序数组 =====");
console.log("二分 [4,5,6,7,0,1,2],0:", search([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log("二分 [4,5,6,7,0,1,2],3:", search([4, 5, 6, 7, 0, 1, 2], 3)); // -1
console.log("找旋转点 [4,5,6,7,0,1,2],0:", searchByFindRotate([4, 5, 6, 7, 0, 1, 2], 0)); // 4

export {};
