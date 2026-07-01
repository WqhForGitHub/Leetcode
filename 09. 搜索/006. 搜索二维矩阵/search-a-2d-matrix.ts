// ============================================================
// 006. 搜索二维矩阵
// ============================================================
// LeetCode 74. Search a 2D Matrix
// 每行中的整数从左到右升序排列，每行的第一个整数大于前一行的最后一个整数。
// 判断目标值是否在矩阵中。时间复杂度 O(log(m*n))。

// 方法1：将矩阵当作一维数组二分
function searchMatrix(matrix: number[][], target: number): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) return false;
  const m = matrix.length;
  const n = matrix[0].length;
  let left = 0;
  let right = m * n - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const val = matrix[Math.floor(mid / n)][mid % n];
    if (val === target) return true;
    if (val < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return false;
}

// 方法2：先二分找行，再二分找列
function searchMatrixTwoPhase(matrix: number[][], target: number): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) return false;
  const m = matrix.length;
  const n = matrix[0].length;
  // 找到 target 可能所在行
  let top = 0;
  let bottom = m - 1;
  let row = -1;
  while (top <= bottom) {
    const mid = Math.floor((top + bottom) / 2);
    if (matrix[mid][0] <= target && target <= matrix[mid][n - 1]) {
      row = mid;
      break;
    } else if (matrix[mid][n - 1] < target) {
      top = mid + 1;
    } else {
      bottom = mid - 1;
    }
  }
  if (row === -1) return false;
  // 在该行二分查找
  let left = 0;
  let right = n - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (matrix[row][mid] === target) return true;
    if (matrix[row][mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 006. 搜索二维矩阵 =====");
const mat = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60],
];
console.log("一维二分 3:", searchMatrix(mat, 3)); // true
console.log("一维二分 13:", searchMatrix(mat, 13)); // false
console.log("两阶段 3:", searchMatrixTwoPhase(mat, 3)); // true
console.log("两阶段 13:", searchMatrixTwoPhase(mat, 13)); // false

export {};
