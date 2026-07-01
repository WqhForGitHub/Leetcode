// ============================================================
// 030. 细分图中的可到达节点
// ============================================================
// LeetCode 882. Reachable Nodes In Subdivided Graph
// 无向图每条边 [u,v,cnt] 细分为 cnt 个新节点（即该边有 cnt+1 段）。
// 从节点 0 出发，maxMoves 步内最多能访问多少节点（原始 + 细分）。
// 时间复杂度：O((V+E) log V)，空间复杂度：O(V+E)

// 简易二叉小顶堆（元素 = [dist, node]）
class MinHeap {
  private data: number[][] = [];

  get size(): number {
    return this.data.length;
  }

  push(item: number[]): void {
    this.data.push(item);
    let i = this.data.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent][0] <= this.data[i][0]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  pop(): number[] | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      let i = 0;
      const n = this.data.length;
      while (true) {
        let smallest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && this.data[l][0] < this.data[smallest][0]) smallest = l;
        if (r < n && this.data[r][0] < this.data[smallest][0]) smallest = r;
        if (smallest === i) break;
        [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

// 统计逻辑：对每个原始节点 u，若 dist[u] <= maxMoves 则可达（+1）。
// 对每条边 (u,v,cnt)：从 u 侧剩余步数 a=max(0,maxMoves-dist[u])，
// 从 v 侧剩余 b=max(0,maxMoves-dist[v])，该边可访问细分节点数 = min(cnt, a+b)。
function countReachable(n: number, edges: number[][], dist: number[], maxMoves: number): number {
  let total = 0;
  // 原始节点
  for (let u = 0; u < n; u++) {
    if (dist[u] <= maxMoves) total++;
  }
  // 每条边的细分节点
  for (const [u, v, cnt] of edges) {
    const a = Math.max(0, maxMoves - (dist[u] === Infinity ? maxMoves + 1 : dist[u]));
    const b = Math.max(0, maxMoves - (dist[v] === Infinity ? maxMoves + 1 : dist[v]));
    total += Math.min(cnt, a + b);
  }
  return total;
}

// 方法1：Dijkstra + 二叉堆（推荐）
// 思路：边 (u,v,cnt) 的通过代价为 cnt+1。Dijkstra 求节点 0 到各原始节点最短步数，
// 再按上述公式统计。
function reachableNodesDijkstra(edges: number[][], maxMoves: number, n: number): number {
  const adj: number[][][] = Array.from({ length: n }, () => []);
  for (const [u, v, cnt] of edges) {
    adj[u].push([v, cnt + 1]); // 通过该边的代价 = cnt+1
    adj[v].push([u, cnt + 1]);
  }

  const dist: number[] = new Array(n).fill(Infinity);
  dist[0] = 0;
  const pq = new MinHeap();
  pq.push([0, 0]);

  while (pq.size > 0) {
    const [d, u] = pq.pop()!;
    if (d > dist[u]) continue; // 过期条目
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }

  return countReachable(n, edges, dist, maxMoves);
}

// 方法2：Dijkstra + 线性扫描（朴素 O(n^2)）
// 思路：相同算法，但用线性扫描找最小未确定节点，无需堆实现。
function reachableNodesDijkstraLinear(edges: number[][], maxMoves: number, n: number): number {
  const adj: number[][][] = Array.from({ length: n }, () => []);
  for (const [u, v, cnt] of edges) {
    adj[u].push([v, cnt + 1]);
    adj[v].push([u, cnt + 1]);
  }

  const dist: number[] = new Array(n).fill(Infinity);
  dist[0] = 0;
  const finalized: boolean[] = new Array(n).fill(false);

  for (let iter = 0; iter < n; iter++) {
    // 找未确定中 dist 最小者
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      if (!finalized[i] && dist[i] < best) {
        best = dist[i];
        u = i;
      }
    }
    if (u === -1) break;
    finalized[u] = true;
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }

  return countReachable(n, edges, dist, maxMoves);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 030. 细分图中的可到达节点 =====");

console.log(
  reachableNodesDijkstra(
    [
      [0, 1, 10],
      [0, 2, 1],
      [1, 2, 2],
    ],
    6,
    3,
  ),
); // 期望: 13
console.log(
  reachableNodesDijkstra(
    [
      [0, 1, 4],
      [1, 2, 6],
      [0, 2, 8],
      [1, 3, 1],
    ],
    10,
    4,
  ),
); // 期望: 23
console.log(
  reachableNodesDijkstra(
    [
      [1, 2, 4],
      [1, 4, 5],
      [1, 3, 1],
      [2, 3, 4],
      [3, 4, 5],
    ],
    17,
    5,
  ),
); // 期望: 1

console.log(
  reachableNodesDijkstraLinear(
    [
      [0, 1, 10],
      [0, 2, 1],
      [1, 2, 2],
    ],
    6,
    3,
  ),
); // 期望: 13
console.log(
  reachableNodesDijkstraLinear(
    [
      [0, 1, 4],
      [1, 2, 6],
      [0, 2, 8],
      [1, 3, 1],
    ],
    10,
    4,
  ),
); // 期望: 23

export {};
