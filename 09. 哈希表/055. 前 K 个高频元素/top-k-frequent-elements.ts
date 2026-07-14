// ============================================================
// 055. 前 K 个高频元素
// ============================================================
// LeetCode 347. Top K Frequent Elements
// 给定非空整数数组，返回其中出现频率前 k 高的元素。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 哈希表计数 + 桶排序
// 1. 用哈希表统计每个元素出现频率
// 2. 将元素按频率放入桶中（桶下标为频率）
// 3. 从高到低遍历桶，收集前 k 个元素
function topKFrequent(nums: number[], k: number): number[] {
  // 第一步：哈希表统计频率
  const freqMap = new Map<number, number>();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // 第二步：桶排序，桶下标为频率
  // 桶的数量最多为 nums.length + 1
  const bucket: number[][] = new Array(nums.length + 1);
  for (let i = 0; i < bucket.length; i++) {
    bucket[i] = [];
  }
  for (const [num, freq] of freqMap) {
    bucket[freq].push(num);
  }

  // 第三步：从高频桶向低频桶遍历，收集结果
  const result: number[] = [];
  for (let i = bucket.length - 1; i >= 0 && result.length < k; i--) {
    if (bucket[i].length > 0) {
      for (const num of bucket[i]) {
        result.push(num);
        if (result.length === k) break;
      }
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 055. 前 K 个高频元素 =====");

// 测试 1
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // 期望: [1, 2]

// 测试 2
console.log(topKFrequent([1], 1)); // 期望: [1]

// 测试 3
console.log(topKFrequent([4, 4, 4, 5, 5, 6, 6, 6, 6], 2)); // 期望: [6, 4]

export {};
