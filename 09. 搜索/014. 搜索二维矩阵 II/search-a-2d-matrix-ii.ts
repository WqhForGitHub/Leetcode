// ============================================================
// 014. 搜索二维矩阵 II
// ============================================================
// LeetCode 240. Search a 2D Matrix II
// 矩阵中每行从左到右升序，每列从上到下升序。判断目标值是否在矩阵中。

// 方法1：从右上角开始搜索（推荐，O(m+n)）
function searchMatrixII(matrix: number[][], target: number): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) return false;
  const m = matrix.length;
  const n = matrix[0].length;
  let row = 0;
  let col = n - 1;
  while (row < m && col >= 0) {
    if (matrix[row][col] === target) return true;
    if (matrix[row][col] < target) {
      row++;
    } else {
      col--;
    }
  }
  return false;
}

// 方法2：每行二分查找（O(m log n)）
function searchMatrixIIRowBinary(
  matrix: number[][],
  target: number
): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) return false;
  for (const row of matrix) {
    let left = 0;
    let right = row.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (row[mid] === target) return true;
      if (row[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 014. 搜索二维矩阵 II =====");
const mat2 = [
  [1, 4, 7, 11, 15],
  [2, 5, 8, 12, 19],
  [3, 6, 9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30],
];
console.log("右上角 5:", searchMatrixII(mat2, 5)); // true
console.log("右上角 20:", searchMatrixII(mat2, 20)); // false
console.log("行二分 5:", searchMatrixIIRowBinary(mat2, 5)); // true

export {};
