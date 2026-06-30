// ============================================================
// 009. 矩阵中的最长递增路径
// ============================================================
// LeetCode 329. Longest Increasing Path in a Matrix
// m×n 整数矩阵，上下左右移动，求最长严格递增路径长度。
// 时间复杂度：O(m * n)，空间复杂度：O(m * n)

const DIRS4 = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

// 方法1：记忆化 DFS（推荐）
// 严格递增天然无环，无需 visited。memo[i][j] 表示从 (i,j) 出发的最长路径长度。
function longestIncreasingPath(matrix: number[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0) return 0;
  const m = matrix.length;
  const n = matrix[0].length;
  const memo: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  const dfs = (i: number, j: number): number => {
    if (memo[i][j] !== 0) return memo[i][j];
    memo[i][j] = 1; // 至少包含自身
    for (const [di, dj] of DIRS4) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] > matrix[i][j]) {
        memo[i][j] = Math.max(memo[i][j], dfs(ni, nj) + 1);
      }
    }
    return memo[i][j];
  };
  let ans = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      ans = Math.max(ans, dfs(i, j));
    }
  }
  return ans;
}

// 方法2：拓扑排序（入度 BFS / Kahn）
// 把矩阵看成有向图：小值 -> 大值。从入度为 0 的局部最小值逐层剥离，剥离层数即为最长路径长度。
function longestIncreasingPathTopo(matrix: number[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0) return 0;
  const m = matrix.length;
  const n = matrix[0].length;
  const indegree: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      for (const [di, dj] of DIRS4) {
        const ni = i + di;
        const nj = j + dj;
        if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] > matrix[i][j]) {
          indegree[ni][nj]++;
        }
      }
    }
  }
  let queue: Array<[number, number]> = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (indegree[i][j] === 0) queue.push([i, j]);
    }
  }
  let layers = 0;
  while (queue.length > 0) {
    layers++;
    const next: Array<[number, number]> = [];
    for (const [i, j] of queue) {
      for (const [di, dj] of DIRS4) {
        const ni = i + di;
        const nj = j + dj;
        if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] > matrix[i][j]) {
          if (--indegree[ni][nj] === 0) next.push([ni, nj]);
        }
      }
    }
    queue = next;
  }
  return layers;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 009. 矩阵中的最长递增路径 =====");
console.log("记忆化DFS:", longestIncreasingPath([[9, 9, 4], [6, 6, 8], [2, 1, 1]])); // 期望 4 (1->2->6->9)
console.log("拓扑排序:", longestIncreasingPathTopo([[9, 9, 4], [6, 6, 8], [2, 1, 1]])); // 期望 4
console.log("记忆化DFS:", longestIncreasingPath([[3, 4, 5], [3, 2, 6], [2, 2, 1]])); // 期望 4 (3->4->5->6)
console.log("拓扑排序:", longestIncreasingPathTopo([[3, 4, 5], [3, 2, 6], [2, 2, 1]])); // 期望 4

export {};
