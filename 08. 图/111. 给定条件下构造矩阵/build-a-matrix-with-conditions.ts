// 111. 给定条件下构造矩阵 (LC2392)
// 给定正整数 k，以及两个条件数组 rowConditions 和 colConditions。
// rowConditions[i] = [u, v] 表示在矩阵中 u 所在行要在 v 所在行之上；
// colConditions[i] = [u, v] 表示 u 所在列要在 v 所在列左侧。
// 构造 k×k 矩阵，每个 1..k 出现一次，满足所有条件；不可行返回 []。
// 思路：对行约束与列约束分别做拓扑排序，得到两个顺序数组，
//       再据此填入 k×k 矩阵。任一拓扑序存在环则整体无解。

type Edge = [number, number];

class BuildMatrixSolution {
  /**
   * 主入口：返回满足行列条件的 k×k 矩阵，无解返回 []
   */
  buildMatrix(k: number, rowConditions: number[][], colConditions: number[][]): number[][] {
    const rowOrder = this.topo(k, rowConditions);
    if (rowOrder.length === 0) {
      return [];
    }
    const colOrder = this.topo(k, colConditions);
    if (colOrder.length === 0) {
      return [];
    }
    const colPos = new Array<number>(k + 1).fill(0);
    for (let j = 0; j < k; j++) {
      colPos[colOrder[j]] = j;
    }
    const matrix: number[][] = Array.from({ length: k }, () => new Array<number>(k).fill(0));
    for (let i = 0; i < k; i++) {
      const val = rowOrder[i];
      matrix[i][colPos[val]] = val;
    }
    return matrix;
  }

  /**
   * 对 1..k 的节点按 edges=[u,v] (u 需排在 v 前) 做拓扑排序，
   * 返回合法顺序数组；存在环返回空数组。
   */
  private topo(k: number, edges: number[][]): number[] {
    const adj = new Array<number[]>(k + 1);
    for (let i = 0; i <= k; i++) {
      adj[i] = [];
    }
    const indeg = new Array<number>(k + 1).fill(0);
    for (const e of edges) {
      const u = e[0],
        v = e[1];
      adj[u].push(v);
      indeg[v]++;
    }
    const queue: number[] = [];
    for (let i = 1; i <= k; i++) {
      if (indeg[i] === 0) {
        queue.push(i);
      }
    }
    const order: number[] = [];
    while (queue.length > 0) {
      const u = queue.shift()!;
      order.push(u);
      for (const v of adj[u]) {
        indeg[v]--;
        if (indeg[v] === 0) {
          queue.push(v);
        }
      }
    }
    return order.length === k ? order : [];
  }
}

// 测试
(function test(): void {
  const sol = new BuildMatrixSolution();
  const m1 = sol.buildMatrix(
    3,
    [
      [1, 2],
      [3, 2],
    ],
    [
      [2, 1],
      [3, 2],
    ],
  );
  console.log("Test1 rows:", m1.length === 3 ? "PASS" : "FAIL");
  const m2 = sol.buildMatrix(
    3,
    [
      [1, 2],
      [2, 3],
      [3, 1],
    ],
    [[2, 1]],
  );
  console.log("Test2 cycle:", m2.length === 0 ? "PASS" : "FAIL");
  const m3 = sol.buildMatrix(1, [], []);
  console.log("Test3 single:", m3.length === 1 && m3[0][0] === 1 ? "PASS" : "FAIL");
})();

export {};
