// ============================================================
// 057. 两个数组的交集
// ============================================================
// LeetCode 349. Intersection of Two Arrays
// 给定两个数组，返回它们的交集（结果中的元素唯一）。
// 时间复杂度：O(n + m)，空间复杂度：O(n + m)

// 哈希集合
// 将一个数组存入集合，遍历另一个数组查找交集
function intersection(nums1: number[], nums2: number[]): number[] {
  // 哈希集合存储 nums1 的所有元素
  const set1 = new Set<number>(nums1);
  // 结果集合（自动去重）
  const resultSet = new Set<number>();

  // 遍历 nums2，查找在 set1 中存在的元素
  for (const num of nums2) {
    if (set1.has(num)) {
      resultSet.add(num);
    }
  }

  return Array.from(resultSet);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 057. 两个数组的交集 =====");

// 测试 1
console.log(intersection([1, 2, 2, 1], [2, 2])); // 期望: [2]

// 测试 2
console.log(intersection([4, 9, 5], [9, 4, 9, 8, 4])); // 期望: [4, 9] 或 [9, 4]

// 测试 3: 无交集
console.log(intersection([1, 2, 3], [4, 5, 6])); // 期望: []

// 测试 4: 完全相同
console.log(intersection([1, 2, 3], [3, 2, 1])); // 期望: [1, 2, 3]

export {};
