// ============================================================
// 011. 矩阵置零
// ============================================================
// LeetCode 73. Set Matrix Zeroes
// 给定一个 m x n 的矩阵，如果一个元素为 0，则将其所在行和列的所有元素都设为 0。
// 使用第一行和第一列作为标记数组，实现 O(1) 空间复杂度。
// 时间复杂度：O(m*n)，空间复杂度：O(1)

function setZeroes(matrix: number[][]): void {
  const m = matrix.length;
  const n = matrix[0].length;

  // 用两个标记变量记录第一行和第一列本身是否含有 0
  let firstRowZero = false;
  let firstColZero = false;

  // 检查第一行是否有 0
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowZero = true;
      break;
    }
  }

  // 检查第一列是否有 0
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColZero = true;
      break;
    }
  }

  // 用第一行和第一列记录其余位置是否需要置 0
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }

  // 根据第一行第一列的标记，置零其余位置
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // 处理第一行
  if (firstRowZero) {
    for (let j = 0; j < n; j++) {
      matrix[0][j] = 0;
    }
  }

  // 处理第一列
  if (firstColZero) {
    for (let i = 0; i < m; i++) {
      matrix[i][0] = 0;
    }
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 011. 矩阵置零 =====");

let m1 = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];
setZeroes(m1);
console.log(m1); // [[1,0,1],[0,0,0],[1,0,1]]

let m2 = [
  [0, 1, 2, 0],
  [3, 4, 5, 2],
  [1, 3, 1, 5],
];
setZeroes(m2);
console.log(m2); // [[0,0,0,0],[0,4,5,0],[0,3,1,0]]

let m3 = [[1]];
setZeroes(m3);
console.log(m3); // [[1]]

let m4 = [
  [1, 2, 3, 4],
  [5, 0, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 0],
];
setZeroes(m4);
console.log(m4); // [[1,0,3,0],[0,0,0,0],[9,0,11,0],[0,0,0,0]]

export {};
