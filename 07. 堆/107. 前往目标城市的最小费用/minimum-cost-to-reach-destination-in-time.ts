// ============================================================
// 107. 前往目标城市的最小费用
// ============================================================
// LeetCode 1928. Minimum Cost to Reach Destination in Time
// 在 maxTime 内从 0 到 n-1 的最小费用（经过城市收费）。
// 时间复杂度：O(maxTime * E)，空间复杂度：O(maxTime * N)

// 方法1：Dijkstra + 状态 (城市, 时间)
function minCost(maxTime: number, edges: number[][], passingFees: number[]): number {
  const n = passingFees.length;
  const graph: Array<Array<{ to: number; time: number }>> = Array.from({ length: n }, () => []);
  for (const [u, v, t] of edges) {
    graph[u].push({ to: v, time: t });
    graph[v].push({ to: u, time: t });
  }
  // minCost[city][time] = 到达 city 用 time 的最小费用
  const minCostArr: number[][] = Array.from({ length: n }, () =>
    new Array(maxTime + 1).fill(Infinity),
  );
  const heap: Array<{ cost: number; city: number; time: number }> = [];
  const push = (v: { cost: number; city: number; time: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].cost < heap[p].cost) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { cost: number; city: number; time: number } => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].cost < heap[s].cost) s = l;
        if (r < heap.length && heap[r].cost < heap[s].cost) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  minCostArr[0][0] = passingFees[0];
  push({ cost: passingFees[0], city: 0, time: 0 });
  let result = Infinity;
  while (heap.length > 0) {
    const cur = pop()!;
    if (cur.city === n - 1) return cur.cost;
    if (cur.cost > minCostArr[cur.city][cur.time]) continue;
    for (const { to, time } of graph[cur.city]) {
      const nt = cur.time + time;
      if (nt > maxTime) continue;
      const nc = cur.cost + passingFees[to];
      if (nc < minCostArr[to][nt]) {
        minCostArr[to][nt] = nc;
        push({ cost: nc, city: to, time: nt });
      }
    }
  }
  return result === Infinity ? -1 : result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 107. 前往目标城市的最小费用 =====");
console.log(
  "费用:",
  minCost(
    30,
    [
      [0, 1, 10],
      [1, 2, 10],
      [2, 5, 10],
      [0, 3, 1],
      [3, 3, 1],
      [3, 6, 1],
      [6, 5, 1],
      [2, 4, 1],
      [4, 5, 1],
    ],
    [5, 1, 2, 20, 20, 3, 2],
  ),
); // 期望 11

export {};
