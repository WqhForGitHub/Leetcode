// ============================================================
// 061. 可以到达所有点的最少点数目
// ============================================================
// LeetCode 1557. Minimum Number of Vertices to Reach All Nodes
// 给定 n 个节点的有向无环图，edges 为有向边。求最小点集合，使从这些点出发能到达所有节点。
// 时间复杂度：O(n + e)，空间复杂度：O(n)

// ============================================================
// 方法1：统计入度为 0 的节点（推荐）
// ============================================================
function findSmallestSetOfVertices1(n: number, edges: number[][]): number[] {
  // 入度为 0 的节点必须作为起点，且这些节点足以到达所有节点
  const inDegree = new Array<number>(n).fill(0);
  for (const [, to] of edges) {
    inDegree[to]++;
  }
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) {
      result.push(i);
    }
  }
  return result;
}

// ============================================================
// 方法2：集合差集（标记有入边的节点）
// ============================================================
function findSmallestSetOfVertices2(n: number, edges: number[][]): number[] {
  // 所有有入边的节点不可能作为必须的起点（可由其他点到达）
  const hasIncoming = new Set<number>();
  for (const [, to] of edges) {
    hasIncoming.add(to);
  }
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    if (!hasIncoming.has(i)) {
      result.push(i);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 061. 可以到达所有点的最少点数目 =====");
console.log(
  findSmallestSetOfVertices1(6, [
    [0, 1],
    [0, 2],
    [2, 5],
    [3, 4],
    [4, 2],
  ]),
);
// 期望: [0, 3]
console.log(
  findSmallestSetOfVertices1(5, [
    [0, 1],
    [2, 1],
    [3, 1],
    [1, 4],
    [2, 4],
  ]),
);
// 期望: [0, 2, 3]
console.log(
  findSmallestSetOfVertices2(6, [
    [0, 1],
    [0, 2],
    [2, 5],
    [3, 4],
    [4, 2],
  ]),
);
// 期望: [0, 3]

export {};
