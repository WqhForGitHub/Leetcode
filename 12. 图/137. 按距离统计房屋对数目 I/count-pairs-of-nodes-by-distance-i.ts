// 137. 按距离统计房屋对数目 I
// 自定义题。n 个节点的无向带权图 edges=[u,v,w]，
// 给定查询数组 queries，对每个查询 q 返回满足 i<j 且 dist(i,j) <= q 的点对数（小规模）。
// BFS/Dijkstra 每点 + 排序二分。
//
// 思路：
// 1. 对每个节点跑一次 Dijkstra 得到全源最短路（小规模 n 较小）。
// 2. 收集所有 i<j 的最短距离到数组 dists 并升序排序。
// 3. 对每个查询 q，二分查找 dists 中 <= q 的元素个数。

type Pair = { to: number; w: number };

class Solution {
  countPairs(n: number, edges: number[][], queries: number[]): number[] {
    const adj: Pair[][] = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) {
      adj[u].push({ to: v, w });
      adj[v].push({ to: u, w });
    }

    const INF = Infinity;
    const dists: number[] = [];

    // 每个节点跑 Dijkstra
    for (let s = 0; s < n; s++) {
      const d: number[] = new Array(n).fill(INF);
      d[s] = 0;
      // 简易优先队列（小规模直接线性取最小）
      const visited: boolean[] = new Array(n).fill(false);
      for (let it = 0; it < n; it++) {
        let u = -1;
        let best = INF;
        for (let i = 0; i < n; i++) {
          if (!visited[i] && d[i] < best) {
            best = d[i];
            u = i;
          }
        }
        if (u === -1) {
          break;
        }
        visited[u] = true;
        for (const e of adj[u]) {
          if (d[u] + e.w < d[e.to]) {
            d[e.to] = d[u] + e.w;
          }
        }
      }
      for (let t = s + 1; t < n; t++) {
        if (d[t] !== INF) {
          dists.push(d[t]);
        }
      }
    }

    dists.sort((a, b) => a - b);

    // 二分查找 <= q 的个数
    const countLE = (q: number): number => {
      let lo = 0;
      let hi = dists.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (dists[mid] <= q) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }
      return lo;
    };

    return queries.map((q) => countLE(q));
  }

  runTests(): void {
    const cases: {
      n: number;
      edges: number[][];
      queries: number[];
      expected: number[];
    }[] = [
      {
        n: 4,
        // 点对距离: (0,1)=2 (0,2)=5 (0,3)=6 (1,2)=3 (1,3)=4 (2,3)=1  升序 [1,2,3,4,5,6]
        edges: [
          [0, 1, 2],
          [1, 2, 3],
          [2, 3, 1],
          [0, 3, 10],
        ],
        queries: [1, 3, 5, 100],
        expected: [1, 3, 5, 6],
      },
      {
        // 点对距离: (0,1)=5 (1,2)=5 (0,2)=10  升序 [5,5,10]
        n: 3,
        edges: [
          [0, 1, 5],
          [1, 2, 5],
        ],
        queries: [4, 5, 10],
        expected: [0, 2, 3],
      },
    ];
    for (const c of cases) {
      const got = this.countPairs(c.n, c.edges, c.queries);
      const ok = got.length === c.expected.length && got.every((v, i) => v === c.expected[i]);
      console.log(
        `n=${c.n} queries=[${c.queries.join(",")}] => [${got.join(", ")}] ${ok ? "OK" : "FAIL exp=[" + c.expected.join(", ") + "]"}`,
      );
    }
  }
}

const s137 = new Solution();
s137.runTests();

export {};
