// ============================================================
// 019. 网络延迟时间
// ============================================================
// LeetCode 743. Network Delay Time
// times=[u,v,w]，n 个节点，信号从 k 发出，求所有节点收到信号的时间；不可达返回 -1
// 时间复杂度：Dijkstra O(E·log V)；Bellman-Ford O(V·E)；SPFA 平均 O(k·E)

// 通用小顶堆
class MinHeap<T> {
  private data: T[] = [];
  constructor(private less: (a: T, b: T) => boolean) {}

  size(): number {
    return this.data.length;
  }

  push(x: T): void {
    this.data.push(x);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.less(this.data[i], this.data[p])) {
        [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
        i = p;
      } else {
        break;
      }
    }
  }

  pop(): T | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      let i = 0;
      const n = this.data.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let smallest = i;
        if (l < n && this.less(this.data[l], this.data[smallest])) smallest = l;
        if (r < n && this.less(this.data[r], this.data[smallest])) smallest = r;
        if (smallest !== i) {
          [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
          i = smallest;
        } else {
          break;
        }
      }
    }
    return top;
  }
}

function buildAdj(times: number[][], n: number): Map<number, [number, number][]> {
  const adj: Map<number, [number, number][]> = new Map();
  for (let i = 1; i <= n; i++) adj.set(i, []);
  for (const [u, v, w] of times) adj.get(u)!.push([v, w]);
  return adj;
}

// 方法1：Dijkstra + 优先队列（推荐）
function networkDelayTime(times: number[][], n: number, k: number): number {
  const adj = buildAdj(times, n);
  const dist: number[] = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const heap = new MinHeap<[number, number]>((a, b) => a[0] < b[0]);
  heap.push([0, k]);

  while (heap.size() > 0) {
    const [d, u] = heap.pop()!;
    if (d > dist[u]) continue;
    for (const [v, w] of adj.get(u)!) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        heap.push([dist[v], v]);
      }
    }
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}

// 方法2：Bellman-Ford
function networkDelayTimeBellman(times: number[][], n: number, k: number): number {
  const dist: number[] = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  for (let i = 0; i < n - 1; i++) {
    let updated = false;
    for (const [u, v, w] of times) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        updated = true;
      }
    }
    if (!updated) break;
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}

// 方法3：SPFA（队列优化 Bellman-Ford）
function networkDelayTimeSPFA(times: number[][], n: number, k: number): number {
  const adj = buildAdj(times, n);
  const dist: number[] = new Array(n + 1).fill(Infinity);
  const inQueue: boolean[] = new Array(n + 1).fill(false);
  dist[k] = 0;
  const queue: number[] = [k];
  inQueue[k] = true;

  while (queue.length > 0) {
    const u = queue.shift()!;
    inQueue[u] = false;
    for (const [v, w] of adj.get(u)!) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        if (!inQueue[v]) {
          inQueue[v] = true;
          queue.push(v);
        }
      }
    }
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 019. 网络延迟时间 =====");
console.log(
  networkDelayTime(
    [
      [2, 1, 1],
      [2, 3, 1],
      [3, 4, 1],
    ],
    4,
    2,
  ),
); // 2
console.log(
  networkDelayTimeBellman(
    [
      [2, 1, 1],
      [2, 3, 1],
      [3, 4, 1],
    ],
    4,
    2,
  ),
); // 2
console.log(
  networkDelayTimeSPFA(
    [
      [2, 1, 1],
      [2, 3, 1],
      [3, 4, 1],
    ],
    4,
    2,
  ),
); // 2
console.log(networkDelayTime([[1, 2, 1]], 2, 2)); // -1
console.log(networkDelayTimeBellman([[1, 2, 1]], 2, 2)); // -1
console.log(networkDelayTimeSPFA([[1, 2, 1]], 2, 2)); // -1

export {};
