// ============================================================
// 53. 二分查找
// ============================================================
// LeetCode 704. Binary Search
// 给定升序整数数组 nums 和目标值 target，搜索目标值，
// 存在返回索引，不存在返回 -1。
// 时间复杂度：O(log n)，空间复杂度：O(1)

// 方法1：左闭右闭区间二分查找（推荐）
// 区间 [left, right]，循环条件 left <= right，收缩时 right = mid - 1 / left = mid + 1
function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2); // 防溢出
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

// 方法2：左闭右开区间二分查找
// 区间 [left, right)，循环条件 left < right，收缩时 right = mid（不减 1）
function searchOpenRight(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length; // 右开

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid; // 右开，不减 1
    }
  }
  return -1;
}

// 方法3：递归二分查找
// 时间复杂度：O(log n)，空间复杂度：O(log n)（递归栈）
function searchRecursive(nums: number[], target: number): number {
  const helper = (left: number, right: number): number => {
    if (left > right) return -1;
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) return helper(mid + 1, right);
    return helper(left, mid - 1);
  };
  return helper(0, nums.length - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 53. 二分查找 =====");
console.log("描述:", search([-1, 0, 3, 5, 9, 12], 9)); // 期望结果: 4
console.log("描述:", search([-1, 0, 3, 5, 9, 12], 2)); // 期望结果: -1
console.log("描述:", searchOpenRight([-1, 0, 3, 5, 9, 12], 9)); // 期望结果: 4
console.log("描述:", searchOpenRight([-1, 0, 3, 5, 9, 12], 2)); // 期望结果: -1
console.log("描述:", searchRecursive([-1, 0, 3, 5, 9, 12], 9)); // 期望结果: 4
console.log("描述:", searchRecursive([-1, 0, 3, 5, 9, 12], 2)); // 期望结果: -1

export {};
