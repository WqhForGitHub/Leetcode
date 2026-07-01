// 181. 统计节点和为偶数的连通子图
// 自定义题：n 节点树 values，求节点和为偶数的连通子图数。
// 思路：树形 DP 奇偶计数。dp[u][0/1] 表示以 u 为最高节点（包含 u，仅用后代）
//       的连通子图中节点和为偶/奇的数量。每个孩子可"不选"或选一个含孩子的连通子图，
//       合并时按奇偶卷积。每个连通子图在它的最高节点处被唯一计数。

type Parity = 0 | 1; // 0 偶, 1 奇

interface TreeEdge {
  to: number;
}

class EvenSumConnectedSubgraphs {
  private n: number;
  private values: number[];
  private adj: number[][];
  private dp: [number, number][];
  private visited: boolean[];

  constructor(n: number, edges: [number, number][], values: number[]) {
    this.n = n;
    this.values = values;
    this.adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      this.adj[u].push(v);
      this.adj[v].push(u);
    }
    this.dp = Array.from({ length: n }, () => [0, 0]);
    this.visited = new Array(n).fill(false);
  }

  // 主方法：返回节点和为偶数的连通子图数量
  public count(): number {
    this.dfs(0, -1);
    let ans = 0;
    for (let u = 0; u < this.n; u++) {
      ans += this.dp[u][0];
    }
    return ans;
  }

  // 辅助方法：树形 DP，parent 用于避免回头
  private dfs(u: number, parent: number): void {
    this.visited[u] = true;
    const p: Parity = ((this.values[u] % 2) + 2) % 2 === 0 ? 0 : 1;
    // 初始：只含 u 自己
    let even = p === 0 ? 1 : 0;
    let odd = p === 1 ? 1 : 0;

    for (const v of this.adj[u]) {
      if (v === parent) continue;
      this.dfs(v, u);
      // 孩子分支可选：不选（贡献偶 1 种）或选含 v 的偶/奇子图
      const childEven = 1 + this.dp[v][0];
      const childOdd = this.dp[v][1];
      const newEven = even * childEven + odd * childOdd;
      const newOdd = even * childOdd + odd * childEven;
      even = newEven;
      odd = newOdd;
    }

    this.dp[u][0] = even;
    this.dp[u][1] = odd;
  }
}

// 测试
(() => {
  // 样例：4 节点链 0-1-2-3, values = [1, 2, 3, 4]
  // 手算偶和连通子图
  const sol1 = new EvenSumConnectedSubgraphs(
    4,
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    [1, 2, 3, 4],
  );
  console.log("Test1:", sol1.count());

  // 样例：单节点偶值
  const sol2 = new EvenSumConnectedSubgraphs(1, [], [2]);
  console.log("Test2:", sol2.count()); // 1

  // 样例：两节点 0-1, values=[1,1], 偶和子图：{0,1} 共 1 个
  const sol3 = new EvenSumConnectedSubgraphs(2, [[0, 1]], [1, 1]);
  console.log("Test3:", sol3.count());
})();

export {};
