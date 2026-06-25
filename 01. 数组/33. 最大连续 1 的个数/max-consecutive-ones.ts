// ============================================================
// 33. 最大连续 1 的个数
// ============================================================
// LeetCode 485. Max Consecutive Ones
// 给定二进制数组 nums，返回最大连续 1 的个数。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：一次遍历（推荐）
function findMaxConsecutiveOnes(nums: number[]): number {
  let maxCount = 0; // 最大连续 1 的个数
  let currentCount = 0; // 当前连续 1 的个数

  for (const num of nums) {
    if (num === 1) {
      currentCount++;
      maxCount = Math.max(maxCount, currentCount);
    } else {
      currentCount = 0; // 遇到 0 重置
    }
  }

  return maxCount;
}

// 方法2：基于索引计算-记录上一个 0 的位置
function findMaxConsecutiveOnesByIndex(nums: number[]): number {
  let maxCount = 0;
  let prevZeroIndex = -1; // 上一个 0 的位置（虚拟位置 -1 表示开头）

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) {
      // 当前位置到上一个 0 之间的连续 1 个数
      maxCount = Math.max(maxCount, i - prevZeroIndex - 1);
      prevZeroIndex = i;
    }
  }
  // 处理末尾连续的 1
  maxCount = Math.max(maxCount, nums.length - prevZeroIndex - 1);

  return maxCount;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 33. 最大连续 1 的个数 =====");
console.log("描述:", findMaxConsecutiveOnes([1, 1, 0, 1, 1, 1])); // 期望结果: 3
console.log("描述:", findMaxConsecutiveOnes([1, 0, 1, 1, 0, 1])); // 期望结果: 2
console.log("描述:", findMaxConsecutiveOnes([0, 0, 0])); // 期望结果: 0
console.log("描述:", findMaxConsecutiveOnesByIndex([1, 1, 0, 1, 1, 1])); // 期望结果: 3

export {};
