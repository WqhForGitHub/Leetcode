// ============================================================
// 156. 修改图中的边权
// ============================================================
// LeetCode 2699. Modify Graph Edge Weights
// 将权重为 -1 的边修改为正整数，使源到目标的最短路径等于 target。
// 时间复杂度：O(E * (V + E) log V)，空间复杂度：O(V + E)

// 方法1：Dijkstra + 贪心修改
function modifiedGraphEdges(n: number, edges: number[][], source: number, destination: number, target: number): number[][] {
  const adjList: Map<number, Array<[number, number]>> = new Map();
  for (let i = 0; i < n; i++) adjList.set(i, []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v, w] = edges[i];
    adjList.get(u)!.push([v, i]);
    adjList.get(v)!.push([u, i]);
  }
  const dist: number[] = new Array(n).fill(Infinity);
  dist[source] = 0;
  // 第一轮：所有 -1 当 1
  const dijkstra = (weights: number[]): number => {
    const d: number[] = new Array(n).fill(Infinity);
    d[source] = 0;
    const heap: Array<[number, number]> = [[0, source]];
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
        let s = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < len && heap[l][0] < heap[s][0]) s = l;
        if (r < len && heap[r][0] < heap[s][0]) s = r;
        if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
        else break;
      }
    };
    while (heap.length > 0) {
      const [d0, u] = heap[0];
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) siftDown();
      if (d0 > d[u]) continue;
      if (u === destination) return d0;
      for (const [v, ei] of adjList.get(u) ?? []) {
        const w = weights[ei] === -1 ? 1 : weights[ei];
        if (d0 + w < d[v]) {
          d[v] = d0 + w;
          heap.push([d[v], v]);
          siftUp(heap.length - 1);
        }
      }
    }
    return d[destination];
  };
  // 先把所有 -1 设为 1，计算最短路径
  let d = dijkstra(edges.map(e => e[2]));
  if (d > target) return [];
  // 逐条边调整
  const weights = edges.map(e => e[2]);
  let changed = true;
  while (changed && d < target) {
    changed = false;
    for (let i = 0; i < edges.length; i++) {
      if (weights[i] !== -1) continue;
      weights[i] = 1;
      d = dijkstra(weights);
      if (d <= target) {
        weights[i] += target - d;
        changed = true;
        d = target;
        break;
      }
      changed = true;
    }
  }
  if (d !== target) return [];
  // 剩余 -1 设为 1
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] === -1) weights[i] = 1;
  }
  return edges.map((e, i) => [e[0], e[1], weights[i]]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 156. 修改图中的边权 =====");
console.log("Dijkstra:", JSON.stringify(modifiedGraphEdges(
  5, [[4, 1, -1], [2, 0, -1], [0, 3, -1], [4, 3, -1]], 0, 1, 5
))); // 期望 [[4,1,1],[2,0,1],[0,3,1],[4,3,3]] 或类似

export {};
