// 133. 找到冠军 II
// LC2923 / LC2924. Find Champion
// n 支队伍，edges[a,b] 表示 a 强于 b。冠军 = 没有任何队伍强于他（入度为 0）。
// 若恰好存在一个入度为 0 的节点则返回其编号，否则返回 -1。入度统计。
//
// 思路：
// 1. 统计每个节点的入度（被多少人强于）。
// 2. 入度为 0 的节点就是冠军候选。
// 3. 候选唯一则返回，否则返回 -1。

class Solution {
  findChampion(n: number, edges: number[][]): number {
    const indeg: number[] = new Array(n).fill(0);
    for (const [a, b] of edges) {
      indeg[b] += 1;
    }
    let champion = -1;
    for (let i = 0; i < n; i++) {
      if (indeg[i] === 0) {
        if (champion !== -1) {
          return -1; // 多个候选，无法确定唯一冠军
        }
        champion = i;
      }
    }
    return champion;
  }

  runTests(): void {
    const cases: { n: number; edges: number[][]; expected: number }[] = [
      {
        n: 3,
        edges: [
          [0, 1],
          [1, 2],
        ],
        expected: 0,
      },
      {
        n: 4,
        edges: [
          [0, 2],
          [1, 3],
          [1, 2],
        ],
        expected: -1,
      },
      { n: 2, edges: [], expected: -1 },
      { n: 1, edges: [], expected: 0 },
    ];
    for (const c of cases) {
      const got = this.findChampion(c.n, c.edges);
      const ok = got === c.expected;
      console.log(
        `n=${c.n} edges=${JSON.stringify(c.edges)} => ${got} ${ok ? "OK" : "FAIL exp=" + c.expected}`,
      );
    }
  }
}

const s133 = new Solution();
s133.runTests();

export {};
