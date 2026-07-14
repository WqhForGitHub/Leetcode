// ============================================================
// 01. 两数之和
// ============================================================
// LeetCode 1. Two Sum
// 给定整数数组 nums 和目标值 target，返回和为 target 的两个元素的下标。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：哈希表一次遍历（推荐）
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>(); // 值 -> 下标
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// 方法2：暴力双循环
function twoSumBruteForce(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 01. 两数之和 =====");
console.log("哈希表 [2,7,11,15], 9:", twoSum([2, 7, 11, 15], 9)); // 期望结果 [0, 1]
console.log("哈希表 [3,2,4], 6:", twoSum([3, 2, 4], 6)); // 期望结果 [1, 2]
console.log("哈希表 [3,3], 6:", twoSum([3, 3], 6)); // 期望结果 [0, 1]
console.log("暴力法 [2,7,11,15], 9:", twoSumBruteForce([2, 7, 11, 15], 9)); // 期望结果 [0, 1]
console.log("暴力法 [3,2,4], 6:", twoSumBruteForce([3, 2, 4], 6)); // 期望结果 [1, 2]

export {};
