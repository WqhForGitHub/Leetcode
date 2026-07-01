// 113. 树上最大得分和路径 (LC2467)
// n 节点无向树，边 edges，amount[i] 表示经过节点 i 的收益（可正可负）。
// Alice 从节点 0 出发走向任意叶节点；Bob 从节点 bob 出发走向节点 0。
// 二人同时移动，每秒走一条边。若某节点：
//   - 两人同时到达：amount 抵消（收益减半）；
//   - 仅一人到达：该人获得完整 amount；
//   - Bob 先到：Alice 后到时不再获得。
// 求 Alice 可获得的最大净收益。
// 思路：两次 DFS。第一次找 Bob→0 的路径并标记各节点到达时间；
//       第二次 DFS Alice 从 0 出发，按到达时间比较确定每个节点的实际贡献。

type Edge = [number, number];

class ProfitablePathSolution {
  private adj: number[][] = [];
  private bobTime: number[] = [];
  private bobStart = 0;
  private amount: number[] = [];
  private ans = -Infinity;

  /**
   * 主入口：返回 Alice 可获得的最大净收益
   */
  mostProfitablePath(n: number, edges: number[][], bob: number, amount: number[]): number {
    this.adj = Array.from({ length: n }, () => []);
    for (const e of edges) {
      this.adj[e[0]].push(e[1]);
      this.adj[e[1]].push(e[0]);
    }
    this.bobTime = new Array<number>(n).fill(Infinity);
    this.bobStart = bob;
    this.amount = amount;
    this.ans = -Infinity;
    this.bobDfs(bob, -1, 0);
    this.aliceDfs(0, -1, 0, 0);
    return this.ans;
  }

  /**
   * Bob 从 bob 出发回溯到 0，记录各节点最早到达时间
   * 返回是否找到 0
   */
  private bobDfs(u: number, parent: number, t: number): boolean {
    this.bobTime[u] = t;
    if (u === 0) {
      return true;
    }
    for (const v of this.adj[u]) {
      if (v === parent) {
        continue;
      }
      if (this.bobDfs(v, u, t + 1)) {
        return true;
      }
    }
    this.bobTime[u] = Infinity;
    return false;
  }

  /**
   * Alice 从 0 出发 DFS 到所有叶子，累加各节点实际贡献
   */
  private aliceDfs(u: number, parent: number, t: number, gain: number): void {
    let cur = 0;
    if (t < this.bobTime[u]) {
      cur = this.amount[u];
    } else if (t === this.bobTime[u]) {
      cur = this.amount[u] / 2;
    }
    gain += cur;
    let isLeaf = true;
    for (const v of this.adj[u]) {
      if (v === parent) {
        continue;
      }
      isLeaf = false;
      this.aliceDfs(v, u, t + 1, gain);
    }
    if (isLeaf) {
      this.ans = Math.max(this.ans, gain);
    }
  }
}

// 测试
(function test(): void {
  const sol = new ProfitablePathSolution();
  const r1 = sol.mostProfitablePath(
    6,
    [
      [0, 2],
      [1, 2],
      [2, 3],
      [3, 4],
      [3, 5],
    ],
    3,
    [-5124, 9280, 4696, -6902, 8000, -2516],
  );
  console.log("Test1:", r1 === 8032 ? "PASS" : "FAIL", r1);
  const r2 = sol.mostProfitablePath(
    7,
    [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
      [4, 5],
      [3, 6],
    ],
    6,
    [0, -698, -950, 1564, 2240, -1484, 882],
  );
  console.log("Test2:", r2 === 3288 ? "PASS" : "FAIL", r2);
})();

export {};
