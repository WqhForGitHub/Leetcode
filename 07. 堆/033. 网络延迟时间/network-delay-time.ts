// ============================================================
// 033. 网络延迟时间
// ============================================================
// LeetCode 743. Network Delay Time
// 从节点 k 发送信号，求所有节点收到信号的时间。
// 时间复杂度：O(E log V)，空间复杂度：O(V+E)

// 方法1：Dijkstra + 最小堆（推荐）
function networkDelayTime(times: number[][], n: number, k: number): number {
  const graph: Array<Array<{ to: number; w: number }>> = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) graph[u].push({ to: v, w });
  const dist: number[] = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
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
  push({ d: 0, node: k });
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
  let max = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    max = Math.max(max, dist[i]);
  }
  return max;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 033. 网络延迟时间 =====");
console.log("延迟:", networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2)); // 期望 2

export {};
