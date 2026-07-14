// ============================================================
// 072. LCR 121. 寻找目标值 - 二维数组
// ============================================================
// LeetCode 240. Search a 2D Matrix II
// 在一个 m x n 的二维矩阵中查找目标值。该矩阵具有以下特性：
// 每行的元素从左到右升序排列；每列的元素从上到下升序排列。
// 时间复杂度：O(m+n), 空间复杂度：O(1)

// 方法1：从右上角开始搜索（推荐）
// 从右上角出发，若当前值大于目标则左移，小于目标则下移
// 时间复杂度 O(m+n)，空间复杂度 O(1)
function findTargetIn2DMatrixCorner(matrix: number[][], target: number): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return false;
  }
  const m: number = matrix.length;
  const n: number = matrix[0].length;
  let row: number = 0;
  let col: number = n - 1;
  while (row < m && col >= 0) {
    const cur: number = matrix[row][col];
    if (cur === target) {
      return true;
    } else if (cur > target) {
      col--;
    } else {
      row++;
    }
  }
  return false;
}

// 方法2：分治 - 四分矩阵
// 将矩阵分成四块，根据左上角与右下角的关系排除部分子矩阵，递归搜索剩余
// 时间复杂度 O(n^log3)，空间复杂度 O(log n) 递归栈
function findTargetIn2DMatrixDnC(matrix: number[][], target: number): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return false;
  }

  function search(rowTop: number, rowBottom: number, colLeft: number, colRight: number): boolean {
    if (rowTop > rowBottom || colLeft > colRight) {
      return false;
    }
    // 越界检查
    if (rowTop < 0 || rowBottom >= matrix.length || colLeft < 0 || colRight >= matrix[0].length) {
      return false;
    }
    const topLeft: number = matrix[rowTop][colLeft];
    const bottomRight: number = matrix[rowBottom][colRight];
    // 目标超出范围
    if (target < topLeft || target > bottomRight) {
      return false;
    }
    // 单行或单列时线性搜索
    if (rowTop === rowBottom) {
      for (let c: number = colLeft; c <= colRight; c++) {
        if (matrix[rowTop][c] === target) {
          return true;
        }
      }
      return false;
    }
    if (colLeft === colRight) {
      for (let r: number = rowTop; r <= rowBottom; r++) {
        if (matrix[r][colLeft] === target) {
          return true;
        }
      }
      return false;
    }

    // 选择中心点进行四分
    const rowMid: number = rowTop + Math.floor((rowBottom - rowTop) / 2);
    const colMid: number = colLeft + Math.floor((colRight - colLeft) / 2);
    const center: number = matrix[rowMid][colMid];
    if (center === target) {
      return true;
    } else if (target < center) {
      // 排除右下角，搜索左上、右上、左下三个子矩阵
      return (
        search(rowTop, rowMid, colLeft, colMid) ||
        search(rowTop, rowMid, colMid + 1, colRight) ||
        search(rowMid + 1, rowBottom, colLeft, colMid)
      );
    } else {
      // 排除左上角，搜索右上、左下、右下三个子矩阵
      return (
        search(rowTop, rowMid, colMid + 1, colRight) ||
        search(rowMid + 1, rowBottom, colLeft, colMid) ||
        search(rowMid + 1, rowBottom, colMid + 1, colRight)
      );
    }
  }

  return search(0, matrix.length - 1, 0, matrix[0].length - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 072. LCR 121. 寻找目标值 - 二维数组 =====");
const matrix1: number[][] = [
  [1, 4, 7, 11, 15],
  [2, 5, 8, 12, 19],
  [3, 6, 9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30],
];
console.log(findTargetIn2DMatrixCorner(matrix1, 5)); // 期望结果: true
console.log(findTargetIn2DMatrixCorner(matrix1, 20)); // 期望结果: false
console.log(findTargetIn2DMatrixCorner([], 1)); // 期望结果: false
console.log("--- 方法2测试 ---");
console.log(findTargetIn2DMatrixDnC(matrix1, 5)); // 期望结果: true
console.log(findTargetIn2DMatrixDnC(matrix1, 20)); // 期望结果: false
console.log(
  findTargetIn2DMatrixDnC(
    [
      [1, 2],
      [3, 4],
    ],
    3,
  ),
); // 期望结果: true

export {};
