// ============================================================
// 037. 多数元素 II
// ============================================================
// LeetCode 229. Majority Element II
// 找出现超过 n/3 次的元素。哈希表计数。
// 时间复杂度：O(n)，空间复杂度：O(n)

/**
 * 使用哈希表统计每个元素出现次数
 * 返回所有出现次数超过 n/3 的元素
 */
function majorityElement(nums: number[]): number[] {
  const countMap = new Map<number, number>();
  const n = nums.length;
  const threshold = Math.floor(n / 3);

  // 统计每个元素出现次数
  for (const num of nums) {
    countMap.set(num, (countMap.get(num) ?? 0) + 1);
  }

  // 收集出现次数超过 n/3 的元素
  const result: number[] = [];
  for (const [num, count] of countMap) {
    if (count > threshold) {
      result.push(num);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 037. 多数元素 II =====");
// 测试 1: 多个多数元素
console.log(majorityElement([3, 2, 3])); // 期望输出: [3]

// 测试 2: 两个多数元素
console.log(majorityElement([1, 1, 1, 3, 3, 2, 2, 2])); // 期望输出: [1,2]

// 测试 3: 单个元素
console.log(majorityElement([1])); // 期望输出: [1]

// 测试 4: 所有元素相同
console.log(majorityElement([2, 2, 2, 2])); // 期望输出: [2]

export {};
