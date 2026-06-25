// ============================================================
// 39. 重塑矩阵
// ============================================================
// LeetCode 566. Reshape the Matrix
// 给定 m x n 矩阵 mat 和目标行数 r、列数 c，将矩阵重塑为 r x c。如果不合法则返回原矩阵。
// 时间复杂度：O(m*n)，空间复杂度：O(m*n)

// 方法1：一维索引映射（推荐）
function matrixReshape(mat: number[][], r: number, c: number): number[][] {
  const m = mat.length;
  const n = mat[0].length;

  // 元素总数不匹配，返回原矩阵
  if (m * n !== r * c) {
    return mat;
  }

  // 初始化 r x c 的结果矩阵
  const result: number[][] = Array.from({ length: r }, () =>
    new Array(c).fill(0),
  );

  // 一维索引映射：原矩阵 (i,j) -> 索引 k = i*n + j
  //                结果矩阵 k -> (k/c, k%c)
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const index = i * n + j; // 一维索引
      const newRow = Math.floor(index / c);
      const newCol = index % c;
      result[newRow][newCol] = mat[i][j];
    }
  }

  return result;
}

// 方法2：队列模拟
function matrixReshapeQueue(mat: number[][], r: number, c: number): number[][] {
  const m = mat.length;
  const n = mat[0].length;

  if (m * n !== r * c) {
    return mat;
  }

  // 将所有元素放入队列（按行优先顺序）
  const queue: number[] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      queue.push(mat[i][j]);
    }
  }

  // 从队列依次取出填充新矩阵
  const result: number[][] = [];
  for (let i = 0; i < r; i++) {
    const row: number[] = [];
    for (let j = 0; j < c; j++) {
      row.push(queue.shift()!);
    }
    result.push(row);
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 39. 重塑矩阵 =====");
console.log(
  "描述:",
  matrixReshape(
    [
      [1, 2],
      [3, 4],
    ],
    1,
    4,
  ),
); // 期望结果: [[1,2,3,4]]
console.log(
  "描述:",
  matrixReshape(
    [
      [1, 2],
      [3, 4],
    ],
    4,
    1,
  ),
); // 期望结果: [[1],[2],[3],[4]]
console.log(
  "描述:",
  matrixReshape(
    [
      [1, 2],
      [3, 4],
    ],
    2,
    4,
  ),
); // 期望结果: [[1,2],[3,4]] (不合法)
console.log(
  "描述:",
  matrixReshapeQueue(
    [
      [1, 2],
      [3, 4],
    ],
    1,
    4,
  ),
); // 期望结果: [[1,2,3,4]]

export {};
