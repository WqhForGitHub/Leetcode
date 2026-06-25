// ============================================================
// 18. 存在重复元素 II
// ============================================================
// LeetCode 219. Contains Duplicate II
// 给定整数数组和整数 k，判断是否存在两个不同索引 i 和 j 使得 nums[i]==nums[j] 且 |i-j|<=k。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：哈希表记录上次出现的索引（推荐）
function containsNearbyDuplicate(nums: number[], k: number): boolean {
  const map = new Map<number, number>(); // 值 -> 上次出现的索引
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (map.has(num) && i - map.get(num)! <= k) {
      return true;
    }
    map.set(num, i); // 更新为当前索引
  }
  return false;
}

// 方法2：滑动窗口 + Set
// 维护一个大小最多为 k 的 Set，窗口内出现重复即满足条件
function containsNearbyDuplicateWindow(nums: number[], k: number): boolean {
  const set = new Set<number>();
  for (let i = 0; i < nums.length; i++) {
    if (set.has(nums[i])) return true; // 窗口内有相同元素
    set.add(nums[i]);
    if (set.size > k) {
      set.delete(nums[i - k]); // 窗口右移，移除最早的元素
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 18. 存在重复元素 II =====");
console.log("描述:", containsNearbyDuplicate([1, 2, 3, 1], 3)); // 期望结果: true
console.log("描述:", containsNearbyDuplicate([1, 0, 1, 1], 1)); // 期望结果: true
console.log("描述:", containsNearbyDuplicate([1, 2, 3, 1, 2, 3], 2)); // 期望结果: false
console.log("描述:", containsNearbyDuplicateWindow([1, 2, 3, 1], 3)); // 期望结果: true
console.log("描述:", containsNearbyDuplicateWindow([1, 2, 3, 1, 2, 3], 2)); // 期望结果: false

export {};
