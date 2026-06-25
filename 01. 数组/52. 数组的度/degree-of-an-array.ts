// ============================================================
// 52. 数组的度
// ============================================================
// LeetCode 697. Degree of an Array
// 给定非空整数数组 nums，数组的度是出现次数最多的元素的频数。
// 找到与 nums 具有相同度的最短连续子数组长度。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：哈希表记录每个元素的首次出现、末次出现和频次（推荐）
// 一次遍历建立 first/last/count 三个映射，度数最大的元素中，
// 取 (last - first + 1) 的最小值即为答案
function findShortestSubArray(nums: number[]): number {
  const first = new Map<number, number>();
  const last = new Map<number, number>();
  const count = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (!first.has(num)) first.set(num, i);
    last.set(num, i);
    count.set(num, (count.get(num) ?? 0) + 1);
  }

  // 求数组的度
  let degree = 0;
  for (const c of count.values()) {
    if (c > degree) degree = c;
  }

  // 在度数等于 degree 的元素中，找最短区间长度
  let minLen = nums.length;
  for (const [num, c] of count) {
    if (c === degree) {
      const f = first.get(num);
      const l = last.get(num);
      if (f !== undefined && l !== undefined) {
        minLen = Math.min(minLen, l - f + 1);
      }
    }
  }
  return minLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 52. 数组的度 =====");
console.log("描述:", findShortestSubArray([1, 2, 2, 3, 1])); // 期望结果: 2
console.log("描述:", findShortestSubArray([1, 2, 2, 3, 1, 4, 2])); // 期望结果: 6

export {};
