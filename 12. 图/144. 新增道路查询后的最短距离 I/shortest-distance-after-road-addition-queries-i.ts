// 144. 新增道路查询后的最短距离 I (LC3243)
// n 个节点形成链路 0-1-2-...-(n-1)，queries 每次添加一条边，
// 每次查询后求 0 到 n-1 的最短距离。每次 BFS。

function buildChain(n: number): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i + 1 < n; i++) {
    adj[i].push(i + 1);
    adj[i + 1].push(i);
  }
  return adj;
}

function bfsDist(adj: number[][], src: number, dst: number): number {
  if (src === dst) return 0;
  const n = adj.length;
  const dist: number[] = new Array(n).fill(-1);
  dist[src] = 0;
  const q: number[] = [src];
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    for (const v of adj[u]) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        if (v === dst) return dist[v];
        q.push(v);
      }
    }
  }
  return dist[dst];
}

function shortestDistanceAfterRoadAdditionQueriesI(n: number, queries: number[][]): number[] {
  const adj = buildChain(n);
  const res: number[] = [];
  for (const [u, v] of queries) {
    adj[u].push(v);
    adj[v].push(u);
    res.push(bfsDist(adj, 0, n - 1));
  }
  return res;
}

function shortestDistanceAfterRoadAdditionQueriesIMethod2(
  n: number,
  queries: number[][],
): number[] {
  // 方法2：每次 Dijkstra（O(q * (n + m) log n)），亦可
  const adj = buildChain(n);
  const res: number[] = [];
  for (const [u, v] of queries) {
    adj[u].push(v);
    adj[v].push(u);
    const dist: number[] = new Array(n).fill(Infinity);
    dist[0] = 0;
    const heap: [number, number][] = [[0, 0]];
    while (heap.length > 0) {
      let mi = 0;
      for (let i = 1; i < heap.length; i++) {
        if (heap[i][0] < heap[mi][0]) mi = i;
      }
      const [d, x] = heap.splice(mi, 1)[0];
      if (x === n - 1) break;
      if (d > dist[x]) continue;
      for (const y of adj[x]) {
        if (d + 1 < dist[y]) {
          dist[y] = d + 1;
          heap.push([dist[y], y]);
        }
      }
    }
    res.push(dist[n - 1]);
  }
  return res;
}

// 测试
(() => {
  console.log(
    shortestDistanceAfterRoadAdditionQueriesI(5, [
      [2, 4],
      [0, 2],
      [0, 4],
    ]),
  );
  // [3, 2, 1]
  console.log(
    shortestDistanceAfterRoadAdditionQueriesI(4, [
      [0, 3],
      [0, 2],
    ]),
  );
  // [1, 1]
})();

export {};
