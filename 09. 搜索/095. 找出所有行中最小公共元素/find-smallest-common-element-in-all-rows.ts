// ============================================================
// 095. 找出所有行中最小公共元素
// ============================================================
// LeetCode 1198. Find Smallest Common Element in All Rows
// 矩阵每行升序排列，找所有行中都出现的最小元素。

// 方法1：二分查找
function smallestCommonElement(mat: number[][]): number {
  const m = mat.length;
  const n = mat[0].length;
  // 以第一行为基准，对每个元素在其他行中二分查找
  for (let j = 0; j < n; j++) {
    const target = mat[0][j];
    let foundAll = true;
    for (let i = 1; i < m; i++) {
      // 二分查找
      let lo = 0;
      let hi = n - 1;
      let found = false;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (mat[i][mid] === target) {
          found = true;
          break;
        }
        if (mat[i][mid] < target) lo = mid + 1;
        else hi = mid - 1;
      }
      if (!found) {
        foundAll = false;
        break;
      }
    }
    if (foundAll) return target;
  }
  return -1;
}

// 方法2：计数法
function smallestCommonElementCount(mat: number[][]): number {
  const count = new Map<number, number>();
  const m = mat.length;
  for (const row of mat) {
    const seen = new Set(row); // 去重
    for (const val of seen) {
      count.set(val, (count.get(val) || 0) + 1);
    }
  }
  let result = Infinity;
  for (const [val, c] of count) {
    if (c === m && val < result) {
      result = val;
    }
  }
  return result === Infinity ? -1 : result;
}

// 方法3：多指针法
function smallestCommonElementPointers(mat: number[][]): number {
  const m = mat.length;
  const n = mat[0].length;
  const pointers = new Array(m).fill(0);
  while (true) {
    let maxVal = mat[0][pointers[0]];
    let allEqual = true;
    for (let i = 1; i < m; i++) {
      if (mat[i][pointers[i]] !== maxVal) {
        allEqual = false;
        maxVal = Math.max(maxVal, mat[i][pointers[i]]);
      }
    }
    if (allEqual) return maxVal;
    // 移动所有小于 maxVal 的指针
    let done = false;
    for (let i = 0; i < m; i++) {
      while (pointers[i] < n && mat[i][pointers[i]] < maxVal) {
        pointers[i]++;
      }
      if (pointers[i] >= n) {
        done = true;
        break;
      }
    }
    if (done) break;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 095. 找出所有行中最小公共元素 =====");
console.log(
  "二分 [[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]]:",
  smallestCommonElement([
    [1, 2, 3, 4, 5],
    [2, 4, 5, 8, 10],
    [3, 5, 7, 9, 11],
    [1, 3, 5, 7, 9],
  ]),
); // 5
console.log(
  "计数 [[1,2,3],[4,5,6],[7,8,9]]:",
  smallestCommonElementCount([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
); // -1

export {};
