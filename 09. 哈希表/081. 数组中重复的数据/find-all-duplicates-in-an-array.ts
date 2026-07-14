// ============================================================
// 081. 数组中重复的数据
// ============================================================
// LeetCode 442. Find All Duplicates in an Array
// 给定长度为 n 的数组，元素范围 [1, n]，每个元素出现一次或两次，找出出现两次的元素
// 思路：使用哈希集合记录已访问元素，遇到重复即加入结果
// 时间复杂度：O(n)，空间复杂度：O(n)

function findDuplicates(nums: number[]): number[] {
  const seen = new Set<number>();
  const result: number[] = [];

  for (const num of nums) {
    if (seen.has(num)) {
      result.push(num);
    } else {
      seen.add(num);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 081. 数组中重复的数据 =====");
console.log(findDuplicates([4, 3, 2, 7, 8, 2, 3, 1])); // 期望输出: [2, 3]
console.log(findDuplicates([1, 1, 2, 2])); // 期望输出: [1, 2]
console.log(findDuplicates([1])); // 期望输出: []
console.log(findDuplicates([2, 2, 3, 3, 3])); // 期望输出: [2, 3]

export {};
