// ============================================================
// 241. 两个数对之间的最大乘积差
// ============================================================
// LeetCode 1913. Maximum Product Difference Between Two Pairs
// 给定数组 nums（至少 4 个元素），选 4 个不同下标的元素 a,b,c,d，
// 使 (a*b - c*d) 最大。等价于最大两数之积减去最小两数之积。

// 方法1：排序 + 取两个最大与两个最小（O(n log n)）
function maxProductDifference1(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  return nums[n - 1] * nums[n - 2] - nums[0] * nums[1];
}

// 方法2：单次遍历找最大两个与最小两个（O(n)）
function maxProductDifference2(nums: number[]): number {
  let max1 = -Infinity;
  let max2 = -Infinity;
  let min1 = Infinity;
  let min2 = Infinity;
  for (const x of nums) {
    // 维护最大两个（max1 >= max2）
    if (x > max1) {
      max2 = max1;
      max1 = x;
    } else if (x > max2) {
      max2 = x;
    }
    // 维护最小两个（min1 <= min2）
    if (x < min1) {
      min2 = min1;
      min1 = x;
    } else if (x < min2) {
      min2 = x;
    }
  }
  return max1 * max2 - min1 * min2;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 241. 两个数对之间的最大乘积差 =====");
console.log("方法1 [5,6,2,7,6]:", maxProductDifference1([5, 6, 2, 7, 6])); // 32
console.log("方法2 [5,6,2,7,6]:", maxProductDifference2([5, 6, 2, 7, 6])); // 32
console.log("方法1 [4,2,5,9,7,4,8]:", maxProductDifference1([4, 2, 5, 9, 7, 4, 8])); // 64
console.log("方法2 [4,2,5,9,7,4,8]:", maxProductDifference2([4, 2, 5, 9, 7, 4, 8])); // 64

export {};
