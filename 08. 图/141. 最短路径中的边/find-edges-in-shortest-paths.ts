// 141. 最短路径中的边 (LC3123)
// 给定 n 个节点的带权无向图，返回从节点 0 到节点 n-1 的所有最短路径上出现的边的索引。
// 思路：Dijkstra 正向（从 0）+ 反向（从 n-1）求最短路距离，
// 枚举每条边 (u,v,w)，若 dist0[u]+w+dist1[v]==dist0[n-1] 或 dist0[v]+w+dist1[u]==dist0[n-1]，
// 则该边在某条最短路上。

type Edge = { to: number; w: number; idx: number };

function buildAdj(n: number, edges: number[][]): Edge[][] {
  const adj: Edge[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v, w] = edges[i];
    adj[u].push({ to: v, w, idx: i });
    adj[v].push({ to: u, w, idx: i });
  }
  return adj;
}

function dijkstra(n: number, adj: Edge[][], src: number): number[] {
  const dist: number[] = new Array(n).fill(Infinity);
  dist[src] = 0;
  // 最小堆：[dist, node]
  const heap: number[][] = [[0, src]];
  while (heap.length > 0) {
    // 简单实现：每次取最小
    let minIdx = 0;
    for (let i = 1; i < heap.length; i++) {
      if (heap[i][0] < heap[minIdx][0]) minIdx = i;
    }
    const [d, u] = heap.splice(minIdx, 1)[0];
    if (d > dist[u]) continue;
    for (const e of adj[u]) {
      const nd = d + e.w;
      if (nd < dist[e.to]) {
        dist[e.to] = nd;
        heap.push([nd, e.to]);
      }
    }
  }
  return dist;
}

function findEdgesInShortestPaths(n: number, edges: number[][]): number[] {
  const adj = buildAdj(n, edges);
  const dist0 = dijkstra(n, adj, 0);
  const dist1 = dijkstra(n, adj, n - 1);
  const target = dist0[n - 1];
  const res: number[] = [];
  for (let i = 0; i < edges.length; i++) {
    const [u, v, w] = edges[i];
    if (dist0[u] + w + dist1[v] === target || dist0[v] + w + dist1[u] === target) {
      res.push(i);
    }
  }
  return res;
}

function findEdgesInShortestPathsMethod2(n: number, edges: number[][]): number[] {
  // 方法2：基于最短路 DAG，正向 BFS 收集在最短路上的边
  const adj = buildAdj(n, edges);
  const dist0 = dijkstra(n, adj, 0);
  const target = dist0[n - 1];
  const res: number[] = [];
  for (let i = 0; i < edges.length; i++) {
    const [u, v, w] = edges[i];
    // 边在最短路上：从 u 出发到 v 缩短到目标
    if (
      (dist0[u] + w === dist0[v] && dist0[v] + (target - dist0[v]) === target) ||
      (dist0[v] + w === dist0[u] && dist0[u] + (target - dist0[u]) === target)
    ) {
      // 该边位于 0 -> n-1 的某条最短路上
      if (dist0[u] + w + (target - dist0[v]) === target && dist0[u] + w === dist0[v]) {
        res.push(i);
      } else if (dist0[v] + w + (target - dist0[u]) === target && dist0[v] + w === dist0[u]) {
        res.push(i);
      }
    }
  }
  return res;
}

// 测试
(() => {
  const n1 = 6;
  const edges1 = [
    [0, 1, 4],
    [0, 2, 1],
    [1, 3, 2],
    [2, 3, 1],
    [3, 4, 3],
    [3, 5, 2],
    [4, 5, 1],
  ];
  console.log(findEdgesInShortestPaths(n1, edges1));
  const n2 = 5;
  const edges2 = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 3, 3],
    [2, 3, 1],
    [3, 4, 2],
  ];
  console.log(findEdgesInShortestPaths(n2, edges2));
})();

export {};
