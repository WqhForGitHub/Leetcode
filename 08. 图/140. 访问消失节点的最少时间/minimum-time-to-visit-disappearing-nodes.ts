// 140. 访问消失节点的最少时间
// LC3112. Minimum Time to Visit Disappearing Nodes
// n 个节点带权无向边 edges=[u,v,w]，disappear[i] 表示节点 i 消失的时间。
// 从节点 0 出发，求到达每个节点的最短时间；要求到达时间严格小于该节点的消失时间，
// 否则不可达返回 -1。Dijkstra（到达时间 < 消失时间才允许松弛/访问）。
//
// 思路：
// 1. 建邻接表，从 0 跑 Dijkstra。
// 2. 起点要求 disappear[0] > 0，否则连起点都不可用。
// 3. 松弛边 u->v 时，newTime = dist[u] + w；仅当 newTime < disappear[v] 且更优才更新 dist[v]。
// 4. 答案：dist[i] 有限则返回 dist[i]，否则 -1。

type Edge = { to: number; w: number };

class Solution {
  minimumTime(n: number, edges: number[][], disappear: number[]): number[] {
    const adj: Edge[][] = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) {
      adj[u].push({ to: v, w });
      adj[v].push({ to: u, w });
    }

    const INF = Infinity;
    const dist: number[] = new Array(n).fill(INF);
    const visited: boolean[] = new Array(n).fill(false);

    // 起点可用性
    if (disappear[0] > 0) {
      dist[0] = 0;
    }

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
      visited[u] = true;
      for (const e of adj[u]) {
        const newTime = dist[u] + e.w;
        // 仅当到达时间严格小于目标节点消失时间，才允许松弛
        if (newTime < disappear[e.to] && newTime < dist[e.to]) {
          dist[e.to] = newTime;
        }
      }
    }

    return dist.map((d) => (d === INF ? -1 : d));
  }

  runTests(): void {
    const cases: {
      n: number;
      edges: number[][];
      disappear: number[];
      expected: number[];
    }[] = [
      {
        // 0->1=2(<3) ; 0->2 直达=4(不<4) ; 0->1->2=3(<4)
        n: 3,
        edges: [
          [0, 1, 2],
          [1, 2, 1],
          [0, 2, 4],
        ],
        disappear: [1, 3, 4],
        expected: [0, 2, 3],
      },
      {
        n: 2,
        edges: [[0, 1, 1]],
        disappear: [1, 1],
        expected: [0, -1],
      },
      {
        n: 3,
        edges: [
          [0, 1, 2],
          [1, 2, 3],
        ],
        disappear: [3, 6, 10],
        expected: [0, 2, 5],
      },
    ];
    for (const c of cases) {
      const got = this.minimumTime(c.n, c.edges, c.disappear);
      const ok = got.length === c.expected.length && got.every((v, i) => v === c.expected[i]);
      console.log(
        `n=${c.n} => [${got.join(", ")}] ${ok ? "OK" : "FAIL exp=[" + c.expected.join(", ") + "]"}`,
      );
    }
  }
}

const s140 = new Solution();
s140.runTests();

export {};
