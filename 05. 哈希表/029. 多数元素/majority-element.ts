// ============================================================
// 029. 多数元素
// ============================================================
// LeetCode 169. Majority Element
// 给定大小为 n 的数组，找出其中出现次数超过 n/2 的元素（多数元素）。
// 使用哈希表计数方法。
// 时间复杂度：O(n)，空间复杂度：O(n)

function majorityElement(nums: number[]): number {
  // 哈希表：元素 -> 出现次数
  const countMap: Map<number, number> = new Map();
  const majorityCount = Math.floor(nums.length / 2);

  for (const num of nums) {
    const cnt = (countMap.get(num) || 0) + 1;
    countMap.set(num, cnt);
    // 出现次数超过 n/2，直接返回
    if (cnt > majorityCount) {
      return num;
    }
  }
  // 题目保证存在多数元素，理论上不会走到这里
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 029. 多数元素 =====");
console.log(majorityElement([3, 2, 3])); // 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2
console.log(majorityElement([1])); // 1
console.log(majorityElement([6, 5, 5])); // 5

export {};
