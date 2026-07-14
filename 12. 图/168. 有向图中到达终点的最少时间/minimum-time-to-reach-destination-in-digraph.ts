// 168. 有向图中到达终点的最少时间
// n 节点有向 edges 带权（耗时），每节点 wait[i] 等待时间，start 到 end 最少时间。
// 解法：Dijkstra 含等待。

interface DigraphEdge {
  to: number;
  w: number;
}

function minimumTimeToReachDestinationInDigraph(
  n: number,
  edges: [number, number, number][],
  wait: number[],
  start: number,
  end: number,
): number {
  const adj: DigraphEdge[][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push({ to: v, w });
  }
  const dist: number[] = new Array(n).fill(Infinity);
  dist[start] = wait[start]; // 出发前在 start 等待
  // 优先队列（数组实现）
  const pq: [number, number][] = [[dist[start], start]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;
    if (d > dist[u]) continue;
    if (u === end) return d;
    for (const { to, w } of adj[u]) {
      const nd = d + w + wait[to];
      if (nd < dist[to]) {
        dist[to] = nd;
        pq.push([nd, to]);
      }
    }
  }
  return dist[end] === Infinity ? -1 : dist[end];
}

// 方法二：Bellman-Ford 含等待松弛
function minimumTimeBellmanFord(
  n: number,
  edges: [number, number, number][],
  wait: number[],
  start: number,
  end: number,
): number {
  const dist: number[] = new Array(n).fill(Infinity);
  dist[start] = wait[start];
  for (let iter = 0; iter < n - 1; iter++) {
    let updated = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w + wait[v] < dist[v]) {
        dist[v] = dist[u] + w + wait[v];
        updated = true;
      }
    }
    if (!updated) break;
  }
  return dist[end] === Infinity ? -1 : dist[end];
}

// 测试
console.log(
  minimumTimeToReachDestinationInDigraph(
    4,
    [
      [0, 1, 2],
      [1, 2, 3],
      [0, 2, 10],
      [2, 3, 1],
    ],
    [1, 0, 0, 0],
    0,
    3,
  ),
);
console.log(
  minimumTimeBellmanFord(
    4,
    [
      [0, 1, 2],
      [1, 2, 3],
      [0, 2, 10],
      [2, 3, 1],
    ],
    [1, 0, 0, 0],
    0,
    3,
  ),
);

export {};
