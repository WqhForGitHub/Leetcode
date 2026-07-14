// ============================================================
// 047. 划分为k个相等的子集
// ============================================================
// LeetCode 698. Partition to K Equal Sum Subsets
// 给定数组 nums 和整数 k，判断能否将数组划分为 k 个相等的非空子集，每个子集的和相同。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：回溯(桶视角) (推荐)
// 把每个数字尝试放入 k 个桶中的某一个，要求不超过目标和。当所有桶都填满时返回 true。
// 时间复杂度 O(k^n), 空间复杂度 O(n)
function canPartitionKSubsets(nums: number[], k: number): boolean {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % k !== 0) return false;
  const target = total / k;
  // 降序排序优化：先放大的数能更快剪枝
  nums.sort((a, b) => b - a);
  if (nums[0] > target) return false;

  const buckets = new Array<number>(k).fill(0);

  const backtrack = (idx: number): boolean => {
    if (idx === nums.length) {
      // 所有桶应已填满
      for (const b of buckets) {
        if (b !== target) return false;
      }
      return true;
    }
    // 尝试把nums[idx]放入每个桶
    for (let i = 0; i < k; i++) {
      if (buckets[i] + nums[idx] > target) continue;
      // 剪枝：跳过相等的桶避免重复
      if (i > 0 && buckets[i] === buckets[i - 1]) continue;
      buckets[i] += nums[idx];
      if (backtrack(idx + 1)) return true;
      buckets[i] -= nums[idx];
    }
    return false;
  };

  return backtrack(0);
}

// 方法2：回溯(数字视角)
// 对每个桶依次填数字：从剩余未使用数字中挑选一个放入当前桶，桶满后换下一个桶。
// 时间复杂度 O(k^n), 空间复杂度 O(n)
function canPartitionKSubsets2(nums: number[], k: number): boolean {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % k !== 0) return false;
  const target = total / k;
  nums.sort((a, b) => b - a);
  if (nums[0] > target) return false;

  const n = nums.length;
  const used = new Array<boolean>(n).fill(false);

  // 从startIdx开始搜索，bucketCurrent是当前桶已填的和，bucketCount是已完成的桶数
  const backtrack = (bucketCurrent: number, bucketCount: number, startIdx: number): boolean => {
    if (bucketCount === k - 1) return true; // 最后一个桶自动满足
    if (bucketCurrent === target) {
      // 当前桶满，开新桶
      return backtrack(0, bucketCount + 1, 0);
    }
    for (let i = startIdx; i < n; i++) {
      if (used[i]) continue;
      if (bucketCurrent + nums[i] > target) continue;
      used[i] = true;
      if (backtrack(bucketCurrent + nums[i], bucketCount, i + 1)) return true;
      used[i] = false;
      // 剪枝：当前数字不行，相同的后续数字也不行
      while (i + 1 < n && nums[i + 1] === nums[i]) i++;
    }
    return false;
  };

  return backtrack(0, 0, 0);
}

// 方法3：状态压缩DP
// 用位掩码表示已使用的数字集合，dp[mask]表示该集合的数字和 % target。
// 当 dp[mask] === 0 表示当前桶刚好填满。
// 时间复杂度 O(n * 2^n), 空间复杂度 O(2^n)
function canPartitionKSubsetsDP(nums: number[], k: number): boolean {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % k !== 0) return false;
  const target = total / k;
  const n = nums.length;
  const size = 1 << n;
  const dp: number[] = new Array(size).fill(-1);
  dp[0] = 0;

  for (let mask = 0; mask < size; mask++) {
    if (dp[mask] === -1) continue;
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) continue;
      const newMask = mask | (1 << i);
      if (dp[newMask] !== -1) continue;
      if (dp[mask] + nums[i] > target) continue;
      dp[newMask] = (dp[mask] + nums[i]) % target;
    }
  }
  return dp[size - 1] === 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 047. 划分为k个相等的子集 =====");
console.log(canPartitionKSubsets([4, 3, 2, 3, 5, 2, 1], 4)); // 期望结果: true
console.log(canPartitionKSubsets([1, 2, 3, 4], 3)); // 期望结果: false
console.log(canPartitionKSubsets2([4, 3, 2, 3, 5, 2, 1], 4)); // 期望结果: true
console.log(canPartitionKSubsets2([1, 2, 3, 4], 3)); // 期望结果: false
console.log(canPartitionKSubsetsDP([4, 3, 2, 3, 5, 2, 1], 4)); // 期望结果: true
console.log(canPartitionKSubsetsDP([1, 2, 3, 4], 3)); // 期望结果: false

export {};
