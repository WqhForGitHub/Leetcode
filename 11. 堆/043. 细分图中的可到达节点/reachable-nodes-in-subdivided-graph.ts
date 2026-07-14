// ============================================================
// 043. 细分图中的可到达节点
// ============================================================
// LeetCode 882. Reachable Nodes In Subdivided Graph
// 每条边细分为 cnt+1 个节点，从节点 0 出发最多走 maxMoves 步，求可达节点数。
// 时间复杂度：O(E log V)，空间复杂度：O(V+E)

// 方法1：Dijkstra + 最小堆
function reachableNodes(edges: number[][], maxMoves: number, n: number): number {
  const graph: Array<Array<{ to: number; cnt: number }>> = Array.from({ length: n }, () => []);
  for (const [u, v, cnt] of edges) {
    graph[u].push({ to: v, cnt });
    graph[v].push({ to: u, cnt });
  }
  const dist: number[] = new Array(n).fill(Infinity);
  dist[0] = 0;
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
  push({ d: 0, node: 0 });
  while (heap.length > 0) {
    const cur = pop()!;
    if (cur.d > dist[cur.node]) continue;
    for (const { to, cnt } of graph[cur.node]) {
      const nd = cur.d + cnt + 1;
      if (nd < dist[to]) {
        dist[to] = nd;
        push({ d: nd, node: to });
      }
    }
  }
  let result = 0;
  for (let i = 0; i < n; i++) {
    if (dist[i] <= maxMoves) result++;
  }
  for (const [u, v, cnt] of edges) {
    const a = Math.max(0, maxMoves - dist[u]);
    const b = Math.max(0, maxMoves - dist[v]);
    result += Math.min(cnt, a + b);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 043. 细分图中的可到达节点 =====");
console.log(
  "可达节点:",
  reachableNodes(
    [
      [0, 1, 10],
      [0, 2, 1],
      [1, 2, 2],
    ],
    6,
    3,
  ),
); // 期望 13

export {};
