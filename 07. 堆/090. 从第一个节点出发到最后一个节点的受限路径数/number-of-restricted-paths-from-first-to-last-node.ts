// ============================================================
// 090. 从第一个节点出发到最后一个节点的受限路径数
// ============================================================
// LeetCode 1786. Number of Restricted Paths From First to Last Node
// 受限路径：每个节点到 n 的最短距离严格递减，求路径数。
// 时间复杂度：O(E log V + V log V)，空间复杂度：O(V+E)

// 方法1：Dijkstra + DP
function countRestrictedPaths(n: number, edges: number[][]): number {
  const MOD = 1000000007;
  const graph: Array<Array<{ to: number; w: number }>> = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of edges) {
    graph[u].push({ to: v, w });
    graph[v].push({ to: u, w });
  }
  // Dijkstra 求 n 到各点最短距离
  const dist: number[] = new Array(n + 1).fill(Infinity);
  dist[n] = 0;
  const heap: Array<{ d: number; node: number }> = [];
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
  const pop = (): { d: number; node: number } | undefined => {
    if (heap.length === 0) return undefined;
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
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
  push({ d: 0, node: n });
  while (heap.length > 0) {
    const cur = pop()!;
    if (cur.d > dist[cur.node]) continue;
    for (const { to, w } of graph[cur.node]) {
      const nd = cur.d + w;
      if (nd < dist[to]) {
        dist[to] = nd;
        push({ d: nd, node: to });
      }
    }
  }
  // 按距离排序做 DP
  const nodes: number[] = [];
  for (let i = 1; i <= n; i++) nodes.push(i);
  nodes.sort((a, b) => dist[a] - dist[b]);
  const dp: number[] = new Array(n + 1).fill(0);
  dp[n] = 1;
  for (const u of nodes) {
    for (const { to } of graph[u]) {
      if (dist[to] < dist[u]) {
        dp[u] = (dp[u] + dp[to]) % MOD;
      }
    }
  }
  return dp[1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 090. 从第一个节点出发到最后一个节点的受限路径数 =====");
console.log("路径数:", countRestrictedPaths(5, [[1, 2, 3], [1, 3, 3], [2, 3, 1], [1, 4, 2], [5, 2, 2], [3, 5, 1], [5, 4, 1]])); // 期望 3
console.log("路径数:", countRestrictedPaths(7, [[1, 3, 1], [4, 1, 2], [7, 3, 4], [2, 5, 3], [5, 6, 1], [6, 7, 2], [7, 5, 3], [2, 6, 3]])); // 期望 1

export {};
