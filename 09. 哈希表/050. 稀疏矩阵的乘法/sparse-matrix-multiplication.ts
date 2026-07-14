// ============================================================
// 050. 稀疏矩阵的乘法
// ============================================================
// LeetCode 311. Sparse Matrix Multiplication
// 给定两个稀疏矩阵 mat1 (m x k) 和 mat2 (k x n)，返回它们的乘积。
// 使用哈希表存储非零元素以跳过大量零值的乘法运算。
// 时间复杂度：O(m * k * n)（实际远小于此，因为只计算非零元素）
// 空间复杂度：O(非零元素个数)

function multiply(mat1: number[][], mat2: number[][]): number[][] {
  const m = mat1.length;
  const k = mat1[0].length;
  const n = mat2[0].length;

  // 结果矩阵 m x n
  const result: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));

  // 用哈希表存储 mat2 每行的非零元素：rowMap[行号] = Map<列号, 值>
  // 这样遍历 mat1[i][p] 时，只需与 mat2 第 p 行的非零列相乘
  const rowMap: Map<number, number>[] = new Array(k);
  for (let p = 0; p < k; p++) {
    rowMap[p] = new Map();
    for (let j = 0; j < n; j++) {
      if (mat2[p][j] !== 0) {
        rowMap[p].set(j, mat2[p][j]);
      }
    }
  }

  // 遍历 mat1 的每个非零元素
  for (let i = 0; i < m; i++) {
    for (let p = 0; p < k; p++) {
      if (mat1[i][p] === 0) continue; // 跳过零元素
      const val = mat1[i][p];
      // 将 mat1[i][p] 与 mat2 第 p 行的所有非零列相乘
      for (const [j, mat2Val] of rowMap[p]) {
        result[i][j] += val * mat2Val;
      }
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 050. 稀疏矩阵的乘法 =====");
console.log(
  multiply(
    [
      [1, 0, 0],
      [-1, 0, 3],
    ],
    [
      [7, 0, 0],
      [0, 0, 0],
      [0, 0, 1],
    ],
  ),
);
// [[7,0,0],[-7,0,3]]

console.log(multiply([[0]], [[0]]));
// [[0]]

console.log(
  multiply(
    [
      [1, 2],
      [3, 4],
    ],
    [
      [5, 6],
      [7, 8],
    ],
  ),
);
// [[19,22],[43,50]]

export {};
