// ============================================================
// 42. 区间加法 II
// ============================================================
// LeetCode 598. Range Addition II
// 给定 m x n 矩阵初始全为0，和一个 ops 数组，ops[i] = [ai, bi] 表示对矩阵左上角 ai x bi 的区域加1。返回矩阵中最大整数的个数。
// 时间复杂度：O(k)，空间复杂度：O(1)

// 方法1：找所有操作的最小行和最小列（推荐）
function maxCount(m: number, n: number, ops: number[][]): number {
  // 所有操作都会对左上角区域做加1，最大整数的区域必然是所有操作区域的交集
  // 即 min(ops[i][0]) x min(ops[i][1]) 的区域
  let minRow = m;
  let minCol = n;

  for (const [a, b] of ops) {
    minRow = Math.min(minRow, a);
    minCol = Math.min(minCol, b);
  }

  return minRow * minCol;
}

// 方法2：考虑 ops 为空的边界情况（独立处理）
function maxCountWithCheck(m: number, n: number, ops: number[][]): number {
  if (ops.length === 0) {
    return m * n;
  }

  let minRow = Infinity;
  let minCol = Infinity;
  for (const [a, b] of ops) {
    minRow = Math.min(minRow, a);
    minCol = Math.min(minCol, b);
  }

  return minRow * minCol;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 42. 区间加法 II =====");
console.log(
  "最小行列:",
  maxCount(3, 3, [
    [2, 2],
    [3, 3],
  ]),
); // 期望结果: 4
console.log("最小行列:", maxCount(3, 3, [])); // 期望结果: 9
console.log(
  "最小行列:",
  maxCount(3, 3, [
    [2, 2],
    [3, 3],
    [1, 5],
  ]),
); // 期望结果: 2
console.log(
  "边界检查:",
  maxCountWithCheck(3, 3, [
    [2, 2],
    [3, 3],
  ]),
); // 期望结果: 4
console.log("边界检查:", maxCountWithCheck(3, 3, [])); // 期望结果: 9

export {};
