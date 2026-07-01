// ============================================================
// 088. 前往目标城市的最小费用
// ============================================================
// 自定义题。n 个城市，有向道路 roads = [u, v, cost]，求 source 到
// destination 的最小费用。Dijkstra 最短路。
// 时间复杂度：O((n + m) log n)，空间复杂度：O(n + m)

function minCost(n: number, roads: number[][], source: number, destination: number): number {
  // 建图
  const g: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, c] of roads) g[u].push([v, c]);
  // dist 数组
  const dist: number[] = new Array(n).fill(Infinity);
  dist[source] = 0;
  // 简单优先队列 [费用, 节点]，取最小费用
  const pq: [number, number][] = [[0, source]];
  while (pq.length > 0) {
    let idx: number = 0;
    for (let i: number = 1; i < pq.length; i++) {
      if (pq[i][0] < pq[idx][0]) idx = i;
    }
    const [d, u]: [number, number] = pq.splice(idx, 1)[0];
    if (d > dist[u]) continue;
    if (u === destination) return d;
    for (const [v, c] of g[u]) {
      const nd: number = d + c;
      if (nd < dist[v]) {
        dist[v] = nd;
        pq.push([nd, v]);
      }
    }
  }
  return dist[destination] === Infinity ? -1 : dist[destination];
}

// 方法1：Dijkstra 优先队列
function f1(n: number, roads: number[][], source: number, destination: number): number {
  return minCost(n, roads, source, destination);
}

// 方法2：Dijkstra 堆优化（用数组模拟最小堆）
function f2(n: number, roads: number[][], source: number, destination: number): number {
  const g: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, c] of roads) g[u].push([v, c]);
  const dist: number[] = new Array(n).fill(Infinity);
  dist[source] = 0;
  // 最小堆：元素为 [费用, 节点]
  const heap: [number, number][] = [[0, source]];
  const popMin = (): [number, number] | null => {
    if (heap.length === 0) return null;
    let idx: number = 0;
    for (let i: number = 1; i < heap.length; i++) {
      if (heap[i][0] < heap[idx][0]) idx = i;
    }
    return heap.splice(idx, 1)[0];
  };
  while (heap.length > 0) {
    const top: [number, number] | null = popMin();
    if (top === null) break;
    const [d, u]: [number, number] = top;
    if (d > dist[u]) continue;
    for (const [v, c] of g[u]) {
      const nd: number = d + c;
      if (nd < dist[v]) {
        dist[v] = nd;
        heap.push([nd, v]);
      }
    }
  }
  return dist[destination] === Infinity ? -1 : dist[destination];
}

console.log("===== 088. 前往目标城市的最小费用 =====");
// 测试
console.log(
  f1(
    4,
    [
      [0, 1, 2],
      [1, 2, 3],
      [0, 2, 8],
      [2, 3, 1],
    ],
    0,
    3,
  ),
); // 6
console.log(
  f2(
    4,
    [
      [0, 1, 2],
      [1, 2, 3],
      [0, 2, 8],
      [2, 3, 1],
    ],
    0,
    3,
  ),
); // 6
console.log(f1(3, [[0, 1, 5]], 0, 2)); // -1
console.log(f2(3, [[0, 1, 5]], 0, 2)); // -1

export {};
