// ============================================================
// 027. 最佳的碰头地点
// ============================================================
// LeetCode 296. Best Meeting Point
// 给定二维网格，1 表示一个人。求一个碰头点使所有人到该点的曼哈顿距离之和最小。
// 曼哈顿距离可拆分为行距离与列距离独立计算，各自取中位数即最小。

// 方法1：行列中位数法（推荐，O(m*n) 时间，O(p) 空间，p 为人数）
// 行坐标按扫描顺序天然有序；列坐标收集后排序。分别取中位数，再求总距离。
function minTotalDistance(grid: number[][]): number {
  const rows: number[] = [];
  const cols: number[] = [];
  const m = grid.length;
  const n = grid[0].length;

  // 行坐标从上到下扫描，自然有序
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        rows.push(i);
      }
    }
  }

  // 列坐标从左到右扫描，自然有序
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      if (grid[i][j] === 1) {
        cols.push(j);
      }
    }
  }

  const rowMedian = rows[rows.length >> 1];
  const colMedian = cols[cols.length >> 1];

  let dist = 0;
  for (const r of rows) dist += Math.abs(r - rowMedian);
  for (const c of cols) dist += Math.abs(c - colMedian);
  return dist;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 027. 最佳的碰头地点 =====");

console.log(
  "中位数法 [[1,0,0,0,1],[0,0,0,0,0],[0,0,1,0,0]]:",
  minTotalDistance([
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
  ])
); // 期望 6

console.log(
  "中位数法 [[1,1],[1,1]]:",
  minTotalDistance([
    [1, 1],
    [1, 1],
  ])
); // 期望 4 (4 人在 2x2，碰头点取任一格，总距离为 4)

export {};
