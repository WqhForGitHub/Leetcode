// ============================================================
// 208. 两点之间不包含任何点的最宽垂直区域
// ============================================================
// LeetCode 1637. Widest Vertical Area Between Two Points Containing No Points
// 给定若干点，找出相邻 x 坐标之间的最大间距，
// 该间距对应的垂直区域内不包含任何点。

// 方法1：按 x 排序 + 计算最大间距（O(n log n)）
function maxWidthOfVerticalArea(points: number[][]): number {
  const xs = points.map((p) => p[0]).sort((a, b) => a - b);
  let maxGap = 0;
  for (let i = 1; i < xs.length; i++) {
    const gap = xs[i] - xs[i - 1];
    if (gap > maxGap) maxGap = gap;
  }
  return maxGap;
}

// 方法2：按 x 排序 + 单次遍历（O(n log n)）
// 使用 reduce 在一次遍历中累计最大间距，逻辑等价。
function maxWidthOfVerticalArea2(points: number[][]): number {
  const xs = points.map((p) => p[0]).sort((a, b) => a - b);
  return xs.reduce((maxGap, x, i) => {
    if (i === 0) return maxGap;
    const gap = x - xs[i - 1];
    return gap > maxGap ? gap : maxGap;
  }, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 208. 两点之间不包含任何点的最宽垂直区域 =====");
console.log(
  "方法1 [[8,7],[9,9],[7,4],[9,7]]:",
  maxWidthOfVerticalArea([
    [8, 7],
    [9, 9],
    [7, 4],
    [9, 7],
  ]),
); // 1
console.log(
  "方法1 [[3,1],[9,0],[1,0],[1,4],[5,3],[8,8]]:",
  maxWidthOfVerticalArea([
    [3, 1],
    [9, 0],
    [1, 0],
    [1, 4],
    [5, 3],
    [8, 8],
  ]),
); // 3
console.log(
  "方法2 [[8,7],[9,9],[7,4],[9,7]]:",
  maxWidthOfVerticalArea2([
    [8, 7],
    [9, 9],
    [7, 4],
    [9, 7],
  ]),
); // 1
console.log(
  "方法2 [[3,1],[9,0],[1,0],[1,4],[5,3],[8,8]]:",
  maxWidthOfVerticalArea2([
    [3, 1],
    [9, 0],
    [1, 0],
    [1, 4],
    [5, 3],
    [8, 8],
  ]),
); // 3

export {};
