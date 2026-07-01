// 128. 修改图中的边权
// LC2694. Modify Graph Edge Weights
// 题意：n 节点 edges（权 -1 待定），使 1 到 n 最短路 = target。返回修改后的边权，无解返回 []。
// 思路：两次 Dijkstra 调整 -1 边。第一次将 -1 视为 1，若最短路 > target 无解；
//      第二次逐步将 -1 边调整为 target - 当前最短路 + 1 等。

type Edge = { to: number; cost: number; idx: number };

function modifiedGraphEdges(
  n: number,
  edges: number[][],
  source: number,
  destination: number,
  target: number,
): number[][] {
  const adj: Edge[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v] = edges[i];
    adj[u].push({ to: v, cost: Math.max(1, edges[i][2]), idx: i });
    adj[v].push({ to: u, cost: Math.max(1, edges[i][2]), idx: i });
  }

  const dijkstra = (src: number, dest: number): number => {
    const dist: number[] = new Array(n).fill(Infinity);
    dist[src] = 0;
    const pq: [number, number][] = [[0, src]];
    while (pq.length > 0) {
      let mi = 0;
      for (let i = 1; i < pq.length; i++) {
        if (pq[i][0] < pq[mi][0]) mi = i;
      }
      const [d, u] = pq.splice(mi, 1)[0];
      if (d > dist[u]) continue;
      if (u === dest) return d;
      for (const e of adj[u]) {
        const nd = d + e.cost;
        if (nd < dist[e.to]) {
          dist[e.to] = nd;
          pq.push([nd, e.to]);
        }
      }
    }
    return dist[dest];
  };

  // 第一次：所有 -1 当 1
  let shortest = dijkstra(source, destination);
  if (shortest > target) return [];

  // 若已 == target，把所有 -1 改成大值
  if (shortest === target) {
    for (const e of edges) {
      if (e[2] === -1) e[2] = target + 1;
    }
    return edges;
  }

  // 第二次：逐步调整 -1 边
  // 反复将最短路上的 -1 边调整为 (target - shortest + 1) 使其正好等于 target
  while (shortest < target) {
    let found = false;
    for (let i = 0; i < edges.length; i++) {
      if (edges[i][2] !== -1) continue;
      const [u, v] = edges[i];
      edges[i][2] = 1;
      adj[u] = adj[u].map((e) => (e.idx === i ? { ...e, cost: 1 } : e));
      adj[v] = adj[v].map((e) => (e.idx === i ? { ...e, cost: 1 } : e));
      const newShort = dijkstra(source, destination);
      if (newShort <= target) {
        // 把这条边提升到 target - newShort + 1
        const w = target - newShort + 1;
        edges[i][2] = w;
        adj[u] = adj[u].map((e) => (e.idx === i ? { ...e, cost: w } : e));
        adj[v] = adj[v].map((e) => (e.idx === i ? { ...e, cost: w } : e));
        // 其余 -1 设为大值
        for (let j = 0; j < edges.length; j++) {
          if (edges[j][2] === -1) edges[j][2] = target + 1;
        }
        // 重建邻接
        for (let k = 0; k < n; k++) adj[k] = [];
        for (let k = 0; k < edges.length; k++) {
          const [a, b, c] = edges[k];
          adj[a].push({ to: b, cost: c, idx: k });
          adj[b].push({ to: a, cost: c, idx: k });
        }
        if (dijkstra(source, destination) === target) return edges;
        return [];
      }
      // 还原
      edges[i][2] = -1;
      adj[u] = adj[u].map((e) => (e.idx === i ? { ...e, cost: 1 } : e));
      adj[v] = adj[v].map((e) => (e.idx === i ? { ...e, cost: 1 } : e));
      found = true;
    }
    if (!found) break;
    shortest = dijkstra(source, destination);
  }

  return shortest === target ? edges : [];
}

function test(): void {
  const case1 = modifiedGraphEdges(
    5,
    [
      [4, 1, -1],
      [2, 0, -1],
      [0, 3, -1],
      [4, 3, -1],
    ],
    0,
    1,
    5,
  );
  console.log("case1 ok:", case1.length > 0);

  const case2 = modifiedGraphEdges(
    3,
    [
      [0, 1, -1],
      [0, 2, 5],
    ],
    0,
    2,
    6,
  );
  console.log("case2 ok:", case2.length > 0);
}

test();

export {};
