// ============================================================
// 083. 找到所有数组中消失的数字
// ============================================================
// LeetCode 448. Find All Numbers Disappeared in an Array
// 给定长度为 n 的数组，元素范围 [1, n]，找出 [1, n] 中未出现的数字
// 思路：使用哈希集合存储已出现数字，遍历 [1, n] 找出缺失的
// 时间复杂度：O(n)，空间复杂度：O(n)

function findDisappearedNumbers(nums: number[]): number[] {
  const numSet = new Set<number>(nums);
  const result: number[] = [];

  for (let i = 1; i <= nums.length; i++) {
    if (!numSet.has(i)) {
      result.push(i);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 083. 找到所有数组中消失的数字 =====");
console.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])); // 期望输出: [5, 6]
console.log(findDisappearedNumbers([1, 1])); // 期望输出: [2]
console.log(findDisappearedNumbers([1, 2, 3])); // 期望输出: []
console.log(findDisappearedNumbers([2, 2])); // 期望输出: [1]

export {};
