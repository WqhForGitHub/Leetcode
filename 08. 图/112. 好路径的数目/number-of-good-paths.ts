// 112. 好路径的数目 (LC2421)
// 给定 n 节点树（vals[i] 为节点 i 的值）与边 edges。
// 一条简单路径为「好路径」当且仅当两端点值相同且路径上所有节点值都不大于端点值。
// 返回好路径数目（单点路径计入）。
// 思路：并查集按节点值升序处理同值节点。同一连通块内的同值节点两两构成好路径，
//       增量贡献 C(cnt,2)。合并时先在同组内统计，再合并到值更大的组。

type Edge = [number, number];

class GoodPathsSolution {
  private parent: number[] = [];
  private rank: number[] = [];

  /**
   * 主入口：返回好路径总数
   */
  numberOfGoodPaths(n: number, vals: number[], edges: number[][]): number {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array<number>(n).fill(0);
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const e of edges) {
      adj[e[0]].push(e[1]);
      adj[e[1]].push(e[0]);
    }
    // 按值升序排序节点索引
    const order = Array.from({ length: n }, (_, i) => i);
    order.sort((a, b) => vals[a] - vals[b]);
    let res = 0;
    let i = 0;
    while (i < n) {
      let j = i;
      while (j < n && vals[order[j]] === vals[order[i]]) {
        j++;
      }
      // 处理同值节点 [i, j)
      for (let t = i; t < j; t++) {
        const u = order[t];
        for (const v of adj[u]) {
          if (vals[v] <= vals[u]) {
            this.union(u, v);
          }
        }
      }
      // 同一连通块内同值节点计数
      const cnt = new Map<number, number>();
      for (let t = i; t < j; t++) {
        const root = this.find(order[t]);
        cnt.set(root, (cnt.get(root) ?? 0) + 1);
      }
      for (const c of cnt.values()) {
        res += (c * (c + 1)) / 2;
      }
      i = j;
    }
    return res;
  }

  private find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  private union(a: number, b: number): void {
    const ra = this.find(a),
      rb = this.find(b);
    if (ra === rb) {
      return;
    }
    if (this.rank[ra] < this.rank[rb]) {
      this.parent[ra] = rb;
    } else if (this.rank[ra] > this.rank[rb]) {
      this.parent[rb] = ra;
    } else {
      this.parent[rb] = ra;
      this.rank[ra]++;
    }
  }
}

// 测试
(function test(): void {
  const sol = new GoodPathsSolution();
  const r1 = sol.numberOfGoodPaths(
    6,
    [0, 1, 0, 0, 1, 0],
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [2, 5],
    ],
  );
  console.log("Test1:", r1 === 6 ? "PASS" : "FAIL", r1);
  const r2 = sol.numberOfGoodPaths(1, [3], []);
  console.log("Test2:", r2 === 1 ? "PASS" : "FAIL", r2);
  const r3 = sol.numberOfGoodPaths(
    7,
    [1, 1, 1, 1, 1, 1, 1],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  );
  console.log("Test3:", r3 === 28 ? "PASS" : "FAIL", r3);
})();

export {};
