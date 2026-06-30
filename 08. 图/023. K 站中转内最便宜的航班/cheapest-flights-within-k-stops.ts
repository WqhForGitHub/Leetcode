// ============================================================
// 023. K 站中转内最便宜的航班
// ============================================================
// LeetCode 787. Cheapest Flights Within K Stops
// flights = [u, v, w]，从 src 到 dst 最多经过 k 个中转点，求最便宜价格。
// 时间复杂度：O((V+E)*k)，空间复杂度：O(V)

// 方法1：Bellman-Ford 迭代 k+1 轮（推荐）
// 思路：每轮用上一轮的距离数组松弛所有边，迭代 k+1 轮（最多经 k 中转即 k+1 条边）。
// 关键：每轮必须基于上一轮的快照，避免同轮内多次松弛导致超过 k 中转。
function findCheapestPriceBF(
  n: number,
  flights: number[][],
  src: number,
  dst: number,
  k: number,
): number {
  const INF = Number.MAX_SAFE_INTEGER;
  let dist: number[] = new Array(n).fill(INF);
  dist[src] = 0;

  for (let i = 0; i <= k; i++) {
    // k+1 轮，每轮基于上一轮快照
    const next: number[] = [...dist];
    for (const [u, v, w] of flights) {
      if (dist[u] !== INF && dist[u] + w < next[v]) {
        next[v] = dist[u] + w;
      }
    }
    dist = next;
  }
  return dist[dst] === INF ? -1 : dist[dst];
}

// 方法2：Dijkstra（带停留层数）
// 思路：优先队列按价格升序，状态 = (price, node, stops)。
// 当 stops > k+1 跳过；记录 visited[node][stops] 防止重复扩展。
function findCheapestPriceDijkstra(
  n: number,
  flights: number[][],
  src: number,
  dst: number,
  k: number,
): number {
  // 建邻接表
  const adj: number[][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of flights) adj[u].push([v, w]);

  const INF = Number.MAX_SAFE_INTEGER;
  // price[node][stops]：到达 node 且已用 stops 次中转的最小价格
  const price: number[][] = Array.from({ length: n }, () =>
    new Array(k + 2).fill(INF),
  );
  price[src][0] = 0;

  // 优先队列：[price, node, stops]，按 price 升序
  const pq: number[][] = [[0, src, 0]];

  while (pq.length > 0) {
    // 取最小元素（小规模用排序模拟堆）
    pq.sort((a, b) => a[0] - b[0]);
    const [cost, u, stops] = pq.shift()!;

    if (u === dst) return cost;
    if (stops > k) continue; // 超过 k 中转，不能再扩展

    for (const [v, w] of adj[u]) {
      if (cost + w < price[v][stops + 1]) {
        price[v][stops + 1] = cost + w;
        pq.push([cost + w, v, stops + 1]);
      }
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 023. K 站中转内最便宜的航班 =====");

// n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1
console.log(findCheapestPriceBF(4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1)); // 期望: 700
// k=0
console.log(findCheapestPriceBF(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0)); // 期望: 500
// k=1
console.log(findCheapestPriceBF(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1)); // 期望: 200

console.log(findCheapestPriceDijkstra(4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1)); // 期望: 700
console.log(findCheapestPriceDijkstra(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0)); // 期望: 500
console.log(findCheapestPriceDijkstra(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1)); // 期望: 200

export {};
