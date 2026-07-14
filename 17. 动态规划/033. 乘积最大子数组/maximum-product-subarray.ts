// ============================================================
// 033. 乘积最大子数组
// ============================================================
// LeetCode 152. Maximum Product Subarray
// 给定整数数组，找出乘积最大的连续子数组，返回乘积
// 时间复杂度 O(n)

// 方法1：动态规划（推荐）
// 同时维护最大值和最小值，因为负数乘负数可能变正
// 状态转移：maxProd = max(nums[i], maxProd*nums[i], minProd*nums[i])
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxProduct(nums: number[]): number {
  if (nums.length === 0) return 0;
  let maxProd: number = nums[0];
  let minProd: number = nums[0];
  let result: number = nums[0];

  for (let i: number = 1; i < nums.length; i++) {
    // 保存旧值，因为更新minProd需要旧的maxProd
    const oldMax: number = maxProd;
    const oldMin: number = minProd;
    // 状态转移：当前最大值 = max(当前数本身, 前面最大×当前, 前面最小×当前)
    // 负数×负数可能变成正数，所以需要同时维护最小值
    maxProd = Math.max(nums[i], oldMax * nums[i], oldMin * nums[i]);
    minProd = Math.min(nums[i], oldMax * nums[i], oldMin * nums[i]);
    result = Math.max(result, maxProd);
  }
  return result;
}

// 方法2：正反两次遍历
// 正向遍历求累积乘积，遇到0重置；反向遍历同理，取最大值
// 原理：最大乘积子数组要么从左到右不经过0，要么从右到左不经过0
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxProductTwoPass(nums: number[]): number {
  if (nums.length === 0) return 0;
  let result: number = nums[0];
  let prod: number = 1;

  // 正向遍历
  for (let i: number = 0; i < nums.length; i++) {
    prod *= nums[i];
    result = Math.max(result, prod);
    if (nums[i] === 0) prod = 1; // 遇到0重置乘积
  }

  prod = 1;
  // 反向遍历
  for (let i: number = nums.length - 1; i >= 0; i--) {
    prod *= nums[i];
    result = Math.max(result, prod);
    if (nums[i] === 0) prod = 1; // 遇到0重置乘积
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 033. 乘积最大子数组 =====");
console.log(maxProduct([2, 3, -2, 4])); // 期望结果: 6
console.log(maxProduct([-2, 0, -1])); // 期望结果: 0
console.log(maxProduct([-2, 3, -4])); // 期望结果: 24
console.log(maxProductTwoPass([2, 3, -2, 4])); // 期望结果: 6
console.log(maxProduct([0, 2])); // 期望结果: 2

export {};
