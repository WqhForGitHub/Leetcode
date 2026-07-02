// ============================================================
// 014. 搜索二维矩阵 II
// ============================================================
// LeetCode 240. Search a 2D Matrix II
// 在一个 m x n 矩阵中搜索目标值，该矩阵具有以下特性：
// 每行的元素从左到右升序排列，每列的元素从上到下升序排列。
// 时间复杂度：O(m+n) / O(n^log3), 空间复杂度：O(1) / O(log n)

// 方法1：从左下角开始搜索（推荐）
// 左下角元素：向右递增、向上递减，每次可排除一行或一列
function searchMatrix1(matrix: number[][], target: number): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) return false;
  const m: number = matrix.length;
  const n: number = matrix[0].length;
  let row: number = m - 1;
  let col: number = 0;
  while (row >= 0 && col < n) {
    if (matrix[row][col] === target) return true;
    if (matrix[row][col] > target) {
      row--;
    } else {
      col++;
    }
  }
  return false;
}

// 方法2：分治 - 四象限划分
// 选取中心点，与 target 比较后可排除一个象限，递归搜索其余区域
function searchMatrix2(matrix: number[][], target: number): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) return false;
  const m: number = matrix.length;
  const n: number = matrix[0].length;
  return searchQuad(matrix, target, 0, m - 1, 0, n - 1);
}

// 在子矩阵 [top..bottom] x [left..right] 中分治搜索
function searchQuad(
  matrix: number[][],
  target: number,
  top: number,
  bottom: number,
  left: number,
  right: number,
): boolean {
  if (top > bottom || left > right) return false;
  // 剪枝：目标值超出当前子矩阵的最小/最大值范围
  if (target < matrix[top][left] || target > matrix[bottom][right]) return false;
  const midRow: number = (top + bottom) >> 1;
  const midCol: number = (left + right) >> 1;
  if (matrix[midRow][midCol] === target) return true;
  if (matrix[midRow][midCol] > target) {
    // 中心大于目标，右下象限全部 > 目标，排除右下象限
    // 搜索：上半部分 [top..midRow-1] x [left..right]
    //       左下部分 [midRow..bottom] x [left..midCol-1]
    return (
      searchQuad(matrix, target, top, midRow - 1, left, right) ||
      searchQuad(matrix, target, midRow, bottom, left, midCol - 1)
    );
  } else {
    // 中心小于目标，左上象限全部 < 目标，排除左上象限
    // 搜索：下半部分 [midRow+1..bottom] x [left..right]
    //       右上部分 [top..midRow] x [midCol+1..right]
    return (
      searchQuad(matrix, target, midRow + 1, bottom, left, right) ||
      searchQuad(matrix, target, top, midRow, midCol + 1, right)
    );
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 014. 搜索二维矩阵 II =====");
const matrix: number[][] = [
  [1, 4, 7, 11, 15],
  [2, 5, 8, 12, 19],
  [3, 6, 9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30],
];
console.log("方法1:", searchMatrix1(matrix, 5)); // 期望结果: true
console.log("方法2:", searchMatrix2(matrix, 5)); // 期望结果: true
console.log("方法1:", searchMatrix1(matrix, 20)); // 期望结果: false
console.log("方法2:", searchMatrix2(matrix, 20)); // 期望结果: false
console.log("方法1:", searchMatrix1(matrix, 30)); // 期望结果: true
console.log("方法2:", searchMatrix2(matrix, 1)); // 期望结果: true
console.log("方法2:", searchMatrix2(matrix, 24)); // 期望结果: true
console.log("方法1:", searchMatrix1([[1]], 1)); // 期望结果: true
console.log("方法2:", searchMatrix2([[1]], 2)); // 期望结果: false

export {};
