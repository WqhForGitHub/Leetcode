// ============================================================
// 036. 存在重复元素 II
// ============================================================
// LeetCode 219. Contains Duplicate II
// 判断是否存在 i, j 满足 nums[i] == nums[j] 且 |j - i| <= k。哈希表存索引。
// 时间复杂度：O(n)，空间复杂度：O(n)

/**
 * 使用哈希表存储每个元素最近出现的索引
 * 遍历数组，若元素已存在且索引差 <= k 则返回 true
 * 否则更新该元素的最新索引
 */
function containsNearbyDuplicate(nums: number[], k: number): boolean {
  const indexMap = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (indexMap.has(num)) {
      const prevIndex = indexMap.get(num)!;
      if (i - prevIndex <= k) {
        return true;
      }
    }
    // 更新为最新索引，保证后续差值最小
    indexMap.set(num, i);
  }

  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 036. 存在重复元素 II =====");
// 测试 1: 存在满足条件的重复
console.log(containsNearbyDuplicate([1, 2, 3, 1], 3)); // 期望输出: true

// 测试 2: 距离超过 k
console.log(containsNearbyDuplicate([1, 0, 1, 1], 1)); // 期望输出: true

// 测试 3: 不存在满足条件的重复
console.log(containsNearbyDuplicate([1, 2, 3, 1, 2, 3], 2)); // 期望输出: false

// 测试 4: 空数组
console.log(containsNearbyDuplicate([], 0)); // 期望输出: false

export {};
