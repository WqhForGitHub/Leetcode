// ============================================================
// 022. 包含全部黑色像素的最小矩形
// ============================================================
// LeetCode 302. Smallest Rectangle Enclosing Black Pixels
// 二维图像中 '1' 表示黑色像素，'0' 表示白色像素。给定一个黑色像素坐标，
// 找出包含所有黑色像素的最小矩形面积。假设黑色像素连通。

// 方法1：二分查找边界（O(m log n + n log m)）
function minArea(image: string[][], x: number, y: number): number {
  const m = image.length;
  const n = image[0].length;
  // 找左边界：第一个列中存在黑色像素的列
  const left = searchCol(image, 0, y, true);
  // 找右边界：最后一个列中存在黑色像素的列
  const right = searchCol(image, y, n - 1, false);
  // 找上边界
  const top = searchRow(image, 0, x, true);
  // 找下边界
  const bottom = searchRow(image, x, m - 1, false);
  return (right - left + 1) * (bottom - top + 1);
}

function searchCol(image: string[][], low: number, high: number, findFirst: boolean): number {
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const hasBlack = image.some((row) => row[mid] === "1");
    if (hasBlack === findFirst) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }
  return low;
}

function searchRow(image: string[][], low: number, high: number, findFirst: boolean): number {
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const hasBlack = image[mid].includes("1");
    if (hasBlack === findFirst) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }
  return low;
}

// 方法2：DFS/BFS 遍历所有黑色像素（O(mn)）
function minAreaDFS(image: string[][], x: number, y: number): number {
  let minRow = x;
  let maxRow = x;
  let minCol = y;
  let maxCol = y;
  const m = image.length;
  const n = image[0].length;
  const visited = new Set<string>();
  function dfs(r: number, c: number) {
    if (r < 0 || r >= m || c < 0 || c >= n) return;
    if (image[r][c] !== "1" || visited.has(`${r},${c}`)) return;
    visited.add(`${r},${c}`);
    minRow = Math.min(minRow, r);
    maxRow = Math.max(maxRow, r);
    minCol = Math.min(minCol, c);
    maxCol = Math.max(maxCol, c);
    dfs(r - 1, c);
    dfs(r + 1, c);
    dfs(r, c - 1);
    dfs(r, c + 1);
  }
  dfs(x, y);
  return (maxRow - minRow + 1) * (maxCol - minCol + 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 022. 包含全部黑色像素的最小矩形 =====");
const img = [
  ["0", "0", "1", "0"],
  ["0", "1", "1", "0"],
  ["0", "1", "0", "0"],
];
console.log("二分:", minArea(img, 0, 2)); // 6
console.log("DFS:", minAreaDFS(img, 0, 2)); // 6

export {};
