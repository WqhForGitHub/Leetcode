// 120. 添加边使所有节点度数都为偶数 (LC2508)
// 给定 n 节点无向边 edges。最多添加 2 条边（可为自环？本题边连接两不同节点），
// 使所有节点度数都变为偶数。判断是否可行。
// 思路：奇数度节点集合记为 odd。每加一条边 (u,v) 会使 u、v 度数奇偶翻转。
//   - odd 数量必须为偶数（度数和恒为偶）；
//   - |odd| = 0：已满足，true；
//   - |odd| = 2：记为 a,b。若 a,b 之间无边，加 (a,b) 即可；否则可借助任意 c：
//     加 (a,c),(b,c)（需 c 与 a、b 均无边或构造）；分类讨论；
//   - |odd| = 4：记为 a,b,c,d。要么加 (a,b),(c,d) 且这两对都无边；
//     要么存在某 x，加 (a,x),(b,c,d 中)... 实际：四点中存在两对无边即可，
//     或存在一点 x 与其中两点无边构成 (a,x),(b,c) 形式（x 可为四点之一或外部）。
//     简化：枚举 4 个奇点配对方案 + 借助外部点方案。
//   - |odd| > 4：不可行，false。

type Edge = [number, number];

class AddEdgesSolution {
  /**
   * 主入口：判断是否可在最多加 2 条边后使所有节点度数为偶数
   */
  isPossible(n: number, edges: number[][]): boolean {
    const degree = new Array<number>(n + 1).fill(0);
    const adj = new Set<string>();
    for (const e of edges) {
      degree[e[0]]++;
      degree[e[1]]++;
      adj.add(this.key(e[0], e[1]));
      adj.add(this.key(e[1], e[0]));
    }
    const odd: number[] = [];
    for (let i = 1; i <= n; i++) {
      if (degree[i] % 2 === 1) {
        odd.push(i);
      }
    }
    const m = odd.length;
    if (m === 0) {
      return true;
    }
    if (m === 2) {
      const a = odd[0],
        b = odd[1];
      if (!adj.has(this.key(a, b))) {
        return true;
      }
      // 借助外部点 c：加 (a,c),(b,c)，c 与 a、b 均无边
      for (let c = 1; c <= n; c++) {
        if (c === a || c === b) {
          continue;
        }
        if (!adj.has(this.key(a, c)) && !adj.has(this.key(b, c))) {
          return true;
        }
      }
      return false;
    }
    if (m === 4) {
      const [a, b, c, d] = odd;
      // 三种两两配对方案
      const pairs: [number, number][][] = [
        [
          [a, b],
          [c, d],
        ],
        [
          [a, c],
          [b, d],
        ],
        [
          [a, d],
          [b, c],
        ],
      ];
      for (const ps of pairs) {
        if (!adj.has(this.key(ps[0][0], ps[0][1])) && !adj.has(this.key(ps[1][0], ps[1][1]))) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  private key(u: number, v: number): string {
    return u + "," + v;
  }
}

// 测试
(function test(): void {
  const sol = new AddEdgesSolution();
  const r1 = sol.isPossible(5, [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 2],
    [1, 3],
    [2, 4],
  ]);
  console.log("Test1:", r1 === true ? "PASS" : "FAIL", r1);
  const r2 = sol.isPossible(4, [
    [1, 2],
    [3, 4],
  ]);
  console.log("Test2:", r2 === true ? "PASS" : "FAIL", r2);
  const r3 = sol.isPossible(4, [
    [1, 2],
    [1, 3],
    [1, 4],
  ]);
  console.log("Test3:", r3 === false ? "PASS" : "FAIL", r3);
})();

export {};
