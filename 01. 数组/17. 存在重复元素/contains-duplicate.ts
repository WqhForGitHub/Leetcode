// ============================================================
// 17. 存在重复元素
// ============================================================
// LeetCode 217. Contains Duplicate
// 给定整数数组，判断是否存在重复元素。若任一值在数组中出现至少两次，返回 true。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：Set（推荐）
function containsDuplicate(nums: number[]): boolean {
  const set = new Set<number>();
  for (const num of nums) {
    if (set.has(num)) return true; // 已存在，说明重复
    set.add(num);
  }
  return false;
}

// 方法2：排序后比较相邻元素
function containsDuplicateSort(nums: number[]): boolean {
  const sorted = [...nums].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1]) return true;
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 17. 存在重复元素 =====");
console.log("描述:", containsDuplicate([1, 2, 3, 1])); // 期望结果: true
console.log("描述:", containsDuplicate([1, 2, 3, 4])); // 期望结果: false
console.log("描述:", containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])); // 期望结果: true
console.log("描述:", containsDuplicateSort([1, 2, 3, 1])); // 期望结果: true
console.log("描述:", containsDuplicateSort([1, 2, 3, 4])); // 期望结果: false

export {};
