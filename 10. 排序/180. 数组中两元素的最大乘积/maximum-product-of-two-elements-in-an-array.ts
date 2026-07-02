// ============================================================
// 180. 数组中两元素的最大乘积
// ============================================================
// LeetCode 1464. Maximum Product of Two Elements in an Array
// 给定数组 nums，求 (nums[i]-1) * (nums[j]-1) 的最大值，其中 i != j。

// 方法1：一次遍历找最大与次大（O(n)）
// 维护最大值 max1 与次大值 max2，最后用 (max1-1)*(max2-1)。
function maxProduct(nums: number[]): number {
  let max1 = -Infinity;
  let max2 = -Infinity;
  for (const x of nums) {
    if (x > max1) {
      max2 = max1;
      max1 = x;
    } else if (x > max2) {
      max2 = x;
    }
  }
  return (max1 - 1) * (max2 - 1);
}

// 方法2：排序取末两位（O(n log n)）
// 升序排序后直接取最大两个元素。
function maxProduct2(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  return (nums[n - 1] - 1) * (nums[n - 2] - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 180. 数组中两元素的最大乘积 =====");
console.log("方法1 [3,4,5,2]:", maxProduct([3, 4, 5, 2])); // 12
console.log("方法1 [1,5,4,5]:", maxProduct([1, 5, 4, 5])); // 16
console.log("方法1 [10,2,5,2]:", maxProduct([10, 2, 5, 2])); // 36
console.log("方法2 [3,4,5,2]:", maxProduct2([3, 4, 5, 2])); // 12
console.log("方法2 [1,5,4,5]:", maxProduct2([1, 5, 4, 5])); // 16
console.log("方法2 [10,2,5,2]:", maxProduct2([10, 2, 5, 2])); // 36

export {};
