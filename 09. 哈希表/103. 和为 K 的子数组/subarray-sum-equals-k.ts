// ============================================================
// 103. 和为 K 的子数组
// ============================================================
// LeetCode 560. Subarray Sum Equals K
// 给定整数数组 nums 和整数 k，统计数组中和为 k 的连续子数组个数。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 思路：前缀和 + 哈希表
// 若 prefix[j] - prefix[i] = k，则子数组 [i+1, j] 的和为 k
// 用哈希表记录每个前缀和出现的次数，遍历时查找 prefix - k
function subarraySum(nums: number[], k: number): number {
  const prefixCount = new Map<number, number>();
  // 初始：前缀和 0 出现 1 次（空前缀）
  prefixCount.set(0, 1);

  let count = 0;
  let sum = 0;
  for (const num of nums) {
    sum += num;
    // 查找之前是否存在前缀和 = sum - k
    if (prefixCount.has(sum - k)) {
      count += prefixCount.get(sum - k)!;
    }
    prefixCount.set(sum, (prefixCount.get(sum) || 0) + 1);
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 103. 和为 K 的子数组 =====");
// 测试 1
console.log(subarraySum([1, 1, 1], 2)); // 期望: 2
// 测试 2
console.log(subarraySum([1, 2, 3], 3)); // 期望: 2 ([1,2] 和 [3])
// 测试 3: 含负数
console.log(subarraySum([1, -1, 0], 0)); // 期望: 3
// 测试 4
console.log(subarraySum([1, 2, 1, 2, 1], 3)); // 期望: 4

export {};
