// 187. 游乐园的游览计划
// 自定义题：n 景点图 edges 带权，从入口访问所有景点返回入口的最小成本（TSP）。
// 思路：状压 DP。dp[mask][i] = 已访问集合 mask 且当前在 i 的最小成本。
//       起点 dp[1<<start][start]=0；答案 = min_i dp[full][i] + dist[i][start]。
//       距离用 Floyd 预处理（图为带权完全可达图时直接用；否则用邻接矩阵 INF）。

class AmusementParkTourPlan {
  private n: number;
  private dist: number[][];

  constructor(n: number, edges: [number, number, number][]) {
    this.n = n;
    const INF = Number.POSITIVE_INFINITY;
    this.dist = Array.from({ length: n }, () => new Array<number>(n).fill(INF));
    for (let i = 0; i < n; i++) this.dist[i][i] = 0;
    for (const [u, v, w] of edges) {
      if (w < this.dist[u][v]) this.dist[u][v] = w;
      if (w < this.dist[v][u]) this.dist[v][u] = w;
    }
    // Floyd
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        if (this.dist[i][k] === INF) continue;
        for (let j = 0; j < n; j++) {
          if (this.dist[k][j] === INF) continue;
          const cand = this.dist[i][k] + this.dist[k][j];
          if (cand < this.dist[i][j]) this.dist[i][j] = cand;
        }
      }
    }
  }

  // 主方法：从 start 出发访问所有景点并返回 start 的最小成本
  public minCost(start: number = 0): number {
    const n = this.n;
    const full = (1 << n) - 1;
    const INF = Number.POSITIVE_INFINITY;
    const dp: number[][] = Array.from({ length: 1 << n }, () => new Array<number>(n).fill(INF));
    dp[1 << start][start] = 0;
    for (let mask = 0; mask <= full; mask++) {
      for (let i = 0; i < n; i++) {
        if (!(mask & (1 << i))) continue;
        if (dp[mask][i] === INF) continue;
        for (let j = 0; j < n; j++) {
          if (mask & (1 << j)) continue;
          if (this.dist[i][j] === INF) continue;
          const nm = mask | (1 << j);
          const cand = dp[mask][i] + this.dist[i][j];
          if (cand < dp[nm][j]) dp[nm][j] = cand;
        }
      }
    }
    let ans = INF;
    for (let i = 0; i < n; i++) {
      if (dp[full][i] === INF) continue;
      if (this.dist[i][start] === INF) continue;
      const cand = dp[full][i] + this.dist[i][start];
      if (cand < ans) ans = cand;
    }
    return ans === INF ? -1 : ans;
  }

  // 辅助方法：返回预处理后的两点最短路（调试用）
  public distance(i: number, j: number): number {
    return this.dist[i][j];
  }
}

// 测试
(() => {
  // 样例：3 景点三角 0-1(10),1-2(20),0-2(25)，从 0 出发
  // 路径 0->1->2->0 = 10+20+25=55；0->2->1->0=25+20+10=55
  const sol1 = new AmusementParkTourPlan(3, [
    [0, 1, 10],
    [1, 2, 20],
    [0, 2, 25],
  ]);
  console.log("Test1:", sol1.minCost(0)); // 55

  // 样例：4 景点完全图
  const sol2 = new AmusementParkTourPlan(4, [
    [0, 1, 1],
    [1, 2, 1],
    [2, 3, 1],
    [3, 0, 1],
    [0, 2, 5],
    [1, 3, 5],
  ]);
  console.log("Test2:", sol2.minCost(0)); // 4

  // 样例：单景点
  const sol3 = new AmusementParkTourPlan(1, []);
  console.log("Test3:", sol3.minCost(0)); // 0
})();

export {};
