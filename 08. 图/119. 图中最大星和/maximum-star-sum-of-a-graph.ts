// 119. 图中最大星和 (LC2497)
// n 节点，节点 i 权值 vals[i]。无向边 edges[i] = [a, b]，可视为 a 与 b 之间
// 有一条有向边 a→b（星形：中心 + 邻居）。
// 「星和」= 中心节点权值 + 最多 k 条邻接边对应邻居的权值之和。
// 每条无向边在两个方向各算一次。求所有节点作为中心的最大星和。
// 思路：为每个节点收集所有邻居权值，降序排序后取前 k 个正值累加，
//       加上中心节点自身权值，求所有节点最大值。贪心保留最大 k 条正值边。

type Edge = [number, number];

class MaxStarSumSolution {
  /**
   * 主入口：返回最大星和
   */
  maxStarSum(vals: number[], edges: number[][], k: number): number {
    const n = vals.length;
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const e of edges) {
      // 无向边在两个方向各算一次
      adj[e[0]].push(vals[e[1]]);
      adj[e[1]].push(vals[e[0]]);
    }
    let ans = -Infinity;
    for (let i = 0; i < n; i++) {
      // 降序排序，贪心取前 k 个正值
      adj[i].sort((a, b) => b - a);
      let sum = vals[i];
      for (let j = 0; j < Math.min(k, adj[i].length); j++) {
        if (adj[i][j] > 0) {
          sum += adj[i][j];
        } else {
          break;
        }
      }
      ans = Math.max(ans, sum);
    }
    return ans;
  }
}

// 测试
(function test(): void {
  const sol = new MaxStarSumSolution();
  const r1 = sol.maxStarSum(
    [1, 2, 3, 4, 10, -10, -20],
    [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
      [3, 5],
      [3, 6],
    ],
    2,
  );
  console.log("Test1:", r1 === 16 ? "PASS" : "FAIL", r1);
  const r2 = sol.maxStarSum([-5], [], 1);
  console.log("Test2:", r2 === -5 ? "PASS" : "FAIL", r2);
  const r3 = sol.maxStarSum(
    [1, -8, 0],
    [
      [1, 0],
      [1, 2],
    ],
    2,
  );
  console.log("Test3:", r3 === 1 ? "PASS" : "FAIL", r3);
})();

export {};
