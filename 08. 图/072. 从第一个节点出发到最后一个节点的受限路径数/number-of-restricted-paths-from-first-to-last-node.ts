// ============================================================
// 072. 从第一个节点出发到最后一个节点的受限路径数
// ============================================================
// LeetCode 1786. Number of Restricted Paths From First to Last Node
// n 个节点的带权无向图。受限路径指节点序列 node1, node2, ..., nodek 满足
// distanceToLast(node1) > distanceToLast(node2) > ... > distanceToLast(nodek=n)。
// 返回从节点 1 到节点 n 的受限路径数 mod 1e9+7。
// 时间复杂度：O((N+E) log N)，空间复杂度：O(N+E)

// 简易二叉堆优先队列（按距离升序）
class MinHeap {
  private data: Array<[number, number]> = [];
  get size(): number {
    return this.data.length;
  }
  push(x: [number, number]): void {
    this.data.push(x);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p][0] <= this.data[i][0]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  pop(): [number, number] | undefined {
    const n = this.data.length;
    if (n === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (n > 1) {
      this.data[0] = last;
      let i = 0;
      const len = this.data.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let s = i;
        if (l < len && this.data[l][0] < this.data[s][0]) s = l;
        if (r < len && this.data[r][0] < this.data[s][0]) s = r;
        if (s === i) break;
        [this.data[s], this.data[i]] = [this.data[i], this.data[s]];
        i = s;
      }
    }
    return top;
  }
}

// 方法1：Dijkstra 求各点到 n 的最短距离 + 按距离升序 DP（推荐）
function countRestrictedPaths(n: number, edges: number[][]): number {
  const MOD = 1e9 + 7;
  const g: Array<Array<[number, number]>> = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of edges) {
    g[u].push([v, w]);
    g[v].push([u, w]);
  }

  // Dijkstra 从 n 出发
  const dist = new Array<number>(n + 1).fill(Infinity);
  dist[n] = 0;
  const pq = new MinHeap();
  pq.push([0, n]);
  while (pq.size > 0) {
    const [d, u] = pq.pop()!;
    if (d > dist[u]) continue;
    for (const [v, w] of g[u]) {
      if (dist[v] > d + w) {
        dist[v] = d + w;
        pq.push([dist[v], v]);
      }
    }
  }

  // 按到 n 的距离升序排列节点，受限路径只能从距离更大走向距离更小
  const nodes = Array.from({ length: n }, (_, i) => i + 1);
  nodes.sort((a, b) => dist[a] - dist[b]);

  const dp = new Array<number>(n + 1).fill(0);
  dp[n] = 1;
  for (const u of nodes) {
    for (const [v] of g[u]) {
      if (dist[v] < dist[u]) {
        dp[u] = (dp[u] + dp[v]) % MOD;
      }
    }
  }
  return dp[1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 072. 从第一个节点出发到最后一个节点的受限路径数 =====");
const r72a = countRestrictedPaths(
  5,
  [
    [1, 2, 3],
    [1, 3, 3],
    [2, 3, 1],
    [1, 4, 2],
    [5, 2, 2],
    [3, 4, 4],
    [1, 5, 10],
  ],
);
console.log(r72a); // 期望 3

const r72b = countRestrictedPaths(
  7,
  [
    [1, 3, 1],
    [4, 1, 2],
    [7, 3, 4],
    [2, 5, 3],
    [5, 6, 1],
    [6, 7, 2],
    [7, 5, 3],
    [2, 6, 4],
  ],
);
console.log(r72b); // 期望 1

export {};
