// ============================================================
// 113. 包含要求路径的最小带权子图
// ============================================================
// LeetCode 2203. Minimum Weighted Subgraph With the Required Paths
// 求从 src1、src2 到 dest 的最小带权子图。
// 时间复杂度：O(E log V)，空间复杂度：O(V+E)

// 方法1：三次 Dijkstra
function minimumWeightSubgraph(
  n: number,
  edges: number[][],
  src1: number,
  src2: number,
  dest: number,
): number {
  const buildGraph = (): Array<Array<{ to: number; w: number }>> =>
    Array.from({ length: n }, () => []);
  const graph = buildGraph();
  const revGraph = buildGraph();
  for (const [u, v, w] of edges) {
    graph[u].push({ to: v, w });
    revGraph[v].push({ to: u, w });
  }
  const dijkstra = (g: Array<Array<{ to: number; w: number }>>, src: number): number[] => {
    const dist: number[] = new Array(n).fill(Infinity);
    dist[src] = 0;
    const heap: Array<{ d: number; node: number }> = [{ d: 0, node: src }];
    const push = (v: { d: number; node: number }): void => {
      heap.push(v);
      let i = heap.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (heap[i].d < heap[p].d) {
          [heap[i], heap[p]] = [heap[p], heap[i]];
          i = p;
        } else break;
      }
    };
    const pop = (): { d: number; node: number } => {
      const top = heap[0];
      const last = heap.pop()!;
      if (heap.length > 0) {
        heap[0] = last;
        let i = 0;
        while (true) {
          let s = i;
          const l = 2 * i + 1,
            r = 2 * i + 2;
          if (l < heap.length && heap[l].d < heap[s].d) s = l;
          if (r < heap.length && heap[r].d < heap[s].d) s = r;
          if (s !== i) {
            [heap[i], heap[s]] = [heap[s], heap[i]];
            i = s;
          } else break;
        }
      }
      return top;
    };
    while (heap.length > 0) {
      const cur = pop()!;
      if (cur.d > dist[cur.node]) continue;
      for (const { to, w } of g[cur.node]) {
        const nd = cur.d + w;
        if (nd < dist[to]) {
          dist[to] = nd;
          push({ d: nd, node: to });
        }
      }
    }
    return dist;
  };
  const d1 = dijkstra(graph, src1);
  const d2 = dijkstra(graph, src2);
  const dd = dijkstra(revGraph, dest);
  let result = Infinity;
  for (let x = 0; x < n; x++) {
    if (d1[x] !== Infinity && d2[x] !== Infinity && dd[x] !== Infinity) {
      result = Math.min(result, d1[x] + d2[x] + dd[x]);
    }
  }
  return result === Infinity ? -1 : result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 113. 包含要求路径的最小带权子图 =====");
console.log(
  "最小权:",
  minimumWeightSubgraph(
    6,
    [
      [0, 2, 2],
      [0, 5, 6],
      [1, 0, 3],
      [1, 4, 5],
      [2, 1, 1],
      [2, 3, 3],
      [2, 3, 4],
      [3, 4, 2],
      [4, 5, 1],
    ],
    0,
    1,
    5,
  ),
); // 期望 9

export {};
