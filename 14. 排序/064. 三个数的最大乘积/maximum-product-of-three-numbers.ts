// ============================================================
// 064. 三个数的最大乘积
// ============================================================
// LeetCode 628. Maximum Product of Three Numbers
// 给定整数数组（可能含负数），从中任选三个数使乘积最大，返回该最大乘积。

// 方法1：排序 + 比较（推荐，O(n log n) 时间，O(1) 额外空间）
// 最大乘积只有两种可能：
//   (1) 三个最大数之积：nums[n-1] * nums[n-2] * nums[n-3]
//   (2) 两个最小（负）数与一个最大数之积：nums[0] * nums[1] * nums[n-1]
// 取两者较大值。
function maximumProduct(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const option1 = nums[n - 1] * nums[n - 2] * nums[n - 3];
  const option2 = nums[0] * nums[1] * nums[n - 1];
  return Math.max(option1, option2);
}

// 方法2：单次扫描维护最大的三个数和最小的两个数（O(n) 时间，O(1) 空间）
// 不排序，直接在一次遍历中维护 max1 >= max2 >= max3 与 min1 <= min2。
function maximumProductOnePass(nums: number[]): number {
  // 最大的三个
  let max1 = -Infinity;
  let max2 = -Infinity;
  let max3 = -Infinity;
  // 最小的两个
  let min1 = Infinity;
  let min2 = Infinity;

  for (const num of nums) {
    // 更新最大三个（注意从大到小依次比较并下移）
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

    // 更新最小两个
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
console.log("===== 064. 三个数的最大乘积 =====");
console.log("排序法 [1,2,3]:", maximumProduct([1, 2, 3])); // 期望 6
console.log("排序法 [1,2,3,4]:", maximumProduct([1, 2, 3, 4])); // 期望 24
console.log("排序法 [-1,-2,-3]:", maximumProduct([-1, -2, -3])); // 期望 -6
console.log("排序法 [-100,-98,1,2,3,4]:", maximumProduct([-100, -98, 1, 2, 3, 4])); // 期望 39200
console.log("一次扫描 [1,2,3]:", maximumProductOnePass([1, 2, 3])); // 期望 6
console.log("一次扫描 [1,2,3,4]:", maximumProductOnePass([1, 2, 3, 4])); // 期望 24
console.log("一次扫描 [-1,-2,-3]:", maximumProductOnePass([-1, -2, -3])); // 期望 -6
console.log("一次扫描 [-100,-98,1,2,3,4]:", maximumProductOnePass([-100, -98, 1, 2, 3, 4])); // 期望 39200

export {};
