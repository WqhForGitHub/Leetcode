// ============================================================
// 096. 连续数组
// ============================================================
// LeetCode 525. Contiguous Array
// 给定一个二进制数组 nums，找到含有相同数量 0 和 1 的最长连续子数组长度。
// 时间复杂度：O(n)，空间复杂度：O(n)

function findMaxLength(nums: number[]): number {
  // 哈希表：前缀和 -> 首次出现的索引
  const sumIdx = new Map<number, number>();
  // 前缀和为 0 时，认为索引在 -1 位置（空前缀）
  sumIdx.set(0, -1);
  let maxLen = 0;
  let prefixSum = 0;

  for (let i = 0; i < nums.length; i++) {
    // 把 0 当作 -1 处理，这样相等数量的 0 和 1 子数组和为 0
    prefixSum += nums[i] === 0 ? -1 : 1;

    if (sumIdx.has(prefixSum)) {
      const prevIdx = sumIdx.get(prefixSum)!;
      maxLen = Math.max(maxLen, i - prevIdx);
    } else {
      // 仅记录首次出现，保证子数组最长
      sumIdx.set(prefixSum, i);
    }
  }
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 096. 连续数组 =====");
// 测试 1: [0,1] -> 2
console.log(findMaxLength([0, 1]));
// 期望: 2
// 测试 2: [0,1,0] -> 2
console.log(findMaxLength([0, 1, 0]));
// 期望: 2
// 测试 3: [0,1,1,0,1,1,1,0] -> 4
console.log(findMaxLength([0, 1, 1, 0, 1, 1, 1, 0]));
// 期望: 4

export {};
