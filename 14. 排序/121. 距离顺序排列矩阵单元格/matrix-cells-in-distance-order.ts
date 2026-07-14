// ============================================================
// 121. 距离顺序排列矩阵单元格
// ============================================================
// LeetCode 1030. Matrix Cells in Distance Order
// 给定 rows、cols、rCenter、cCenter，返回矩阵中所有单元格按到中心单元格
// 的曼哈顿距离从近到远排列的坐标。

// 方法1：从中心 BFS（推荐，时间 O(rows*cols)，空间 O(rows*cols)）
function allCellsDistOrder(
  rows: number,
  cols: number,
  rCenter: number,
  cCenter: number,
): number[][] {
  const result: number[][] = [];
  const visited: boolean[][] = Array.from({ length: rows }, () =>
    new Array<boolean>(cols).fill(false),
  );

  const queue: number[][] = [[rCenter, cCenter]];
  visited[rCenter][cCenter] = true;

  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    result.push([r, c]);
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }

  return result;
}

// 方法2：排序所有单元格（时间 O(rows*cols*log(rows*cols))，空间 O(rows*cols)）
function allCellsDistOrder2(
  rows: number,
  cols: number,
  rCenter: number,
  cCenter: number,
): number[][] {
  const cells: number[][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push([r, c]);
    }
  }
  cells.sort(
    (a, b) =>
      Math.abs(a[0] - rCenter) +
      Math.abs(a[1] - cCenter) -
      (Math.abs(b[0] - rCenter) + Math.abs(b[1] - cCenter)),
  );
  return cells;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 121. 距离顺序排列矩阵单元格 =====");
console.log("方法1:", allCellsDistOrder(1, 2, 0, 0)); // 期望: [[0,0],[0,1]]
console.log("方法1:", allCellsDistOrder(2, 2, 0, 0)); // 期望: [[0,0],[0,1],[1,0],[1,1]] (顺序满足距离)
console.log("方法1:", allCellsDistOrder(3, 3, 1, 1)); // 期望距离顺序: 0,1,1,1,1,2,2,2,2
console.log("方法2:", allCellsDistOrder2(1, 2, 0, 0)); // 期望: [[0,0],[0,1]]
console.log("方法2:", allCellsDistOrder2(2, 2, 0, 0)); // 期望距离顺序正确

export {};
