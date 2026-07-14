// ============================================================
// 219. 重新排列后的最大子矩阵
// ============================================================
// LeetCode 1727. Largest Submatrix With Rearrangements
// 给定二进制矩阵，可对每一行的列任意重排，
// 求由全 1 组成的最大子矩阵面积。

// 方法1：高度前缀 + 每行排序 + 贪心（O(m * n log n)）
// heights[j] 为以当前行为底、第 j 列连续 1 的高度；
// 每行排序后，宽度为 (j+1)，高度为 sorted[j]，取最大面积。
function largestSubmatrix(matrix: number[][]): number {
  const m = matrix.length;
  const n = matrix[0].length;
  const heights = new Array<number>(n).fill(0);
  let result = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      heights[j] = matrix[i][j] === 1 ? heights[j] + 1 : 0;
    }
    const sorted = [...heights].sort((a, b) => b - a);
    for (let j = 0; j < n; j++) {
      if (sorted[j] === 0) break;
      result = Math.max(result, sorted[j] * (j + 1));
    }
  }
  return result;
}

// 方法2：直方图 + 排序（等价写法）（O(m * n log n)）
// 使用索引遍历累计最大矩形面积，逻辑与方法1一致。
function largestSubmatrix2(matrix: number[][]): number {
  const m = matrix.length;
  const n = matrix[0].length;
  const heights = new Array<number>(n).fill(0);
  let result = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      heights[j] = matrix[i][j] ? heights[j] + 1 : 0;
    }
    const sortedHeights = [...heights].sort((a, b) => b - a);
    for (let k = 0; k < n; k++) {
      const h = sortedHeights[k];
      if (h === 0) break;
      const area = h * (k + 1);
      if (area > result) result = area;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 219. 重新排列后的最大子矩阵 =====");
console.log(
  "方法1 [[0,0,1],[1,1,1],[1,0,1]]:",
  largestSubmatrix([
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
  ]),
); // 4
console.log("方法1 [[1,0,1,0,1]]:", largestSubmatrix([[1, 0, 1, 0, 1]])); // 3
console.log(
  "方法2 [[0,0,1],[1,1,1],[1,0,1]]:",
  largestSubmatrix2([
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
  ]),
); // 4
console.log("方法2 [[1,0,1,0,1]]:", largestSubmatrix2([[1, 0, 1, 0, 1]])); // 3

export {};
