// ============================================================
// 157. 找到 K 次跨越的最短路径
// ============================================================
// LeetCode 2714. Find Shortest Path with K Hops
// 找从源到目标最多跳 k 跳的最短路径。
// 时间复杂度：O(V^2 * K)，空间复杂度：O(V * K)

// 方法1：Dijkstra 变体（堆中状态含跳数）
function shortestPathWithKHops(n: number, edges: number[][], s: number, d: number, k: number): number {
  const adjList: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) adjList.set(i, []);
  for (const [u, v] of edges) {
    adjList.get(u)!.push(v);
    adjList.get(v)!.push(u);
  }
  // dist[node][hops] = min distance using at most hops
  const dist: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(Infinity));
  for (let h = 0; h <= k; h++) dist[s][h] = 0;
  const heap: Array<[number, number, number]> = [[0, s, 0]]; // [cost, node, hops]
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] < heap[p][0]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = heap.length;
    while (true) {
      let s2 = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l][0] < heap[s2][0]) s2 = l;
      if (r < len && heap[r][0] < heap[s2][0]) s2 = r;
      if (s2 !== i) { [heap[i], heap[s2]] = [heap[s2], heap[i]]; i = s2; }
      else break;
    }
  };
  while (heap.length > 0) {
    const [cost, node, hops] = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown();
    if (node === d) return cost;
    if (cost > dist[node][hops]) continue;
    for (const neighbor of adjList.get(node) ?? []) {
      // 不跳
      if (cost + 1 < dist[neighbor][hops]) {
        dist[neighbor][hops] = cost + 1;
        heap.push([cost + 1, neighbor, hops]);
        siftUp(heap.length - 1);
      }
      // 跳
      if (hops < k && cost < dist[neighbor][hops + 1]) {
        dist[neighbor][hops + 1] = cost;
        heap.push([cost, neighbor, hops + 1]);
        siftUp(heap.length - 1);
      }
    }
  }
  return Math.min(...dist[d]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 157. 找到 K 次跨越的最短路径 =====");
console.log("Dijkstra:", shortestPathWithKHops(5, [[0, 2], [0, 3], [1, 4], [2, 4], [3, 4]], 0, 4, 1)); // 期望 1

export {};
