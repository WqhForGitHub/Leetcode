// ============================================================
// 093. 01 矩阵
// ============================================================
// LeetCode 542. 01 Matrix
// 给定 0/1 矩阵，返回每个元素到最近 0 的距离。
// 时间复杂度：O(mn)，空间复杂度：O(mn)

// 方法1：DP 两次扫描（推荐）
// 第一次从左上到右下，第二次从右下到左上
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function updateMatrix(mat: number[][]): number[][] {
  const m: number = mat.length;
  const n: number = mat[0].length;
  const dp: number[][] = [];
  const INF: number = m * n;

  for (let i: number = 0; i < m; i++) {
    dp.push(new Array(n).fill(INF));
  }

  // 第一次扫描：从左上到右下，只考虑左方和上方
  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < n; j++) {
      if (mat[i][j] === 0) {
        dp[i][j] = 0;
      } else {
        if (i > 0) dp[i][j] = Math.min(dp[i][j], dp[i - 1][j] + 1);
        if (j > 0) dp[i][j] = Math.min(dp[i][j], dp[i][j - 1] + 1);
      }
    }
  }

  // 第二次扫描：从右下到左上，只考虑右方和下方
  for (let i: number = m - 1; i >= 0; i--) {
    for (let j: number = n - 1; j >= 0; j--) {
      if (mat[i][j] !== 0) {
        if (i < m - 1) dp[i][j] = Math.min(dp[i][j], dp[i + 1][j] + 1);
        if (j < n - 1) dp[i][j] = Math.min(dp[i][j], dp[i][j + 1] + 1);
      }
    }
  }

  return dp;
}

// 方法2：BFS 多源最短路径
// 将所有 0 作为起点，BFS 向外扩展
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function updateMatrixBFS(mat: number[][]): number[][] {
  const m: number = mat.length;
  const n: number = mat[0].length;
  const dist: number[][] = [];
  const queue: [number, number][] = [];

  for (let i: number = 0; i < m; i++) {
    dist.push(new Array(n).fill(-1));
  }

  // 将所有 0 入队
  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < n; j++) {
      if (mat[i][j] === 0) {
        dist[i][j] = 0;
        queue.push([i, j]);
      }
    }
  }

  const dirs: number[][] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // BFS
  while (queue.length > 0) {
    const [r, c]: number[] = queue.shift()!;
    for (const [dr, dc] of dirs) {
      const nr: number = r + dr;
      const nc: number = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }

  return dist;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 093. 01 矩阵 =====");
console.log(
  updateMatrix([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]),
);
// 期望结果: [[0,0,0],[0,1,0],[0,0,0]]
console.log(
  updateMatrix([
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
  ]),
);
// 期望结果: [[0,0,0],[0,1,0],[1,2,1]]
console.log("--- 方法2测试 ---");
console.log(
  updateMatrixBFS([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]),
);
// 期望结果: [[0,0,0],[0,1,0],[0,0,0]]

export {};
