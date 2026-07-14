// 114. 购买苹果的最低成本 (自定义)
// 给定 n 节点带权树 edges（[u, v, w]），根为 0。
// 数组 apples 中 apples[i] = 1 表示节点 i 有苹果（共 k 个）。
// 从根出发访问所有苹果所在节点并返回根，求走过的最小边权总和。
// 思路：DFS 后序遍历。若子树含苹果，则父子边必须往返走两次；
//       子树边权贡献 = (子树是否有苹果 ? 边权*2 : 0) + 子树内部贡献之和。
//       贪心：仅当子树中存在苹果时才进入该子树，避免无意义往返。

type Edge = [number, number, number];

class BuyApplesSolution {
  private adj: [number, number][][] = [];
  private apples: number[] = [];
  private total = 0;

  /**
   * 主入口：返回从根访问所有苹果并返回的最小成本
   */
  minimumCostToBuyApples(n: number, edges: number[][], apples: number[]): number {
    this.adj = Array.from({ length: n }, () => []);
    for (const e of edges) {
      const u = e[0],
        v = e[1],
        w = e[2];
      this.adj[u].push([v, w]);
      this.adj[v].push([u, w]);
    }
    this.apples = apples;
    this.total = 0;
    this.dfs(0, -1);
    return this.total;
  }

  /**
   * DFS 返回子树 u 中是否存在苹果；若存在则累加父子边往返成本
   */
  private dfs(u: number, parent: number): boolean {
    let has = this.apples[u] === 1;
    for (const [v, w] of this.adj[u]) {
      if (v === parent) {
        continue;
      }
      const childHas = this.dfs(v, u);
      if (childHas) {
        this.total += 2 * w;
        has = true;
      }
    }
    return has;
  }
}

// 测试
(function test(): void {
  const sol = new BuyApplesSolution();
  // 树：0-1(2), 0-2(3), 1-3(4), 苹果在 3
  const r1 = sol.minimumCostToBuyApples(
    4,
    [
      [0, 1, 2],
      [0, 2, 3],
      [1, 3, 4],
    ],
    [0, 0, 0, 1],
  );
  console.log("Test1:", r1 === 12 ? "PASS" : "FAIL", r1);
  // 多个苹果
  const r2 = sol.minimumCostToBuyApples(
    5,
    [
      [0, 1, 1],
      [1, 2, 2],
      [1, 3, 3],
      [0, 4, 5],
    ],
    [0, 0, 1, 1, 1],
  );
  console.log("Test2:", r2 === 22 ? "PASS" : "FAIL", r2);
  // 无苹果
  const r3 = sol.minimumCostToBuyApples(
    3,
    [
      [0, 1, 5],
      [1, 2, 5],
    ],
    [0, 0, 0],
  );
  console.log("Test3:", r3 === 0 ? "PASS" : "FAIL", r3);
})();

export {};
