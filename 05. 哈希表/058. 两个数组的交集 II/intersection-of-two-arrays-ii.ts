// ============================================================
// 058. 两个数组的交集 II
// ============================================================
// LeetCode 350. Intersection of Two Arrays II
// 给定两个数组，返回它们的交集（结果中元素可重复，按出现次数取最小值）。
// 时间复杂度：O(n + m)，空间复杂度：O(min(n, m))

// 哈希表计数
// 对较短数组统计元素频率，再遍历另一数组收集交集
function intersect(nums1: number[], nums2: number[]): number[] {
  // 为节省空间，对较短数组进行计数
  if (nums1.length > nums2.length) {
    return intersect(nums2, nums1);
  }

  // 哈希表：元素 -> 出现次数
  const countMap = new Map<number, number>();
  for (const num of nums1) {
    countMap.set(num, (countMap.get(num) || 0) + 1);
  }

  // 遍历较长数组，收集交集元素
  const result: number[] = [];
  for (const num of nums2) {
    const count = countMap.get(num);
    if (count !== undefined && count > 0) {
      result.push(num);
      countMap.set(num, count - 1);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 058. 两个数组的交集 II =====");

// 测试 1
console.log(intersect([1, 2, 2, 1], [2, 2])); // 期望: [2, 2]

// 测试 2
console.log(intersect([4, 9, 5], [9, 4, 9, 8, 4])); // 期望: [4, 9] 或 [9, 4]

// 测试 3: 无交集
console.log(intersect([1, 2, 3], [4, 5, 6])); // 期望: []

// 测试 4: 重复元素
console.log(intersect([1, 1, 1, 2], [1, 1, 2, 2])); // 期望: [1, 1, 2]

export {};
