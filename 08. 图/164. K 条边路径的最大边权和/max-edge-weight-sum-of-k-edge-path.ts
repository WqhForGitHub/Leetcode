// 164. K 条边路径的最大边权和
// n 节点带权有向图，从 start 走恰好 k 条边到 end 的最大边权和。
// 解法：矩阵快速幂 DP。g[i][j] = i->j 最大边权（无边为 -Inf）。
// dp[k][i][j] = max over m of dp[k-1][i][m] + g[m][j]，即 max-plus 矩阵快速幂。

const NEG_INF = Number.NEGATIVE_INFINITY;

function maxPlus(a: number[][], b: number[][]): number[][] {
  const n = a.length;
  const m = b[0].length;
  const p = b.length;
  const c: number[][] = Array.from({ length: n }, () => new Array(m).fill(NEG_INF));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      for (let k = 0; k < p; k++) {
        if (a[i][k] !== NEG_INF && b[k][j] !== NEG_INF) {
          c[i][j] = Math.max(c[i][j], a[i][k] + b[k][j]);
        }
      }
    }
  }
  return c;
}

function maxEdgeWeightSumOfKEdgePath(
  n: number,
  edges: [number, number, number][],
  start: number,
  end: number,
  k: number,
): number {
  const base: number[][] = Array.from({ length: n }, () => new Array(n).fill(NEG_INF));
  for (const [u, v, w] of edges) {
    base[u][v] = Math.max(base[u][v], w);
  }
  // 单位矩阵（max-plus 下：对角为 0，其余 -Inf）
  let result: number[][] = Array.from({ length: n }, () => new Array(n).fill(NEG_INF));
  for (let i = 0; i < n; i++) result[i][i] = 0;
  let mat = base;
  let e = k;
  while (e > 0) {
    if (e & 1) result = maxPlus(result, mat);
    mat = maxPlus(mat, mat);
    e >>>= 1;
  }
  const ans = result[start][end];
  return ans === NEG_INF ? -1 : ans;
}

// 方法二：BFS 分层 DP，dp[step][v] = 从 start 走 step 步到 v 的最大边权和
function maxEdgeWeightSumBfs(
  n: number,
  edges: [number, number, number][],
  start: number,
  end: number,
  k: number,
): number {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
  }
  let dp: number[] = new Array(n).fill(NEG_INF);
  dp[start] = 0;
  for (let step = 0; step < k; step++) {
    const next: number[] = new Array(n).fill(NEG_INF);
    for (let u = 0; u < n; u++) {
      if (dp[u] === NEG_INF) continue;
      for (const [v, w] of adj[u]) {
        next[v] = Math.max(next[v], dp[u] + w);
      }
    }
    dp = next;
  }
  return dp[end] === NEG_INF ? -1 : dp[end];
}

// 测试
console.log(
  maxEdgeWeightSumOfKEdgePath(
    3,
    [
      [0, 1, 2],
      [1, 2, 3],
      [0, 2, 10],
    ],
    0,
    2,
    2,
  ),
);
console.log(
  maxEdgeWeightSumBfs(
    3,
    [
      [0, 1, 2],
      [1, 2, 3],
      [0, 2, 10],
    ],
    0,
    2,
    2,
  ),
);

export {};
