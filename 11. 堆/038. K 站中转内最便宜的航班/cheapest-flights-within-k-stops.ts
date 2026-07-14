// ============================================================
// 038. K 站中转内最便宜的航班
// ============================================================
// LeetCode 787. Cheapest Flights Within K Stops
// 有 n 个城市和航班，从 src 出发最多经过 k 站到达 dst 的最便宜价格。
// 时间复杂度：O(E log V)，空间复杂度：O(V+E)

// 方法1：Bellman-Ford（推荐）
function findCheapestPrice(
  n: number,
  flights: number[][],
  src: number,
  dst: number,
  k: number,
): number {
  let prices: number[] = new Array(n).fill(Infinity);
  prices[src] = 0;
  for (let i = 0; i <= k; i++) {
    const temp = prices.slice();
    let updated = false;
    for (const [u, v, w] of flights) {
      if (prices[u] !== Infinity && prices[u] + w < temp[v]) {
        temp[v] = prices[u] + w;
        updated = true;
      }
    }
    prices = temp;
    if (!updated) break;
  }
  return prices[dst] === Infinity ? -1 : prices[dst];
}

// 方法2：Dijkstra + 最小堆（带站数限制）
function findCheapestPriceDijkstra(
  n: number,
  flights: number[][],
  src: number,
  dst: number,
  k: number,
): number {
  const graph: Array<Array<{ to: number; w: number }>> = Array.from({ length: n }, () => []);
  for (const [u, v, w] of flights) graph[u].push({ to: v, w });
  const heap: Array<{ cost: number; node: number; stops: number }> = [];
  const push = (v: { cost: number; node: number; stops: number }): void => {
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
  const pop = (): { cost: number; node: number; stops: number } | undefined => {
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
  push({ cost: 0, node: src, stops: 0 });
  const visited: number[] = new Array(n).fill(Infinity);
  while (heap.length > 0) {
    const cur = pop()!;
    if (cur.node === dst) return cur.cost;
    if (cur.stops > k) continue;
    if (visited[cur.node] < cur.stops) continue;
    visited[cur.node] = cur.stops;
    for (const { to, w } of graph[cur.node]) {
      push({ cost: cur.cost + w, node: to, stops: cur.stops + 1 });
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 038. K 站中转内最便宜的航班 =====");
console.log(
  "Bellman-Ford:",
  findCheapestPrice(
    4,
    [
      [0, 1, 100],
      [1, 2, 100],
      [2, 0, 100],
      [1, 3, 600],
      [2, 3, 200],
    ],
    0,
    3,
    1,
  ),
); // 期望 700
console.log(
  "Dijkstra:",
  findCheapestPriceDijkstra(
    3,
    [
      [0, 1, 100],
      [1, 2, 100],
      [0, 2, 500],
    ],
    0,
    2,
    1,
  ),
); // 期望 200

export {};
