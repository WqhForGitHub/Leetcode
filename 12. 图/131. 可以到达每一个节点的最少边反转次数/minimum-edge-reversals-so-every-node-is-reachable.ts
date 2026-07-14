// 131. 可以到达每一个节点的最少边反转次数
// LC2858. Minimum Edge Reversals So Every Node Is Reachable
// 给定 n 个节点的有向树 edges，对每个节点作为根，求最少需要反转多少条边，
// 使得从根可以到达所有节点。换根 DP。
//
// 思路：
// 1. 把树当作无向图，记录每条边的原始方向。
// 2. 以 0 为根 DFS：对于一条树边 parent->child，
//    若原始方向为 parent->child 则无需反转，否则 +1。得到 ans[0]。
// 3. 换根 DP：从根 u 移到子节点 v 时，仅 u-v 这条边的方向需求反转。
//    若原始方向 u->v，则 ans[v] = ans[u] + 1；若原始 v->u，则 ans[v] = ans[u] - 1。

type Edge = { to: number; dir: 1 | -1 }; // dir=1 表示 from->to 为原始方向，dir=-1 表示反向

class Solution {
  minEdgeReversals(n: number, edges: number[][]): number[] {
    const adj: Edge[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      adj[u].push({ to: v, dir: 1 });
      adj[v].push({ to: u, dir: -1 });
    }

    const ans: number[] = new Array(n).fill(0);
    const visited: boolean[] = new Array(n).fill(false);

    // 第一次 DFS：以 0 为根，统计需要反转的边数
    const dfs1 = (u: number): void => {
      visited[u] = true;
      for (const e of adj[u]) {
        if (visited[e.to]) {
          continue;
        }
        // 父 u -> 子 e.to：若原始方向不是 u->e.to（dir=-1），需要反转
        if (e.dir === -1) {
          ans[0] += 1;
        }
        dfs1(e.to);
      }
    };
    dfs1(0);

    // 第二次 DFS：换根
    const visited2: boolean[] = new Array(n).fill(false);
    const dfs2 = (u: number): void => {
      visited2[u] = true;
      for (const e of adj[u]) {
        if (visited2[e.to]) {
          continue;
        }
        // 根从 u 移到 e.to
        if (e.dir === 1) {
          // 原始 u->to：作为 u 的子边无需反转，作为 e.to 的根边需反转
          ans[e.to] = ans[u] + 1;
        } else {
          // 原始 to->u：作为 u 的根边需要反转，作为 e.to 的子边无需反转
          ans[e.to] = ans[u] - 1;
        }
        dfs2(e.to);
      }
    };
    dfs2(0);

    return ans;
  }

  // 直接测试入口
  runTests(): void {
    const cases: { n: number; edges: number[][]; expected: number[] }[] = [
      {
        n: 4,
        edges: [
          [0, 1],
          [2, 1],
          [2, 3],
        ],
        expected: [1, 1, 0, 2],
      },
      {
        n: 3,
        edges: [
          [1, 2],
          [2, 0],
        ],
        expected: [2, 0, 1],
      },
    ];
    for (const c of cases) {
      const got = this.minEdgeReversals(c.n, c.edges);
      const ok = got.length === c.expected.length && got.every((v, i) => v === c.expected[i]);
      console.log(
        `n=${c.n} edges=${JSON.stringify(c.edges)} => [${got.join(", ")}] ${ok ? "OK" : "FAIL exp=[" + c.expected.join(", ") + "]"}`,
      );
    }
  }
}

const s131 = new Solution();
s131.runTests();

export {};
