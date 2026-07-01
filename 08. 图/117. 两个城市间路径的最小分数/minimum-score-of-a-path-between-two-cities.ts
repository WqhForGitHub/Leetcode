// 117. 两个城市间路径的最小分数 (LC2492)
// n 个城市，无向带权边 roads[i] = [a, b, distance]。
// 城市 1 与城市 2 一定连通。定义 1 到 2 某条路径的分数为路径上最短边权。
// 求 1 到 2 所有路径中的最小分数。
// 思路：1 与 2 同属一连通块。任一从 1 出发可达的路径，其最小边权即为答案。
//       因为 1 与 2 连通，从 1 出发的任意路径都可延伸到 2，所以只需在
//       从 1 可达的子图内求最小边权。BFS/DFS 遍历 1 所在连通块即可。

type Edge = [number, number, number];

class MinScoreSolution {
  /**
   * 主入口：返回城市 1 到 2 路径的最小分数
   */
  minScore(n: number, roads: number[][]): number {
    const adj: [number, number][][] = Array.from({ length: n + 1 }, () => []);
    for (const r of roads) {
      adj[r[0]].push([r[1], r[2]]);
      adj[r[1]].push([r[0], r[2]]);
    }
    const visited = new Array<boolean>(n + 1).fill(false);
    const queue: number[] = [1];
    visited[1] = true;
    let ans = Infinity;
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const [v, d] of adj[u]) {
        ans = Math.min(ans, d);
        if (!visited[v]) {
          visited[v] = true;
          queue.push(v);
        }
      }
    }
    return ans;
  }

  /**
   * 并查集版本：合并所有边，记录每个连通块的最小边权，返回 1 所在块的最小边权
   */
  minScoreByUF(n: number, roads: number[][]): number {
    const parent = Array.from({ length: n + 1 }, (_, i) => i);
    const minEdge = new Array<number>(n + 1).fill(Infinity);
    const find = (x: number): number => {
      while (parent[x] !== x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
      }
      return x;
    };
    for (const r of roads) {
      const ra = find(r[0]),
        rb = find(r[1]);
      const d = r[2];
      minEdge[ra] = Math.min(minEdge[ra], d, minEdge[rb]);
      if (ra !== rb) {
        parent[rb] = ra;
      }
    }
    return minEdge[find(1)];
  }
}

// 测试
(function test(): void {
  const sol = new MinScoreSolution();
  const r1 = sol.minScore(4, [
    [1, 2, 9],
    [2, 3, 6],
    [2, 4, 5],
    [1, 4, 7],
  ]);
  console.log("Test1 BFS:", r1 === 5 ? "PASS" : "FAIL", r1);
  const r2 = sol.minScore(4, [
    [1, 2, 2],
    [1, 3, 4],
    [3, 4, 7],
  ]);
  console.log("Test2 BFS:", r2 === 2 ? "PASS" : "FAIL", r2);
  const r3 = sol.minScoreByUF(4, [
    [1, 2, 9],
    [2, 3, 6],
    [2, 4, 5],
    [1, 4, 7],
  ]);
  console.log("Test3 UF:", r3 === 5 ? "PASS" : "FAIL", r3);
})();

export {};
