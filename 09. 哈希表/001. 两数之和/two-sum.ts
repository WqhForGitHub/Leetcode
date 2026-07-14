// ============================================================
// 001. 两数之和
// ============================================================
// LeetCode 1. Two Sum
// 给定一个整数数组 nums 和一个整数目标值 target，返回数组中和为 target 的两个元素的下标。
// 哈希表一次遍历 O(n)。
// 时间复杂度：O(n)，空间复杂度：O(n)

function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 001. 两数之和 =====");
console.log("测试1:", twoSum([2, 7, 11, 15], 9)); // 预期: [0, 1]
console.log("测试2:", twoSum([3, 2, 4], 6)); // 预期: [1, 2]
console.log("测试3:", twoSum([3, 3], 6)); // 预期: [0, 1]

export {};
