// ============================================================
// 079. 至少是其他数字两倍的最大数
// ============================================================
// LeetCode 747. Largest Number At Least Twice of Others
// 判断数组中最大数是否至少为其余每个数的两倍，是则返回其下标，否则 -1。

// 方法1：一次遍历记录最大与次大（推荐，O(n)）
// 思路：维护最大值 max 与次大值 second，最大值 >= 2*second 即满足条件。
function dominantIndex(nums: number[]): number {
  let max = -1;
  let second = -1;
  let maxIdx = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > max) {
      second = max;
      max = nums[i];
      maxIdx = i;
    } else if (nums[i] > second) {
      second = nums[i];
    }
  }
  return max >= 2 * second ? maxIdx : -1;
}

// 方法2：排序（O(n log n)）
// 思路：排序后比较最大值与次大值，需保留原始下标。
function dominantIndex2(nums: number[]): number {
  if (nums.length === 1) return 0;
  const indexed = nums.map((v, idx) => ({ v, idx }));
  indexed.sort((a, b) => b.v - a.v);
  return indexed[0].v >= 2 * indexed[1].v ? indexed[0].idx : -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 079. 至少是其他数字两倍的最大数 =====");
console.log("方法1:", dominantIndex([3, 6, 1, 0])); // 期望 1
console.log("方法1:", dominantIndex([1, 2, 3, 4])); // 期望 -1
console.log("方法1:", dominantIndex([1])); // 期望 0
console.log("方法2:", dominantIndex2([3, 6, 1, 0])); // 期望 1
console.log("方法2:", dominantIndex2([1, 2, 3, 4])); // 期望 -1
console.log("方法2:", dominantIndex2([1])); // 期望 0

export {};
