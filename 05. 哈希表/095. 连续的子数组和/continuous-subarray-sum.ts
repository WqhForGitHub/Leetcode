// ============================================================
// 095. 连续的子数组和
// ============================================================
// LeetCode 523. Continuous Subarray Sum
// 给定一个整数数组 nums 和整数 k，判断是否存在长度至少为 2 的
// 连续子数组，其元素和为 k 的倍数。
// 时间复杂度：O(n)，空间复杂度：O(min(n, k))

function checkSubarraySum(nums: number[], k: number): boolean {
  // 哈希表：余数 -> 该余数首次出现的索引
  const remainderIdx = new Map<number, number>();
  // 初始前缀和为 0，索引记为 -1
  remainderIdx.set(0, -1);
  let prefixSum = 0;

  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];
    const remainder = prefixSum % k;
    // 处理负数余数（虽然本题题目通常为非负，保险起见）
    const r = remainder < 0 ? remainder + k : remainder;

    if (remainderIdx.has(r)) {
      const prevIdx = remainderIdx.get(r)!;
      // 子数组长度至少为 2
      if (i - prevIdx >= 2) return true;
    } else {
      // 只记录首次出现的位置以保证子数组最长
      remainderIdx.set(r, i);
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 095. 连续的子数组和 =====");
// 测试 1: [23,2,4,6,7], k=6 -> true （2+4=6）
console.log(checkSubarraySum([23, 2, 4, 6, 7], 6));
// 期望: true
// 测试 2: [23,2,6,4,7], k=6 -> true （23+2+6+4+7=42 是 6 的倍数）
console.log(checkSubarraySum([23, 2, 6, 4, 7], 6));
// 期望: true
// 测试 3: [23,2,6,4,7], k=13 -> false
console.log(checkSubarraySum([23, 2, 6, 4, 7], 13));
// 期望: false

export {};
