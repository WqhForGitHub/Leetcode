// 124. 设计可以求最短路径的图类
// LC2642. Design Graph With Shortest Path Calculator
// 题意：实现 Graph 类，构造给定边，addEdge 添加有向边，shortestPath 求最短路径。
// 思路：邻接表 + Dijkstra。

type Edge = { to: number; cost: number };
type Node = { id: number; dist: number };

class Graph {
  private adj: Edge[][];
  private n: number;

  constructor(n: number, edges: number[][]) {
    this.n = n;
    this.adj = Array.from({ length: n }, () => []);
    for (const [f, t, c] of edges) {
      this.adj[f].push({ to: t, cost: c });
    }
  }

  addEdge(edge: number[]): void {
    const [f, t, c] = edge;
    this.adj[f].push({ to: t, cost: c });
  }

  shortestPath(node1: number, node2: number): number {
    const dist: number[] = new Array(this.n).fill(Infinity);
    dist[node1] = 0;
    const pq: Node[] = [{ id: node1, dist: 0 }];
    const push = (node: Node): void => {
      let i = pq.length;
      pq.push(node);
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (pq[p].dist <= pq[i].dist) break;
        [pq[p], pq[i]] = [pq[i], pq[p]];
        i = p;
      }
    };
    const pop = (): Node => {
      const top = pq[0];
      const last = pq.pop()!;
      if (pq.length > 0) {
        pq[0] = last;
        let i = 0;
        const len = pq.length;
        while (true) {
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          let s = i;
          if (l < len && pq[l].dist < pq[s].dist) s = l;
          if (r < len && pq[r].dist < pq[s].dist) s = r;
          if (s === i) break;
          [pq[s], pq[i]] = [pq[i], pq[s]];
          i = s;
        }
      }
      return top;
    };

    while (pq.length > 0) {
      const { id, dist: d } = pop();
      if (id === node2) return d;
      if (d > dist[id]) continue;
      for (const e of this.adj[id]) {
        const nd = d + e.cost;
        if (nd < dist[e.to]) {
          dist[e.to] = nd;
          push({ id: e.to, dist: nd });
        }
      }
    }
    return -1;
  }
}

function test(): void {
  const g = new Graph(4, [
    [0, 2, 5],
    [0, 1, 2],
    [1, 2, 1],
    [3, 0, 3],
  ]);
  const r1 = g.shortestPath(3, 2);
  console.log("case1:", r1, "expected:", 6, r1 === 6);

  g.addEdge([1, 3, 4]);
  const r2 = g.shortestPath(0, 3);
  console.log("case2:", r2, "expected:", 6, r2 === 6);
}

test();

export {};
