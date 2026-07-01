// ============================================================
// 110. 统计有序矩阵中的负数
// ============================================================
// LeetCode 1351. Count Negative Numbers in a Sorted Matrix
// 行列降序矩阵中负数的个数。

// 方法1：每行二分查找
function countNegatives(grid: number[][]): number {
  let count = 0;
  const n = grid[0].length;
  for (const row of grid) {
    // 二分找第一个负数的位置
    let lo = 0;
    let hi = n - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (row[mid] < 0) {
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    count += n - lo;
  }
  return count;
}

// 方法2：从左下角开始遍历（O(m+n)）
function countNegativesStaircase(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  let count = 0;
  let row = m - 1;
  let col = 0;
  while (row >= 0 && col < n) {
    if (grid[row][col] < 0) {
      count += n - col;
      row--;
    } else {
      col++;
    }
  }
  return count;
}

// 方法3：从右上角遍历
function countNegativesTopRight(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  let count = 0;
  let row = 0;
  let col = n - 1;
  while (row < m && col >= 0) {
    if (grid[row][col] < 0) {
      count += m - row;
      col--;
    } else {
      row++;
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 110. 统计有序矩阵中的负数 =====");
console.log("二分 [[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]]:",
  countNegatives([[4, 3, 2, -1], [3, 2, 1, -1], [1, 1, -1, -2], [-1, -1, -2, -3]])); // 8
console.log("阶梯 [[3,2],[1,0]]:",
  countNegativesStaircase([[3, 2], [1, 0]])); // 0
console.log("右上 [[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]]:",
  countNegativesTopRight([[4, 3, 2, -1], [3, 2, 1, -1], [1, 1, -1, -2], [-1, -1, -2, -3]])); // 8

export {};
