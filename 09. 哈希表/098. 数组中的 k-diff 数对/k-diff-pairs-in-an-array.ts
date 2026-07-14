// ============================================================
// 098. 数组中的 k-diff 数对
// ============================================================
// LeetCode 532. K-diff Pairs in an Array
// 给定一个整数数组 nums 和整数 k，返回不同的 k-diff 数对的数量。
// k-diff 数对：(nums[i], nums[j])，其中 |nums[i] - nums[j]| == k，
// 且 i != j，只按数值对统计去重。
// 时间复杂度：O(n)，空间复杂度：O(n)

function findPairs(nums: number[], k: number): number {
  if (k < 0) return 0;
  // 哈希表统计每个数字出现次数
  const counter = new Map<number, number>();
  for (const num of nums) {
    counter.set(num, (counter.get(num) ?? 0) + 1);
  }

  let count = 0;
  for (const [num] of counter) {
    if (k === 0) {
      // k=0 时，需要数字出现至少 2 次
      if ((counter.get(num) ?? 0) >= 2) count++;
    } else {
      // k>0 时，检查 num + k 是否存在（避免重复只查一个方向）
      if (counter.has(num + k)) count++;
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 098. 数组中的 k-diff 数对 =====");
// 测试 1: [3,1,4,1,5], k=2 -> 2  （(1,3) 和 (3,5)）
console.log(findPairs([3, 1, 4, 1, 5], 2));
// 期望: 2
// 测试 2: [1,2,3,4,5], k=1 -> 4  （(1,2),(2,3),(3,4),(4,5)）
console.log(findPairs([1, 2, 3, 4, 5], 1));
// 期望: 4
// 测试 3: [1,3,1,5,4], k=0 -> 1  （(1,1)）
console.log(findPairs([1, 3, 1, 5, 4], 0));
// 期望: 1
// 测试 4: [1,2,4,4,3,3,0,9,2,3], k=3 -> 4
console.log(findPairs([1, 2, 4, 4, 3, 3, 0, 9, 2, 3], 3));
// 期望: 4

export {};
