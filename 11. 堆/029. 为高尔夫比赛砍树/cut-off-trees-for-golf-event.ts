// ============================================================
// 029. 为高尔夫比赛砍树
// ============================================================
// LeetCode 675. Cut Off Trees for Golf Event
// 按树高度从低到高砍树，求最小步数。
// 时间复杂度：O((mn)^2)，空间复杂度：O(mn)

// 方法1：BFS（按顺序砍树）
function cutOffTree(forest: number[][]): number {
  const m = forest.length;
  const n = forest[0].length;
  const trees: Array<{ h: number; r: number; c: number }> = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (forest[r][c] > 1) trees.push({ h: forest[r][c], r, c });
    }
  }
  trees.sort((a, b) => a.h - b.h);
  const bfs = (sr: number, sc: number, tr: number, tc: number): number => {
    if (sr === tr && sc === tc) return 0;
    const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
    const queue: Array<[number, number, number]> = [[sr, sc, 0]];
    visited[sr][sc] = true;
    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    let head = 0;
    while (head < queue.length) {
      const [r, c, d] = queue[head++];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited[nr][nc] || forest[nr][nc] === 0)
          continue;
        if (nr === tr && nc === tc) return d + 1;
        visited[nr][nc] = true;
        queue.push([nr, nc, d + 1]);
      }
    }
    return -1;
  };
  let total = 0;
  let sr = 0;
  let sc = 0;
  for (const { r, c } of trees) {
    const steps = bfs(sr, sc, r, c);
    if (steps === -1) return -1;
    total += steps;
    sr = r;
    sc = c;
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 029. 为高尔夫比赛砍树 =====");
console.log(
  "步数:",
  cutOffTree([
    [1, 2, 3],
    [0, 0, 4],
    [7, 6, 5],
  ]),
); // 期望 6
console.log(
  "步数:",
  cutOffTree([
    [1, 2, 3],
    [0, 0, 0],
    [7, 6, 5],
  ]),
); // 期望 -1

export {};
