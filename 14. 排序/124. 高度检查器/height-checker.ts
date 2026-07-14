// ============================================================
// 124. 高度检查器
// ============================================================
// LeetCode 1051. Height Checker
// 给定站队高度数组 heights，返回与"非降序排序后"位置不同的下标个数。

// 方法1：排序后逐位比较（时间 O(n log n)，空间 O(n)）
function heightChecker(heights: number[]): number {
  const expected = [...heights].sort((a, b) => a - b);
  let count = 0;
  for (let i = 0; i < heights.length; i++) {
    if (heights[i] !== expected[i]) count++;
  }
  return count;
}

// 方法2：计数排序（时间 O(n + k)，空间 O(k)，k=101，高度范围 1..100）
// 用频率数组还原排序后的序列，再逐位比较。
function heightChecker2(heights: number[]): number {
  const MAX_H = 101;
  const freq = new Array<number>(MAX_H).fill(0);
  for (const h of heights) freq[h]++;

  let count = 0;
  let idx = 0;
  for (let h = 1; h < MAX_H; h++) {
    for (let f = 0; f < freq[h]; f++) {
      if (heights[idx] !== h) count++;
      idx++;
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 124. 高度检查器 =====");
console.log("方法1:", heightChecker([1, 1, 4, 2, 1, 3])); // 期望: 3
console.log("方法1:", heightChecker([5, 1, 2, 3, 4])); // 期望: 5
console.log("方法1:", heightChecker([1, 2, 3, 4, 5])); // 期望: 0
console.log("方法2:", heightChecker2([1, 1, 4, 2, 1, 3])); // 期望: 3
console.log("方法2:", heightChecker2([5, 1, 2, 3, 4])); // 期望: 5
console.log("方法2:", heightChecker2([1, 2, 3, 4, 5])); // 期望: 0

export {};
