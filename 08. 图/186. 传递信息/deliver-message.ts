// 186. 传递信息 (LC LCP07)
// 题：n 人关系图 edges（有向），从 0 出发经 k 步到 n-1 的方案数。
// 思路：DP / BFS 分层计数。dp[step][v] = 经 step 步到达 v 的方案数。
//       dp[0][0] = 1；dp[step+1][v] += dp[step][u] 对每条边 u->v。答案 dp[k][n-1]。

class DeliverMessage {
  private n: number;
  private adj: number[][];
  private reverse: number[][]; // 入边，便于按目标累加

  constructor(n: number, edges: [number, number][]) {
    this.n = n;
    this.adj = Array.from({ length: n }, () => []);
    this.reverse = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      this.adj[u].push(v);
      this.reverse[v].push(u);
    }
  }

  // 主方法：经 k 步从 0 到 n-1 的方案数
  public numWays(k: number, target: number): number {
    let dp = new Array<number>(this.n).fill(0);
    dp[0] = 1;
    for (let step = 0; step < k; step++) {
      const next = new Array<number>(this.n).fill(0);
      for (let v = 0; v < this.n; v++) {
        if (dp[v] === 0) continue;
        for (const to of this.adj[v]) {
          next[to] += dp[v];
        }
      }
      dp = next;
    }
    return dp[target];
  }

  // 辅助方法：返回从某节点出发一步可达集合（调试用）
  public neighbors(u: number): number[] {
    return this.adj[u].slice();
  }
}

// 测试
(() => {
  // LCP07 样例1：n=5, edges=[[0,2],[2,1],[3,4],[2,3],[1,4],[2,0],[0,4]], k=3 -> 3
  const sol1 = new DeliverMessage(5, [
    [0, 2],
    [2, 1],
    [3, 4],
    [2, 3],
    [1, 4],
    [2, 0],
    [0, 4],
  ]);
  console.log("Test1:", sol1.numWays(3, 4)); // 3

  // 样例2：n=3 edges=[[0,2],[2,1]] k=2 -> 0
  const sol2 = new DeliverMessage(3, [
    [0, 2],
    [2, 1],
  ]);
  console.log("Test2:", sol2.numWays(2, 2)); // 0

  // 样例3：自环 0->0, k=1 到 0 -> 1
  const sol3 = new DeliverMessage(1, [[0, 0]]);
  console.log("Test3:", sol3.numWays(1, 0)); // 1
})();

export {};
