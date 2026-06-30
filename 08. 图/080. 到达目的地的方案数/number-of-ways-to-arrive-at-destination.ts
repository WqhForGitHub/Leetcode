// ============================================================
// 080. 到达目的地的方案数
// ============================================================
// LeetCode 1976. Number of Ways to Arrive at Destination
// n 个城市的带权无向图（边权为耗时），求从城市 0 到城市 n-1 的最短耗时路径数 mod 1e9+7。
// 时间复杂度：O((N+E) log N)，空间复杂度：O(N+E)

const MOD80 = 1e9 + 7;

// 简易二叉堆优先队列（按距离升序）
class MinHeap80 {
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

// 方法1：Dijkstra + 路径计数 DP（推荐）
function countPaths(n: number, roads: number[][]): number {
  const g: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v, t] of roads) {
    g[u].push([v, t]);
    g[v].push([u, t]);
  }

  const INF = Number.MAX_SAFE_INTEGER;
  const dist = new Array<number>(n).fill(INF);
  const ways = new Array<number>(n).fill(0);
  dist[0] = 0;
  ways[0] = 1;

  const pq = new MinHeap80();
  pq.push([0, 0]);
  while (pq.size > 0) {
    const [d, u] = pq.pop()!;
    if (d > dist[u]) continue;
    for (const [v, w] of g[u]) {
      const nd = d + w;
      if (nd < dist[v]) {
        dist[v] = nd;
        ways[v] = ways[u];
        pq.push([nd, v]);
      } else if (nd === dist[v]) {
        ways[v] = (ways[v] + ways[u]) % MOD80;
      }
    }
  }
  return ways[n - 1];
}

// 方法2：基于 BFS 分层（仅适用于边权相等的情况，此处给出等权版作为对照）
function countPathsEqualWeight(n: number, roads: number[][]): number {
  const g: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v, t] of roads) {
    g[u].push([v, t]);
    g[v].push([u, t]);
  }
  const INF = Number.MAX_SAFE_INTEGER;
  const dist = new Array<number>(n).fill(INF);
  const ways = new Array<number>(n).fill(0);
  dist[0] = 0;
  ways[0] = 1;
  const queue: number[] = [0];
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const [v, w] of g[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        ways[v] = ways[u];
        queue.push(v);
      } else if (dist[u] + w === dist[v]) {
        ways[v] = (ways[v] + ways[u]) % MOD80;
      }
    }
  }
  return ways[n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 080. 到达目的地的方案数 =====");
console.log(
  countPaths(
    7,
    [
      [0, 6, 7],
      [0, 1, 2],
      [1, 2, 3],
      [1, 3, 3],
      [6, 3, 3],
      [3, 5, 1],
      [6, 5, 1],
      [2, 5, 1],
      [0, 4, 5],
      [4, 6, 2],
    ],
  ),
); // 期望 4
console.log(
  countPaths(2, [[0, 1, 1]]),
); // 期望 1

export {};
