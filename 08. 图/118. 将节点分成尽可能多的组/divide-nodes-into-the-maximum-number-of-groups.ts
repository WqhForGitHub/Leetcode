// 118. 将节点分成尽可能多的组 (LC2493)
// 给定 n 节点无向边 edges。将节点分成若干组，每组节点编号连续（实际只需
// 同组无边相邻，即任意相邻节点不同组），最大化组数。不可行返回 -1。
// 等价：图为二分图时才能合法分组；为使组数最多，对每个连通块枚举起点 BFS，
//       取 BFS 最大层数（即该块的最优染色层数），所有块层数求和。
// 思路：对每个连通块，枚举块内每个节点作为 BFS 起点，做层次 BFS。
//       若 BFS 发现同层相邻（奇环），则整图不可行返回 -1。
//       否则该块贡献最大 BFS 层数（即枚举起点得到的最大层数）。

type Edge = [number, number];

class MaxGroupsSolution {
  private adj: number[][] = [];
  private n = 0;

  /**
   * 主入口：返回最大组数；图含奇环返回 -1
   */
  magnificentSets(n: number, edges: number[][]): number {
    this.n = n;
    this.adj = Array.from({ length: n }, () => []);
    for (const e of edges) {
      this.adj[e[0] - 1].push(e[1] - 1);
      this.adj[e[1] - 1].push(e[0] - 1);
    }
    const color = new Array<number>(n).fill(-1);
    let ans = 0;
    for (let i = 0; i < n; i++) {
      if (color[i] !== -1) {
        continue;
      }
      // 找出 i 所在连通块的所有节点
      const comp: number[] = [];
      const queue: number[] = [i];
      color[i] = 0;
      let isBipartite = true;
      while (queue.length > 0) {
        const u = queue.shift()!;
        comp.push(u);
        for (const v of this.adj[u]) {
          if (color[v] === -1) {
            color[v] = color[u] ^ 1;
            queue.push(v);
          } else if (color[v] === color[u]) {
            isBipartite = false;
          }
        }
      }
      if (!isBipartite) {
        return -1;
      }
      // 枚举块内每个起点 BFS 取最大层数
      let best = 0;
      for (const s of comp) {
        best = Math.max(best, this.bfsLayers(s));
      }
      ans += best;
    }
    return ans;
  }

  /**
   * 从 start 做 BFS，返回最大层数（层数从 1 开始计）
   */
  private bfsLayers(start: number): number {
    const dist = new Array<number>(this.n).fill(-1);
    const queue: number[] = [start];
    dist[start] = 1;
    let maxLayer = 1;
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of this.adj[u]) {
        if (dist[v] === -1) {
          dist[v] = dist[u] + 1;
          maxLayer = Math.max(maxLayer, dist[v]);
          queue.push(v);
        }
      }
    }
    return maxLayer;
  }
}

// 测试
(function test(): void {
  const sol = new MaxGroupsSolution();
  const r1 = sol.magnificentSets(6, [
    [1, 2],
    [1, 4],
    [1, 5],
    [2, 6],
    [2, 3],
    [4, 6],
  ]);
  console.log("Test1:", r1 === 4 ? "PASS" : "FAIL", r1);
  const r2 = sol.magnificentSets(3, [
    [1, 2],
    [2, 3],
    [3, 1],
  ]);
  console.log("Test2 odd cycle:", r2 === -1 ? "PASS" : "FAIL", r2);
})();

export {};
