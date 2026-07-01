// ============================================================
// 045. 有序数组中的单一元素
// ============================================================
// LeetCode 540. Single Element in a Sorted Array
// 有序数组中每个元素都出现两次，只有一个元素出现一次，找出它。O(log n)。

// 方法1：二分查找（利用索引奇偶性）
function singleNonDuplicate(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    // 确保 mid 是偶数
    if (mid % 2 === 1) mid--;
    // 如果 mid 和 mid+1 相同，单一元素在右半部分
    if (nums[mid] === nums[mid + 1]) {
      left = mid + 2;
    } else {
      right = mid;
    }
  }
  return nums[left];
}

// 方法2：异或遍历（O(n)）
function singleNonDuplicateXor(nums: number[]): number {
  let result = 0;
  for (const num of nums) {
    result ^= num;
  }
  return result;
}

// 方法3：二分查找（对偶数索引）
function singleNonDuplicateEven(nums: number[]): number {
  let lo = 0;
  let hi = nums.length / 2 - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[2 * mid] === nums[2 * mid + 1]) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return nums[2 * lo];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 045. 有序数组中的单一元素 =====");
console.log("二分 [1,1,2,3,3,4,4,8,8]:", singleNonDuplicate([1, 1, 2, 3, 3, 4, 4, 8, 8])); // 2
console.log("二分 [3,3,7,7,10,11,11]:", singleNonDuplicate([3, 3, 7, 7, 10, 11, 11])); // 10
console.log("异或 [1,1,2,3,3,4,4,8,8]:", singleNonDuplicateXor([1, 1, 2, 3, 3, 4, 4, 8, 8])); // 2

export {};
