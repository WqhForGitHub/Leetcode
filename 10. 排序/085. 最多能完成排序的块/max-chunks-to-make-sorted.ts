// ============================================================
// 085. 最多能完成排序的块
// ============================================================
// LeetCode 769. Max Chunks To Make Sorted
// 给定 [0, n-1] 的排列，分成最多块，每块单独排序后拼接得到 [0, n-1]。
// 求最大块数。

// 方法1：跟踪前缀最大值（推荐，O(n)）
// 思路：对于排列 [0, n-1]，当遍历到位置 i 时，如果前缀最大值恰好等于 i，
//       说明前缀 [0..i] 包含的元素恰好是 {0, 1, ..., i}，可以在此切分。
function maxChunksToSorted(arr: number[]): number {
  let maxSoFar = 0;
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    maxSoFar = Math.max(maxSoFar, arr[i]);
    // 前缀最大值等于当前位置 => 可以在此处切分
    if (maxSoFar === i) {
      count++;
    }
  }

  return count;
}

// 方法2：前缀最大值与后缀最小值比较（O(n)）
// 思路：预处理后缀最小值数组，当位置 i 的前缀最大值 <= 位置 i+1 的后缀最小值时，
//       可以在 i 和 i+1 之间切分。
function maxChunksToSorted2(arr: number[]): number {
  const n = arr.length;

  // suffixMin[i] = min(arr[i], arr[i+1], ..., arr[n-1])
  const suffixMin: number[] = new Array(n + 1);
  suffixMin[n] = Infinity;
  for (let i = n - 1; i >= 0; i--) {
    suffixMin[i] = Math.min(arr[i], suffixMin[i + 1]);
  }

  let count = 0;
  let maxSoFar = 0;

  for (let i = 0; i < n; i++) {
    maxSoFar = Math.max(maxSoFar, arr[i]);
    // 前缀最大值 <= 后缀最小值 => 可以切分
    if (maxSoFar <= suffixMin[i + 1]) {
      count++;
    }
  }

  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 085. 最多能完成排序的块 =====");

console.log("测试1:", maxChunksToSorted([4, 3, 2, 1, 0])); // 期望: 1
console.log("测试2:", maxChunksToSorted([1, 0, 2, 3, 4])); // 期望: 4
console.log("测试3:", maxChunksToSorted([0])); // 期望: 1
console.log("测试4:", maxChunksToSorted([1, 2, 0, 3, 4])); // 期望: 3

console.log("方法2测试1:", maxChunksToSorted2([4, 3, 2, 1, 0])); // 期望: 1
console.log("方法2测试2:", maxChunksToSorted2([1, 0, 2, 3, 4])); // 期望: 4
console.log("方法2测试3:", maxChunksToSorted2([0])); // 期望: 1

export {};
