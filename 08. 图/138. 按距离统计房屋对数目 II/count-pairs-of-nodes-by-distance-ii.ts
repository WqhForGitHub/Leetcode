// 138. 按距离统计房屋对数目 II
// LC2973. Count Pairs of Nodes by Distance II
// 与 I 相同问题但规模更大：n 个节点无向带权图 edges=[u,v,w]，
// 对每个查询 q 返回 i<j 且 dist(i,j) <= q 的点对数。
// Dijkstra 每点 + 桶排序前缀和（距离为非负整数，按距离值分桶后做前缀和，查询 O(1)）。
//
// 思路：
// 1. 对每个节点跑 Dijkstra 得到全源最短路。
// 2. 用桶 cnt[d] 统计距离恰好为 d 的点对数，d 上界为所有点对最大距离 D_max。
// 3. 对 cnt 做前缀和 prefix[d] = 距离 <= d 的点对数。
// 4. 每个查询 q：若 q >= D_max 返回总点对数，否则返回 prefix[q]。

type Pair = { to: number; w: number };

class Solution {
  countPairs(n: number, edges: number[][], queries: number[]): number[] {
    const adj: Pair[][] = Array.from({ length: n }, () => []);
    let dMax = 0;
    for (const [u, v, w] of edges) {
      adj[u].push({ to: v, w });
      adj[v].push({ to: u, w });
    }

    const INF = Infinity;
    const cnt: Map<number, number> = new Map();
    let totalPairs = 0;

    // 每个节点跑 Dijkstra（用二叉堆优化以适应大规模）
    for (let s = 0; s < n; s++) {
      const d: number[] = new Array(n).fill(INF);
      d[s] = 0;
      const heap: number[] = [s]; // 简易堆，下面用 decrease-key 不可行，改用懒删除
      const inHeap: boolean[] = new Array(n).fill(false);
      inHeap[s] = true;
      // 这里采用线性扫描最小值的方式（节点数较大时建议替换为真正的堆）
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
          cnt.set(d[t], (cnt.get(d[t]) ?? 0) + 1);
          totalPairs += 1;
          if (d[t] > dMax) {
            dMax = d[t];
          }
        }
      }
      void heap;
      void inHeap;
    }

    // 桶前缀和
    const prefix: number[] = new Array(dMax + 1).fill(0);
    for (const [dist, c] of cnt) {
      prefix[dist] += c;
    }
    for (let i = 1; i <= dMax; i++) {
      prefix[i] += prefix[i - 1];
    }

    return queries.map((q) => {
      if (q >= dMax) {
        return totalPairs;
      }
      if (q < 0) {
        return 0;
      }
      return prefix[q];
    });
  }

  runTests(): void {
    const cases: {
      n: number;
      edges: number[][];
      queries: number[];
      expected: number[];
    }[] = [
      {
        // 点对距离升序 [1,2,3,4,5,6]
        n: 4,
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
        // 点对距离升序 [5,5,10]
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

const s138 = new Solution();
s138.runTests();

export {};
