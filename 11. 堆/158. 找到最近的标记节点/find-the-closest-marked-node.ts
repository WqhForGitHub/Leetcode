// ============================================================
// 158. 找到最近的标记节点
// ============================================================
// LeetCode 2737. Find the Closest Marked Node
// 在无向图中找从源点到标记节点的最短距离。
// 时间复杂度：O(E log V)，空间复杂度：O(V + E)

// 方法1：Dijkstra
function minimumDistance(n: number, edges: number[][], s: number, marked: number[]): number {
  const adjList: Map<number, Array<[number, number]>> = new Map();
  for (let i = 0; i < n; i++) adjList.set(i, []);
  for (const [u, v, w] of edges) {
    adjList.get(u)!.push([v, w]);
    adjList.get(v)!.push([u, w]);
  }
  const markedSet: Set<number> = new Set(marked);
  const dist: number[] = new Array(n).fill(Infinity);
  dist[s] = 0;
  const heap: Array<[number, number]> = [[0, s]];
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] < heap[p][0]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = heap.length;
    while (true) {
      let s2 = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < len && heap[l][0] < heap[s2][0]) s2 = l;
      if (r < len && heap[r][0] < heap[s2][0]) s2 = r;
      if (s2 !== i) {
        [heap[i], heap[s2]] = [heap[s2], heap[i]];
        i = s2;
      } else break;
    }
  };
  while (heap.length > 0) {
    const [d, u] = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown();
    if (markedSet.has(u)) return d;
    if (d > dist[u]) continue;
    for (const [v, w] of adjList.get(u) ?? []) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        heap.push([d + w, v]);
        siftUp(heap.length - 1);
      }
    }
  }
  return -1;
}

// 方法2：BFS（当边权为1时）
function minimumDistanceBFS(n: number, edges: number[][], s: number, marked: number[]): number {
  const adjList: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) adjList.set(i, []);
  for (const [u, v] of edges) {
    adjList.get(u)!.push(v);
    adjList.get(v)!.push(u);
  }
  const markedSet: Set<number> = new Set(marked);
  const visited: boolean[] = new Array(n).fill(false);
  visited[s] = true;
  const queue: Array<[number, number]> = [[s, 0]];
  let head = 0;
  while (head < queue.length) {
    const [u, d] = queue[head++];
    if (markedSet.has(u)) return d;
    for (const v of adjList.get(u) ?? []) {
      if (!visited[v]) {
        visited[v] = true;
        queue.push([v, d + 1]);
      }
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 158. 找到最近的标记节点 =====");
console.log(
  "Dijkstra:",
  minimumDistance(
    4,
    [
      [0, 1, 1],
      [1, 2, 3],
      [2, 3, 2],
    ],
    0,
    [2, 3],
  ),
); // 期望 4
console.log(
  "Dijkstra:",
  minimumDistance(
    5,
    [
      [0, 1, 2],
      [0, 2, 4],
      [1, 3, 1],
      [2, 3, 3],
      [3, 4, 2],
    ],
    0,
    [3, 4],
  ),
); // 期望 3

export {};
