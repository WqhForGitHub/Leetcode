// ============================================================
// 116. 三角形的最大周长
// ============================================================
// LeetCode 976. Largest Perimeter Triangle
// 给定正整数数组（边长），返回能组成三角形的最大周长；不能组成返回 0。
// 三角形条件：任意两边之和大于第三边，等价于 a + b > c（c 为最大边）。

// 方法1：排序 + 检查相邻三元组（推荐，O(n log n) 时间，O(log n) 排序空间）
// 排序后从大到小检查相邻三个数：若 nums[i-2] + nums[i-1] > nums[i]，
// 即为最大周长（更大的边若能成三角形周长必然更大）。
function largestPerimeter(nums: number[]): number {
  nums.sort((a, b) => a - b);
  for (let i = nums.length - 1; i >= 2; i--) {
    if (nums[i - 2] + nums[i - 1] > nums[i]) {
      return nums[i - 2] + nums[i - 1] + nums[i];
    }
  }
  return 0;
}

// 方法2：降序排序后检查相邻三元组（O(n log n) 时间）
// 与方法1等价，只是从大到小遍历更直观。
function largestPerimeterDesc(nums: number[]): number {
  nums.sort((a, b) => b - a);
  for (let i = 0; i <= nums.length - 3; i++) {
    if (nums[i + 1] + nums[i + 2] > nums[i]) {
      return nums[i] + nums[i + 1] + nums[i + 2];
    }
  }
  return 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 116. 三角形的最大周长 =====");
console.log("方法1 [2,1,2]:", largestPerimeter([2, 1, 2])); // 期望 5
console.log("方法1 [1,2,1]:", largestPerimeter([1, 2, 1])); // 期望 0
console.log("方法1 [3,2,3,4]:", largestPerimeter([3, 2, 3, 4])); // 期望 10
console.log("方法1 [3,6,2,3]:", largestPerimeter([3, 6, 2, 3])); // 期望 8
console.log("方法2 [2,1,2]:", largestPerimeterDesc([2, 1, 2])); // 期望 5
console.log("方法2 [1,2,1]:", largestPerimeterDesc([1, 2, 1])); // 期望 0
console.log("方法2 [3,2,3,4]:", largestPerimeterDesc([3, 2, 3, 4])); // 期望 10
console.log("方法2 [3,6,2,3]:", largestPerimeterDesc([3, 6, 2, 3])); // 期望 8

export {};
