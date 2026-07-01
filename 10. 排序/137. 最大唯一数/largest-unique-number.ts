// ============================================================
// 137. 最大唯一数
// ============================================================
// LeetCode 1133. Largest Unique Number
// 给定一个整数数组 nums，返回其中只出现一次的最大数字；若不存在则返回 -1。

// 方法1：哈希表统计次数（推荐，时间 O(n)，空间 O(n)）
// 用 Map 统计每个数字出现次数，再遍历 Map 找出出现次数为 1 的最大数字。
function largestUniqueNumber(nums: number[]): number {
  const count = new Map<number, number>();
  for (const num of nums) {
    count.set(num, (count.get(num) ?? 0) + 1);
  }
  let ans = -1;
  for (const [num, c] of count) {
    if (c === 1 && num > ans) {
      ans = num;
    }
  }
  return ans;
}

// 方法2：排序后从后向前扫描（时间 O(n log n)，空间 O(log n)）
// 排序后从大到小遍历，遇到出现一次的数字即为答案。
function largestUniqueNumber2(nums: number[]): number {
  if (nums.length === 0) return -1;
  const sorted = [...nums].sort((a, b) => a - b);
  let i = sorted.length - 1;
  while (i >= 0) {
    // 当前数字与相邻数字都不同时只出现一次
    if ((i === sorted.length - 1 || sorted[i] !== sorted[i + 1]) &&
        (i === 0 || sorted[i] !== sorted[i - 1])) {
      return sorted[i];
    }
    // 跳过与当前相同的数字，避免重复检查
    if (i > 0 && sorted[i] === sorted[i - 1]) {
      i--;
    } else {
      i--;
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 137. 最大唯一数 =====");
console.log("方法1:", largestUniqueNumber([5, 7, 3, 9, 4, 9, 8, 3, 1])); // 期望: 8
console.log("方法1:", largestUniqueNumber([9, 9, 8, 8])); // 期望: -1
console.log("方法1:", largestUniqueNumber([1])); // 期望: 1
console.log("方法2:", largestUniqueNumber2([5, 7, 3, 9, 4, 9, 8, 3, 1])); // 期望: 8
console.log("方法2:", largestUniqueNumber2([9, 9, 8, 8])); // 期望: -1
console.log("方法2:", largestUniqueNumber2([1])); // 期望: 1

export {};
