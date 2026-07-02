// ============================================================
// 107. 矩阵中战斗力最弱的 K 行
// ============================================================
// LeetCode 1337. The K Weakest Rows in a Matrix
// 每行前面是 1 后面是 0，按 1 的数量排序返回最弱的 K 行。

// 方法1：二分查找找1的个数 + 排序
function kWeakestRows(mat: number[][], k: number): number[] {
  const m = mat.length;
  const rows: [number, number][] = []; // [count, index]
  for (let i = 0; i < m; i++) {
    const count = countOnes(mat[i]);
    rows.push([count, i]);
  }
  rows.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return rows.slice(0, k).map((r) => r[1]);
}

function countOnes(row: number[]): number {
  // 二分找最后一个 1 的位置
  let lo = 0;
  let hi = row.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (row[mid] === 1) lo = mid + 1;
    else hi = mid - 1;
  }
  return lo;
}

// 方法2：二分查找 + 最小堆
function kWeakestRowsHeap(mat: number[][], k: number): number[] {
  const m = mat.length;
  const n = mat[0].length;
  const result: number[] = [];
  // 收集所有行信息
  const rows = mat.map((row, i) => [countOnes(row), i]);
  // 排序
  rows.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  for (let i = 0; i < k; i++) {
    result.push(rows[i][1]);
  }
  return result;
}

// 方法3：按列遍历（O(mn)）
function kWeakestRowsColumn(mat: number[][], k: number): number[] {
  const m = mat.length;
  const n = mat[0].length;
  const result: number[] = [];
  const visited = new Set<number>();
  // 按列扫描
  for (let j = 0; j <= n; j++) {
    for (let i = 0; i < m; i++) {
      if (visited.has(i)) continue;
      const isZero = j === n || mat[i][j] === 0;
      if (isZero) {
        result.push(i);
        visited.add(i);
        if (result.length === k) return result;
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 107. 矩阵中战斗力最弱的 K 行 =====");
console.log(
  "二分 [[1,1,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,1,0,0,0],[1,1,1,1,1]],3:",
  kWeakestRows(
    [
      [1, 1, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ],
    3,
  ),
); // [2,0,3]

export {};
