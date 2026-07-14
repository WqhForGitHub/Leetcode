// 139. 带权图里旅途的最小代价
// 自定义题。n 个节点的带权无向图 edges=[u,v,w]，求节点 0 到节点 n-1 的旅途最小代价。
// 不可达返回 -1。Dijkstra。
//
// 思路：
// 1. 建邻接表。
// 2. 从 0 出发跑 Dijkstra，求到每个节点的最短距离。
// 3. 返回 dist[n-1]，若为 Infinity 则返回 -1。

type Edge = { to: number; w: number };

class Solution {
  minimumCost(n: number, edges: number[][]): number {
    const adj: Edge[][] = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) {
      adj[u].push({ to: v, w });
      adj[v].push({ to: u, w });
    }

    const INF = Infinity;
    const dist: number[] = new Array(n).fill(INF);
    dist[0] = 0;
    const visited: boolean[] = new Array(n).fill(false);
    for (let it = 0; it < n; it++) {
      let u = -1;
      let best = INF;
      for (let i = 0; i < n; i++) {
        if (!visited[i] && dist[i] < best) {
          best = dist[i];
          u = i;
        }
      }
      if (u === -1) {
        break;
      }
      if (u === n - 1) {
        break;
      }
      visited[u] = true;
      for (const e of adj[u]) {
        if (dist[u] + e.w < dist[e.to]) {
          dist[e.to] = dist[u] + e.w;
        }
      }
    }

    return dist[n - 1] === INF ? -1 : dist[n - 1];
  }

  runTests(): void {
    const cases: {
      n: number;
      edges: number[][];
      expected: number;
    }[] = [
      {
        // 0->1->3 = 2+4=6 ; 0->2->3 = 5+1=6 ; 0->3=10
        n: 4,
        edges: [
          [0, 1, 2],
          [1, 3, 4],
          [0, 2, 5],
          [2, 3, 1],
          [0, 3, 10],
        ],
        expected: 6,
      },
      {
        // 不可达
        n: 4,
        edges: [
          [0, 1, 2],
          [2, 3, 1],
        ],
        expected: -1,
      },
      {
        n: 2,
        edges: [[0, 1, 7]],
        expected: 7,
      },
    ];
    for (const c of cases) {
      const got = this.minimumCost(c.n, c.edges);
      const ok = got === c.expected;
      console.log(`n=${c.n} => ${got} ${ok ? "OK" : "FAIL exp=" + c.expected}`);
    }
  }
}

const s139 = new Solution();
s139.runTests();

export {};
