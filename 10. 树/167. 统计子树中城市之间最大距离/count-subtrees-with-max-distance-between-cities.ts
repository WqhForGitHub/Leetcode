// ============================================================
// 167. 统计子树中城市之间最大距离
// ============================================================
// LeetCode 1617. Count Subtrees With Max Distance Between Cities
// 给定 n 个城市和它们之间的连接关系（无向树），统计最大距离分别等于 1 到 n-1 的子树数量。
// 时间复杂度：O(n^3 * 2^n)，空间复杂度：O(2^n)

// 方法1：枚举子集+BFS/DFS求直径（推荐）
// 枚举所有非空子集，对于每个子集：
// 1. 检查子集是否构成连通子树
// 2. 若连通，求该子树的直径（最大距离）
// 3. 按直径统计结果
function countSubgraphsForEachDiameter(n: number, edges: number[][]): number[] {
  // 建立邻接表（城市编号 1..n）
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // 结果数组 ans[d] 表示直径为 d 的子树数量（下标 0 不用）
  const ans: number[] = new Array(n).fill(0);

  // 枚举所有非空子集（用位掩码表示，1..n 城市对应 bit0..bit(n-1)）
  for (let mask = 1; mask < 1 << n; mask++) {
    // 统计子集大小
    const cities: number[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) cities.push(i + 1);
    }
    // 单节点子树直径为 0，不计入
    if (cities.length < 2) continue;

    // 检查子集是否构成连通子树，并求直径
    const diameter = getDiameter(cities, adj);
    if (diameter > 0) {
      ans[diameter]++;
    }
  }

  return ans.slice(1); // 返回 ans[1..n-1]

  // 求子集 cities 的直径，若不连通返回 0
  function getDiameter(cities: number[], adj: number[][]): number {
    const citySet = new Set(cities);
    // BFS 求从任意节点出发的最远节点及距离
    const { farthest: start, dist: _ } = bfs(cities[0], citySet, adj);
    // 若不连通，返回 0
    if (start === -1) return 0;
    const { dist: diameter } = bfs(start, citySet, adj);
    return diameter;
  }

  // BFS 从 start 出发，只能在 citySet 内移动
  // 返回最远节点编号和距离；若无法访问所有 citySet 节点，返回 farthest = -1
  function bfs(
    start: number,
    citySet: Set<number>,
    adj: number[][],
  ): { farthest: number; dist: number } {
    const visited = new Set<number>([start]);
    const queue: number[] = [start];
    let dist = 0;
    let farthest = start;
    while (queue.length > 0) {
      const size = queue.length;
      for (let i = 0; i < size; i++) {
        const node = queue.shift()!;
        farthest = node;
        for (const next of adj[node]) {
          if (citySet.has(next) && !visited.has(next)) {
            visited.add(next);
            queue.push(next);
          }
        }
      }
      if (queue.length > 0) dist++;
    }
    // 检查是否访问了 citySet 的所有节点
    if (visited.size !== citySet.size) {
      return { farthest: -1, dist: 0 };
    }
    return { farthest, dist };
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 167. 统计子树中城市之间最大距离 =====");

// 测试1: n = 4, edges = [[1,2],[2,3],[2,4]]
// 树结构:
//      2
//    / | \
//   1  3  4
// 直径为 1 的子树: {1,2},{2,3},{2,4} 共3个
// 直径为 2 的子树: {1,2,3},{1,2,4},{3,2,4} 共3个
// 直径为 3 的子树: {1,2,3,4} 共1个
console.log(
  "测试1:",
  countSubgraphsForEachDiameter(4, [
    [1, 2],
    [2, 3],
    [2, 4],
  ]),
);
// 期望 [3,3,1]

// 测试2: n = 2, edges = [[1,2]]
console.log("测试2:", countSubgraphsForEachDiameter(2, [[1, 2]]));
// 期望 [1]

// 测试3: n = 3, edges = [[1,2],[2,3]]
// 直径为 1: {1,2},{2,3} 共2个
// 直径为 2: {1,2,3} 共1个
console.log(
  "测试3:",
  countSubgraphsForEachDiameter(3, [
    [1, 2],
    [2, 3],
  ]),
);
// 期望 [2,1]

export {};
