// ============================================================
// 112. 至少有一个 1 的最左端列
// ============================================================
// LeetCode 1428. Leftmost Column with at Least a 1
// 二进制矩阵每行从左到右非递减，找第一个包含 1 的列。

// 模拟 BinaryMatrix 接口
class BinaryMatrix {
  private mat: number[][];
  private calls = 0;
  constructor(mat: number[][]) {
    this.mat = mat;
  }
  get(row: number, col: number): number {
    this.calls++;
    return this.mat[row][col];
  }
  dimensions(): number[] {
    return [this.mat.length, this.mat[0].length];
  }
}

// 方法1：每行二分查找
function leftMostColumnWithOne(binaryMatrix: BinaryMatrix): number {
  const [m, n] = binaryMatrix.dimensions();
  let result = n;
  for (let i = 0; i < m; i++) {
    // 二分找第一个 1
    let lo = 0;
    let hi = n - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (binaryMatrix.get(i, mid) === 0) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    if (binaryMatrix.get(i, lo) === 1) {
      result = Math.min(result, lo);
    }
  }
  return result === n ? -1 : result;
}

// 方法2：从右上角开始搜索（O(m+n)）
function leftMostColumnWithOneTopRight(binaryMatrix: BinaryMatrix): number {
  const [m, n] = binaryMatrix.dimensions();
  let row = 0;
  let col = n - 1;
  let result = -1;
  while (row < m && col >= 0) {
    if (binaryMatrix.get(row, col) === 1) {
      result = col;
      col--;
    } else {
      row++;
    }
  }
  return result;
}

// 方法3：从左下角搜索
function leftMostColumnWithOneBottomLeft(binaryMatrix: BinaryMatrix): number {
  const [m, n] = binaryMatrix.dimensions();
  let row = m - 1;
  let col = 0;
  let result = -1;
  while (row >= 0 && col < n) {
    if (binaryMatrix.get(row, col) === 1) {
      result = col;
      row--;
    } else {
      col++;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 112. 至少有一个 1 的最左端列 =====");
const bm = new BinaryMatrix([[0, 0], [1, 1]]);
console.log("二分:", leftMostColumnWithOne(bm)); // 0
const bm2 = new BinaryMatrix([[0, 0], [0, 0]]);
console.log("右上角:", leftMostColumnWithOneTopRight(bm2)); // -1

export {};
