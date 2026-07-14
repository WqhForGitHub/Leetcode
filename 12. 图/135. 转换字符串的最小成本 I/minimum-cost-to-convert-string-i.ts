// 135. 转换字符串的最小成本 I
// LC2976. Minimum Cost to Convert String I
// 给定 original/changed/cost 数组表示单个字符之间的有向转换及成本，
// 求把字符串 source 转换为 target 的最小总成本，不可行返回 -1。
// 字符只有小写字母。Floyd(26 字符)。
//
// 思路：
// 1. 建立 26x26 的距离矩阵，初始化为 Infinity，对角线为 0。
// 2. 对每条转换规则取最小成本更新邻接矩阵。
// 3. 跑 Floyd 求所有字符对之间最小转换成本。
// 4. 逐字符累加 source[i] -> target[i] 的最小成本，遇到 Infinity 返回 -1。

class Solution {
  minimumCost(
    source: string,
    target: string,
    original: string[],
    changed: string[],
    cost: number[],
  ): number {
    const INF = Infinity;
    const dist: number[][] = Array.from({ length: 26 }, () => new Array(26).fill(INF));
    for (let i = 0; i < 26; i++) {
      dist[i][i] = 0;
    }
    for (let i = 0; i < original.length; i++) {
      const u = original[i].charCodeAt(0) - 97;
      const v = changed[i].charCodeAt(0) - 97;
      if (cost[i] < dist[u][v]) {
        dist[u][v] = cost[i];
      }
    }

    // Floyd
    for (let k = 0; k < 26; k++) {
      for (let i = 0; i < 26; i++) {
        if (dist[i][k] === INF) {
          continue;
        }
        for (let j = 0; j < 26; j++) {
          if (dist[k][j] === INF) {
            continue;
          }
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }

    let total = 0;
    for (let i = 0; i < source.length; i++) {
      const u = source.charCodeAt(i) - 97;
      const v = target.charCodeAt(i) - 97;
      if (dist[u][v] === INF) {
        return -1;
      }
      total += dist[u][v];
    }
    return total;
  }

  runTests(): void {
    const cases: {
      source: string;
      target: string;
      original: string[];
      changed: string[];
      cost: number[];
      expected: number;
    }[] = [
      {
        source: "abcd",
        target: "acbe",
        original: ["a", "b", "c", "c", "e", "d"],
        changed: ["b", "c", "b", "e", "b", "e"],
        cost: [2, 5, 5, 1, 2, 20],
        expected: 28,
      },
      {
        source: "aaaa",
        target: "bbbb",
        original: ["a", "c"],
        changed: ["c", "b"],
        cost: [1, 2],
        expected: 12,
      },
      {
        source: "abcd",
        target: "abce",
        original: ["a"],
        changed: ["e"],
        cost: [10000],
        expected: -1,
      },
    ];
    for (const c of cases) {
      const got = this.minimumCost(c.source, c.target, c.original, c.changed, c.cost);
      const ok = got === c.expected;
      console.log(
        `source=${c.source} target=${c.target} => ${got} ${ok ? "OK" : "FAIL exp=" + c.expected}`,
      );
    }
  }
}

const s135 = new Solution();
s135.runTests();

export {};
