// ============================================================
// 46. 三个数的最大乘积
// ============================================================
// LeetCode 628. Maximum Product of Three Numbers
// 给定整数数组 nums，找出三个数的最大乘积。
// 时间复杂度：O(n log n)，空间复杂度：O(1)

// 方法1：排序后比较（推荐）
// 最大乘积只可能是：
// 1. 三个最大的正数相乘：nums[n-1] * nums[n-2] * nums[n-3]
// 2. 两个最小的负数（绝对值大）乘以一个最大的正数：nums[0] * nums[1] * nums[n-1]
function maximumProduct(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const product1 = nums[n - 1] * nums[n - 2] * nums[n - 3];
  const product2 = nums[0] * nums[1] * nums[n - 1];
  return Math.max(product1, product2);
}

// 方法2：线性扫描找最大的三个和最小的两个
function maximumProductLinear(nums: number[]): number {
  // 维护最大的三个值
  let max1 = -Infinity;
  let max2 = -Infinity;
  let max3 = -Infinity;
  // 维护最小的两个值
  let min1 = Infinity;
  let min2 = Infinity;

  for (const num of nums) {
    // 更新最大值（从大到小传递）
    if (num > max1) {
      max3 = max2;
      max2 = max1;
      max1 = num;
    } else if (num > max2) {
      max3 = max2;
      max2 = num;
    } else if (num > max3) {
      max3 = num;
    }

    // 更新最小值（从小到大传递）
    if (num < min1) {
      min2 = min1;
      min1 = num;
    } else if (num < min2) {
      min2 = num;
    }
  }

  return Math.max(max1 * max2 * max3, min1 * min2 * max1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 46. 三个数的最大乘积 =====");
console.log("排序:", maximumProduct([1, 2, 3])); // 期望结果: 6
console.log("排序:", maximumProduct([1, 2, 3, 4])); // 期望结果: 24
console.log("排序:", maximumProduct([-1, -2, -3])); // 期望结果: -6
console.log("排序:", maximumProduct([-100, -98, 1, 2, 3, 4])); // 期望结果: 39200
console.log("线性:", maximumProductLinear([1, 2, 3])); // 期望结果: 6
console.log("线性:", maximumProductLinear([1, 2, 3, 4])); // 期望结果: 24
console.log("线性:", maximumProductLinear([-1, -2, -3])); // 期望结果: -6
console.log("线性:", maximumProductLinear([-100, -98, 1, 2, 3, 4])); // 期望结果: 39200

export {};
