// ============================================================
// 15. 多数元素
// ============================================================
// LeetCode 169. Majority Element
// 给定大小为 n 的数组，找出出现次数大于 n/2 的元素（多数元素）。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：Boyer-Moore 投票算法（推荐）
// 候选人配对抵消：相同则 +1，不同则 -1，count 为 0 时换候选人
// 由于多数元素出现次数 > n/2，最终剩下的候选人一定是多数元素
function majorityElement(nums: number[]): number {
  let candidate = nums[0];
  let count = 0;

  for (const num of nums) {
    if (count === 0) {
      candidate = num; // 更换候选人
    }
    count += num === candidate ? 1 : -1;
  }

  return candidate;
}

// 方法2：哈希表计数
function majorityElementHash(nums: number[]): number {
  const map = new Map<number, number>();
  const half = Math.floor(nums.length / 2);
  for (const num of nums) {
    const c = (map.get(num) ?? 0) + 1;
    if (c > half) return num;
    map.set(num, c);
  }
  return nums[0];
}

// 方法3：排序取中间
// 多数元素出现次数 > n/2，排序后下标 n/2 的位置必然是多数元素
function majorityElementSort(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 15. 多数元素 =====");
console.log("描述:", majorityElement([3, 2, 3])); // 期望结果: 3
console.log("描述:", majorityElement([2, 2, 1, 1, 1, 2, 2])); // 期望结果: 2
console.log("描述:", majorityElementHash([3, 2, 3])); // 期望结果: 3
console.log("描述:", majorityElementHash([2, 2, 1, 1, 1, 2, 2])); // 期望结果: 2
console.log("描述:", majorityElementSort([3, 2, 3])); // 期望结果: 3
console.log("描述:", majorityElementSort([2, 2, 1, 1, 1, 2, 2])); // 期望结果: 2

export {};
