// ============================================================
// 015. 存在重复元素
// ============================================================
// LeetCode 217. Contains Duplicate
// 判断数组中是否存在重复元素，存在返回 true。

// 方法1：哈希集合（推荐，O(n) 时间，O(n) 空间）
function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const v of nums) {
    if (seen.has(v)) return true;
    seen.add(v);
  }
  return false;
}

// 方法2：排序后检查相邻元素（O(n log n) 时间，O(1) 或 O(log n) 空间）
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
console.log("===== 015. 存在重复元素 =====");
console.log("哈希 [1,2,3,1]:", containsDuplicate([1, 2, 3, 1])); // true
console.log("哈希 [1,2,3,4]:", containsDuplicate([1, 2, 3, 4])); // false
console.log("排序 [1,1,1,3,3,4,3,2,4,2]:", containsDuplicateSort([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])); // true
console.log("排序 [1,2,3,4]:", containsDuplicateSort([1, 2, 3, 4])); // false

export {};
