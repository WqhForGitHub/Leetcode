// ============================================================
// 052. 和等于 k 的最长子数组长度
// ============================================================
// LeetCode 325. Maximum Size Subarray Sum Equals k
// 给定数组 nums 和整数 k，找到和为 k 的最长子数组，返回其长度。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 前缀和 + 哈希表
// 用哈希表记录每个前缀和第一次出现的位置
// 若当前前缀和为 sum，查找 sum - k 是否出现过
function maxSubArrayLen(nums: number[], k: number): number {
  // 哈希表：前缀和 -> 第一次出现的索引
  const sumIndexMap = new Map<number, number>();
  sumIndexMap.set(0, -1); // 前缀和为 0 出现在索引 -1（空前缀）

  let maxLen = 0;
  let prefixSum = 0;

  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];
    // 查找是否存在前缀和为 (prefixSum - k) 的位置
    const target = prefixSum - k;
    if (sumIndexMap.has(target)) {
      const startIdx = sumIndexMap.get(target)!;
      maxLen = Math.max(maxLen, i - startIdx);
    }
    // 只记录第一次出现的位置，保证子数组最长
    if (!sumIndexMap.has(prefixSum)) {
      sumIndexMap.set(prefixSum, i);
    }
  }

  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 052. 和等于 k 的最长子数组长度 =====");

// 测试 1
console.log(maxSubArrayLen([1, -1, 5, -2, 3], 3)); // 期望: 4 (子数组 [1, -1, 5, -2])

// 测试 2
console.log(maxSubArrayLen([-2, -1, 2, 1], 1)); // 期望: 2 (子数组 [-1, 2] 或 [2, 1])

// 测试 3: 不存在和为 k 的子数组
console.log(maxSubArrayLen([1, 2, 3], 7)); // 期望: 0

// 测试 4: 单个元素
console.log(maxSubArrayLen([3], 3)); // 期望: 1

export {};
