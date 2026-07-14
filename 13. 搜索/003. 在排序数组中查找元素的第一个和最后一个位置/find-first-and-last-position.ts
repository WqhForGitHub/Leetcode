// ============================================================
// 003. 在排序数组中查找元素的第一个和最后一个位置
// ============================================================
// LeetCode 34. Find First and Last Position of Element in Sorted Array
// 给定升序数组和目标值，找出目标值在数组中的开始和结束位置。
// 时间复杂度 O(log n)。

// 方法1：两次二分查找（找左边界和右边界）
function searchRange(nums: number[], target: number): number[] {
  const leftBound = findLeftBound(nums, target);
  if (leftBound === -1) return [-1, -1];
  const rightBound = findRightBound(nums, target);
  return [leftBound, rightBound];
}

function findLeftBound(nums: number[], target: number): number {
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
  if (left < nums.length && nums[left] === target) return left;
  return -1;
}

function findRightBound(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  if (right >= 0 && nums[right] === target) return right;
  return -1;
}

// 方法2：一次二分找到目标后向两边扩展（最坏 O(n)）
function searchRangeExpand(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      let l = mid;
      let r = mid;
      while (l > 0 && nums[l - 1] === target) l--;
      while (r < nums.length - 1 && nums[r + 1] === target) r++;
      return [l, r];
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return [-1, -1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 003. 在排序数组中查找元素的第一个和最后一个位置 =====");
console.log("两次二分 [5,7,7,8,8,10],8:", searchRange([5, 7, 7, 8, 8, 10], 8)); // [3,4]
console.log("两次二分 [5,7,7,8,8,10],6:", searchRange([5, 7, 7, 8, 8, 10], 6)); // [-1,-1]
console.log("扩展 [5,7,7,8,8,10],8:", searchRangeExpand([5, 7, 7, 8, 8, 10], 8)); // [3,4]

export {};
