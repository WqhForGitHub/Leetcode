// 182. 购买苹果的最低成本 II
// 自定义题：n 节点树 edges 带权，多个苹果位置，从根出发访问所有苹果并返回根的最小成本（可分支）。
// 思路：DFS + 贪心。若某子树含苹果，则必须沿该边下行并返回，贡献 2 * 边权。
//       只需对"子树是否含苹果"做一次 DFS 标记，再累计必要边权即可。

interface WeightedEdge {
  to: number;
  w: number;
}

class MinimumCostToBuyApplesII {
  private n: number;
  private adj: WeightedEdge[][];
  private hasApple: boolean[];

  constructor(n: number, edges: [number, number, number][], apples: number[]) {
    this.n = n;
    this.adj = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) {
      this.adj[u].push({ to: v, w });
      this.adj[v].push({ to: u, w });
    }
    this.hasApple = new Array(n).fill(false);
    for (const a of apples) this.hasApple[a] = true;
  }

  // 主方法：从根 0 出发访问所有苹果返回 0 的最小成本
  public minCost(): number {
    const [, cost] = this.dfs(0, -1);
    return cost;
  }

  // 辅助方法：返回 [子树是否含苹果, 该子树必要往返成本]
  private dfs(u: number, parent: number): [boolean, number] {
    let subHas = this.hasApple[u];
    let subCost = 0;
    for (const e of this.adj[u]) {
      if (e.to === parent) continue;
      const [childHas, childCost] = this.dfs(e.to, u);
      if (childHas) {
        subCost += childCost + 2 * e.w;
        subHas = true;
      }
    }
    return [subHas, subCost];
  }
}

// 测试
(() => {
  // 样例：5 节点树
  //   0 - 1 (w=3) - 2 (w=2) [apple]
  //   0 - 3 (w=4) [apple]
  //   3 - 4 (w=1) (无苹果)
  // 必要边：0-1(3),1-2(2),0-3(4)；成本 = 2*(3+2+4)=18
  const sol1 = new MinimumCostToBuyApplesII(
    5,
    [
      [0, 1, 3],
      [1, 2, 2],
      [0, 3, 4],
      [3, 4, 1],
    ],
    [2, 3],
  );
  console.log("Test1:", sol1.minCost()); // 18

  // 样例：根即苹果
  const sol2 = new MinimumCostToBuyApplesII(
    3,
    [
      [0, 1, 5],
      [1, 2, 6],
    ],
    [0],
  );
  console.log("Test2:", sol2.minCost()); // 0

  // 样例：所有节点都是苹果
  const sol3 = new MinimumCostToBuyApplesII(
    3,
    [
      [0, 1, 1],
      [1, 2, 1],
    ],
    [0, 1, 2],
  );
  console.log("Test3:", sol3.minCost()); // 4
})();

export {};
