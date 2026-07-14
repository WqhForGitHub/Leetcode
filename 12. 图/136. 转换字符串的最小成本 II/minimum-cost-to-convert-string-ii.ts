// 136. 转换字符串的最小成本 II
// LC2977. Minimum Cost to Convert String II
// 与 I 类似，但 original/changed 是子串（长度可 > 1，且可不等长）。
// 把 source 转换为 target 的最小总成本，不可行返回 -1。
// Floyd 子串节点 + 字符串 DP。
//
// 思路：
// 1. 收集 original/changed 中所有不同子串作为图节点，建邻接矩阵（取最小成本）。
// 2. Floyd 求任意两子串节点之间的最小转换成本（支持链式 A->B->C）。
// 3. 二维字符串 DP：f[i][j] 表示把 source 前 i 个字符转换为 target 前 j 个字符的最小成本。
//    - 单字符不变（source[i-1]==target[j-1]）：f[i][j] = min(f[i][j], f[i-1][j-1])。
//    - 末尾子串节点转换：若 source 末尾 |A| 长等于节点 A，target 末尾 |B| 长等于节点 B，
//      则 f[i][j] = min(f[i][j], f[i-|A|][j-|B|] + floyd[A][B])。
// 4. 答案 f[n][n]，仍为 Infinity 则返回 -1。

class Solution {
  minimumCost(
    source: string,
    target: string,
    original: string[],
    changed: string[],
    cost: number[],
  ): number {
    const n = source.length;
    const INF = Infinity;

    // 收集所有不同子串节点
    const nodeMap = new Map<string, number>();
    const addNode = (s: string): void => {
      if (!nodeMap.has(s)) {
        nodeMap.set(s, nodeMap.size);
      }
    };
    for (const s of original) {
      addNode(s);
    }
    for (const s of changed) {
      addNode(s);
    }

    const m = nodeMap.size;
    const dist: number[][] = Array.from({ length: m }, () => new Array(m).fill(INF));
    for (let i = 0; i < m; i++) {
      dist[i][i] = 0;
    }
    for (let i = 0; i < original.length; i++) {
      const u = nodeMap.get(original[i])!;
      const v = nodeMap.get(changed[i])!;
      if (cost[i] < dist[u][v]) {
        dist[u][v] = cost[i];
      }
    }

    // Floyd
    for (let k = 0; k < m; k++) {
      for (let i = 0; i < m; i++) {
        if (dist[i][k] === INF) {
          continue;
        }
        for (let j = 0; j < m; j++) {
          if (dist[k][j] === INF) {
            continue;
          }
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }

    // 收集不同节点长度
    const lengthSet = new Set<number>();
    for (const s of nodeMap.keys()) {
      lengthSet.add(s.length);
    }
    const lengths = Array.from(lengthSet).sort((a, b) => a - b);

    // 预处理 match[i]：以位置 i 结尾、长度为 L 的子串若是节点则记录 [节点索引, 长度]
    const buildMatch = (str: string): number[][][] => {
      const store: number[][][] = Array.from({ length: str.length + 1 }, () => []);
      for (let i = 1; i <= str.length; i++) {
        for (const L of lengths) {
          if (L > i) {
            break;
          }
          const sub = str.substring(i - L, i);
          if (nodeMap.has(sub)) {
            store[i].push([nodeMap.get(sub)!, L]);
          }
        }
      }
      return store;
    };
    const matchS = buildMatch(source);
    const matchT = buildMatch(target);

    // 二维 DP
    const f: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(INF));
    f[0][0] = 0;
    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= n; j++) {
        let best = f[i][j];
        // 单字符不变
        if (i >= 1 && j >= 1 && source[i - 1] === target[j - 1]) {
          if (f[i - 1][j - 1] < best) {
            best = f[i - 1][j - 1];
          }
        }
        // 末尾子串节点转换
        for (const [a, la] of matchS[i]) {
          for (const [b, lb] of matchT[j]) {
            const prev = f[i - la][j - lb];
            if (prev === INF || dist[a][b] === INF) {
              continue;
            }
            if (prev + dist[a][b] < best) {
              best = prev + dist[a][b];
            }
          }
        }
        f[i][j] = best;
      }
    }

    return f[n][n] === INF ? -1 : f[n][n];
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
        // 单字符转换
        source: "abcd",
        target: "acbe",
        original: ["a", "b", "c", "c", "e", "d"],
        changed: ["b", "c", "b", "e", "b", "e"],
        cost: [2, 5, 5, 1, 2, 20],
        expected: 28,
      },
      {
        // 子串转换，长度不等
        source: "abcdefgh",
        target: "acdeeghh",
        original: ["bcd", "defgh", "abcd"],
        changed: ["cde", "ee", "b"],
        cost: [1, 1, 1],
        expected: 3,
      },
      {
        source: "aaaa",
        target: "aaaa",
        original: ["a"],
        changed: ["b"],
        cost: [1],
        expected: 0,
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

const s136 = new Solution();
s136.runTests();

export {};
