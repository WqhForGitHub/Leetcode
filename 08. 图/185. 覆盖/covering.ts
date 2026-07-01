// 185. 覆盖
// 自定义题：n 节点二分图，求最小顶点覆盖。
// 思路：匈牙利算法求最大匹配 + Konig 定理（二分图最小顶点覆盖 = 最大匹配数），
//       并可构造具体覆盖集：从所有未匹配左点出发做交错路标记，
//       覆盖集 = (左部未标记) ∪ (右部已标记)。

class Covering {
  private leftCount: number;
  private rightCount: number;
  private adj: number[][]; // 左部 -> 右部邻接

  constructor(leftCount: number, rightCount: number, edges: [number, number][]) {
    this.leftCount = leftCount;
    this.rightCount = rightCount;
    this.adj = Array.from({ length: leftCount }, () => []);
    for (const [u, v] of edges) {
      this.adj[u].push(v);
    }
  }

  // 主方法：返回最小顶点覆盖大小及一个具体覆盖集
  public minVertexCover(): { size: number; leftCover: number[]; rightCover: number[] } {
    const matchR = new Array<number>(this.rightCount).fill(-1);
    const matchL = new Array<number>(this.leftCount).fill(-1);
    let matching = 0;
    for (let u = 0; u < this.leftCount; u++) {
      const visited = new Array<boolean>(this.rightCount).fill(false);
      if (this.tryKuhn(u, visited, matchR)) matching++;
    }
    for (let u = 0; u < this.leftCount; u++) {
      if (matchR[matchL[u]] !== u) {
        // 重建 matchL
      }
    }
    // 重建 matchL
    for (let v = 0; v < this.rightCount; v++) {
      if (matchR[v] !== -1) matchL[matchR[v]] = v;
    }

    // Konig 构造
    const visitedL = new Array<boolean>(this.leftCount).fill(false);
    const visitedR = new Array<boolean>(this.rightCount).fill(false);
    // 从未匹配左点出发的交错 DFS：左->右 走未匹配边，右->左 走匹配边
    const dfsAlt = (u: number): void => {
      visitedL[u] = true;
      for (const v of this.adj[u]) {
        if (!visitedR[v]) {
          visitedR[v] = true;
          // 沿匹配边回到左部
          const mu = matchR[v];
          if (mu !== -1 && !visitedL[mu]) dfsAlt(mu);
        }
      }
    };
    for (let u = 0; u < this.leftCount; u++) {
      if (matchL[u] === -1) dfsAlt(u);
    }

    const leftCover: number[] = [];
    const rightCover: number[] = [];
    for (let u = 0; u < this.leftCount; u++) {
      if (!visitedL[u]) leftCover.push(u);
    }
    for (let v = 0; v < this.rightCount; v++) {
      if (visitedR[v]) rightCover.push(v);
    }
    return { size: leftCover.length + rightCover.length, leftCover, rightCover };
  }

  // 辅助方法：匈牙利增广
  private tryKuhn(u: number, visited: boolean[], matchR: number[]): boolean {
    for (const v of this.adj[u]) {
      if (visited[v]) continue;
      visited[v] = true;
      if (matchR[v] === -1 || this.tryKuhn(matchR[v], visited, matchR)) {
        matchR[v] = u;
        return true;
      }
    }
    return false;
  }
}

// 测试
(() => {
  // 样例：左 {0,1,2}, 右 {0,1,2}
  //   0-0, 0-1, 1-1, 2-2  最大匹配 3, 最小覆盖 3
  const sol1 = new Covering(3, 3, [
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 2],
  ]);
  const r1 = sol1.minVertexCover();
  console.log("Test1 size:", r1.size); // 3

  // 样例：路径图 0-0,1-0,1-1,2-1，最大匹配 2，最小覆盖 2
  const sol2 = new Covering(3, 2, [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ]);
  const r2 = sol2.minVertexCover();
  console.log("Test2 size:", r2.size); // 2

  // 样例：完全二分 K_{2,2}，最小覆盖 2
  const sol3 = new Covering(2, 2, [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]);
  const r3 = sol3.minVertexCover();
  console.log("Test3 size:", r3.size); // 2
})();

export {};
