// ============================================================
// 153. 寻找峰值 II
// ============================================================
// LeetCode 1901. Find a Peak Element II
// 二维矩阵中找峰值（大于上下左右），O(m log n) 或 O(m+n)。

// 方法1：二分查找行
function findPeakGrid(mat: number[][]): number[] {
  const m = mat.length;
  const n = mat[0].length;
  let lo = 0;
  let hi = m - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    // 找 mid 行的最大值
    let maxCol = 0;
    for (let j = 1; j < n; j++) {
      if (mat[mid][j] > mat[mid][maxCol]) maxCol = j;
    }
    if (mat[mid][maxCol] < mat[mid + 1][maxCol]) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  // 在 lo 行找最大值
  let maxCol = 0;
  for (let j = 1; j < n; j++) {
    if (mat[lo][j] > mat[lo][maxCol]) maxCol = j;
  }
  return [lo, maxCol];
}

// 方法2：二分查找列
function findPeakGridCol(mat: number[][]): number[] {
  const m = mat.length;
  const n = mat[0].length;
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let maxRow = 0;
    for (let i = 1; i < m; i++) {
      if (mat[i][mid] > mat[maxRow][mid]) maxRow = i;
    }
    if (mat[maxRow][mid] < mat[maxRow][mid + 1]) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  let maxRow = 0;
  for (let i = 1; i < m; i++) {
    if (mat[i][lo] > mat[maxRow][lo]) maxRow = i;
  }
  return [maxRow, lo];
}

// 方法3：暴力（O(mn)）
function findPeakGridBrute(mat: number[][]): number[] {
  const m = mat.length;
  const n = mat[0].length;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const val = mat[i][j];
      const up = i > 0 ? mat[i - 1][j] : -1;
      const down = i < m - 1 ? mat[i + 1][j] : -1;
      const left = j > 0 ? mat[i][j - 1] : -1;
      const right = j < n - 1 ? mat[i][j + 1] : -1;
      if (val > up && val > down && val > left && val > right) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 153. 寻找峰值 II =====");
console.log(
  "二分行 [[1,4],[3,2]]:",
  findPeakGrid([
    [1, 4],
    [3, 2],
  ]),
); // [0,1] 或 [1,0]
console.log(
  "二分行 [[10,20,15],[21,30,14],[7,16,32]]:",
  findPeakGrid([
    [10, 20, 15],
    [21, 30, 14],
    [7, 16, 32],
  ]),
); // [1,1] 或 [2,2]

export {};
