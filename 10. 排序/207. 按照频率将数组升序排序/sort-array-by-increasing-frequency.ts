// ============================================================
// 207. 按照频率将数组升序排序
// ============================================================
// LeetCode 1636. Sort Array by Increasing Frequency
// 给定数组，按频率升序排序，频率相同时按值降序排序。

// 方法1：频率统计 + 自定义排序比较器（O(n log n)）
function frequencySort(nums: number[]): number[] {
  const freq = new Map<number, number>();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  return nums.sort((a, b) => {
    const fa = freq.get(a)!;
    const fb = freq.get(b)!;
    if (fa !== fb) return fa - fb; // 频率升序
    return b - a; // 频率相同，值降序
  });
}

// 方法2：频率统计 + 桶排序（O(n)）
function frequencySort2(nums: number[]): number[] {
  const freq = new Map<number, number>();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // 按频率分桶
  const maxFreq = Math.max(...freq.values());
  const buckets: number[][] = Array.from({ length: maxFreq + 1 }, () => []);

  // 将每个唯一数字放入对应频率的桶
  for (const [num, f] of freq) {
    buckets[f].push(num);
  }

  // 每个桶内按值降序排序
  for (const bucket of buckets) {
    bucket.sort((a, b) => b - a);
  }

  // 从低频率到高频率收集结果
  const result: number[] = [];
  for (let f = 1; f <= maxFreq; f++) {
    for (const num of buckets[f]) {
      for (let i = 0; i < f; i++) {
        result.push(num);
      }
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 207. 按照频率将数组升序排序 =====");
console.log("方法1 [1,1,2,2,2,3]:", frequencySort([1, 1, 2, 2, 2, 3]));
console.log("方法2 [1,1,2,2,2,3]:", frequencySort2([1, 1, 2, 2, 2, 3]));
console.log("方法1 [2,3,1,3,2]:", frequencySort([2, 3, 1, 3, 2]));
console.log("方法2 [2,3,1,3,2]:", frequencySort2([2, 3, 1, 3, 2]));
console.log("方法1 [-1,1,-6,4,5,-6,1,4,1,5]:", frequencySort([-1, 1, -6, 4, 5, -6, 1, 4, 1, 5]));
console.log("方法2 [-1,1,-6,4,5,-6,1,4,1,5]:", frequencySort2([-1, 1, -6, 4, 5, -6, 1, 4, 1, 5]));

export {};
