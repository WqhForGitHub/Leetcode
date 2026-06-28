// ============================================================
// 035. 存在重复元素
// ============================================================
// LeetCode 217. Contains Duplicate
// 判断数组是否有重复元素。哈希集合。
// 时间复杂度：O(n)，空间复杂度：O(n)

/**
 * 使用哈希集合判断是否有重复元素
 * 遍历数组，若元素已在集合中则存在重复
 */
function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const num of nums) {
    if (seen.has(num)) {
      return true;
    }
    seen.add(num);
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 035. 存在重复元素 =====");
// 测试 1: 存在重复元素
console.log(containsDuplicate([1, 2, 3, 1])); // 期望输出: true

// 测试 2: 不存在重复元素
console.log(containsDuplicate([1, 2, 3, 4])); // 期望输出: false

// 测试 3: 单个元素
console.log(containsDuplicate([1])); // 期望输出: false

// 测试 4: 多个相同元素
console.log(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])); // 期望输出: true

export {};
