// 134. 关闭分部的可行集合数目
// LC2959. Count Possible Sets of Closing Branches
// 给定 n 个分部的距离矩阵 distance 与阈值 maxDistance。
// 关闭若干分部后，任意两个开放分部之间（仅经过开放分部的）最短距离 <= maxDistance。
// 求可行的关闭方案数（等价于可行的开放集合数）。二进制枚举 + Floyd 验证。
//
// 思路：
// 1. n 较小（<=10），枚举所有开放子集 mask。
// 2. 对每个 mask，仅保留开放节点，初始化距离矩阵并跑 Floyd（仅以开放节点为中转）。
// 3. 检查所有开放节点对距离 <= maxDistance，则该集合合法。
// 4. 累加合法集合数。

class Solution {
  numberOfSets(n: number, maxDistance: number, roads: number[][]): number {
    // roads 给出无向带权边，构建原始邻接矩阵
    const base: number[][] = Array.from({ length: n }, () => new Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) {
      base[i][i] = 0;
    }
    for (const [u, v, w] of roads) {
      if (w < base[u][v]) {
        base[u][v] = w;
        base[v][u] = w;
      }
    }

    let result = 0;
    const total = 1 << n;
    for (let mask = 0; mask < total; mask++) {
      // 复制距离矩阵，仅保留开放节点
      const dist: number[][] = Array.from({ length: n }, (_, i) => base[i].slice());
      // 关闭节点之间的边置为不可达
      for (let i = 0; i < n; i++) {
        if ((mask >> i) & 1) {
          continue;
        }
        for (let j = 0; j < n; j++) {
          dist[i][j] = Infinity;
          dist[j][i] = Infinity;
        }
        dist[i][i] = 0;
      }

      // Floyd，仅以开放节点为中转
      for (let k = 0; k < n; k++) {
        if (!((mask >> k) & 1)) {
          continue;
        }
        for (let i = 0; i < n; i++) {
          if (!((mask >> i) & 1)) {
            continue;
          }
          for (let j = 0; j < n; j++) {
            if (!((mask >> j) & 1)) {
              continue;
            }
            if (dist[i][k] + dist[k][j] < dist[i][j]) {
              dist[i][j] = dist[i][k] + dist[k][j];
            }
          }
        }
      }

      // 验证所有开放节点对
      let ok = true;
      for (let i = 0; i < n && ok; i++) {
        if (!((mask >> i) & 1)) {
          continue;
        }
        for (let j = i + 1; j < n; j++) {
          if (!((mask >> j) & 1)) {
            continue;
          }
          if (dist[i][j] > maxDistance) {
            ok = false;
            break;
          }
        }
      }
      if (ok) {
        result += 1;
      }
    }
    return result;
  }

  runTests(): void {
    const cases: {
      n: number;
      maxDistance: number;
      roads: number[][];
      expected: number;
    }[] = [
      {
        n: 3,
        maxDistance: 5,
        roads: [
          [0, 1, 2],
          [1, 2, 10],
          [0, 2, 10],
        ],
        expected: 5,
      },
      {
        n: 3,
        maxDistance: 5,
        roads: [
          [0, 1, 20],
          [0, 1, 10],
          [1, 2, 2],
          [0, 2, 2],
        ],
        expected: 7,
      },
      {
        n: 1,
        maxDistance: 10,
        roads: [],
        expected: 2,
      },
    ];
    for (const c of cases) {
      const got = this.numberOfSets(c.n, c.maxDistance, c.roads);
      const ok = got === c.expected;
      console.log(
        `n=${c.n} max=${c.maxDistance} => ${got} ${ok ? "OK" : "FAIL exp=" + c.expected}`,
      );
    }
  }
}

const s134 = new Solution();
s134.runTests();

export {};
