// ============================================================
// 079. 面试题 10.09. 排序矩阵查找
// ============================================================
// LeetCode 面试题 10.09 / 240. Sorted Matrix Search
// 给定 M x N 矩阵，每一行、每一列都按升序排列，判断元素是否存在。
// 时间复杂度：O(m+n), 空间复杂度：O(1)

// 方法1：从右上角开始搜索（推荐）
// 从右上角出发，当前值大于目标则左移一列，小于目标则下移一行
// 时间复杂度 O(m+n)，空间复杂度 O(1)
function searchMatrixCorner(matrix: number[][], target: number): boolean {
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
// 利用矩阵行列有序特性，以中心点划分四块，根据中心值与目标关系排除一块
// 时间复杂度 O(n^log3)，空间复杂度 O(log n) 递归栈
function searchMatrixDnC(matrix: number[][], target: number): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return false;
  }

  function search(rowTop: number, rowBottom: number, colLeft: number, colRight: number): boolean {
    if (rowTop > rowBottom || colLeft > colRight) {
      return false;
    }
    if (rowTop < 0 || rowBottom >= matrix.length || colLeft < 0 || colRight >= matrix[0].length) {
      return false;
    }
    const topLeft: number = matrix[rowTop][colLeft];
    const bottomRight: number = matrix[rowBottom][colRight];
    if (target < topLeft || target > bottomRight) {
      return false;
    }
    // 单行线性搜索
    if (rowTop === rowBottom) {
      for (let c: number = colLeft; c <= colRight; c++) {
        if (matrix[rowTop][c] === target) {
          return true;
        }
      }
      return false;
    }
    // 单列线性搜索
    if (colLeft === colRight) {
      for (let r: number = rowTop; r <= rowBottom; r++) {
        if (matrix[r][colLeft] === target) {
          return true;
        }
      }
      return false;
    }

    const rowMid: number = rowTop + Math.floor((rowBottom - rowTop) / 2);
    const colMid: number = colLeft + Math.floor((colRight - colLeft) / 2);
    const center: number = matrix[rowMid][colMid];
    if (center === target) {
      return true;
    } else if (target < center) {
      // 排除右下角，搜索左上、右上、左下
      return (
        search(rowTop, rowMid, colLeft, colMid) ||
        search(rowTop, rowMid, colMid + 1, colRight) ||
        search(rowMid + 1, rowBottom, colLeft, colMid)
      );
    } else {
      // 排除左上角，搜索右上、左下、右下
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
console.log("===== 079. 面试题 10.09. 排序矩阵查找 =====");
const matrix1: number[][] = [
  [1, 4, 7, 11, 15],
  [2, 5, 8, 12, 19],
  [3, 6, 9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30],
];
console.log(searchMatrixCorner(matrix1, 5)); // 期望结果: true
console.log(searchMatrixCorner(matrix1, 20)); // 期望结果: false
console.log(searchMatrixCorner([[1]], 1)); // 期望结果: true
console.log("--- 方法2测试 ---");
console.log(searchMatrixDnC(matrix1, 5)); // 期望结果: true
console.log(searchMatrixDnC(matrix1, 20)); // 期望结果: false
console.log(
  searchMatrixDnC(
    [
      [1, 2],
      [3, 4],
    ],
    3,
  ),
); // 期望结果: true
console.log(
  searchMatrixDnC(
    [
      [1, 2],
      [3, 4],
    ],
    5,
  ),
); // 期望结果: false

export {};
