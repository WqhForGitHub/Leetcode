// ============================================================
// 073. 找出星型图的中心节点
// ============================================================
// LeetCode 1791. Find Center of Star Graph
// 给定一个星型图（中心节点与所有其他 n-1 个节点直接相连），edges 长度为 n-1。
// 返回中心节点编号。
// 时间复杂度：O(1)，空间复杂度：O(1)

// 方法1：前两条边的公共节点（推荐）
function findCenter(edges: number[][]): number {
  const [a, b] = edges[0];
  const [c, d] = edges[1];
  if (a === c || a === d) return a;
  return b;
}

// 方法2：度数统计
function findCenterByDegree(edges: number[][]): number {
  const deg = new Map<number, number>();
  for (const [u, v] of edges) {
    deg.set(u, (deg.get(u) ?? 0) + 1);
    deg.set(v, (deg.get(v) ?? 0) + 1);
  }
  for (const [node, d] of deg) {
    if (d === edges.length) return node;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 073. 找出星型图的中心节点 =====");
console.log(
  findCenter([
    [1, 2],
    [2, 3],
  ]),
); // 期望 2
console.log(
  findCenter([
    [4, 1],
    [4, 2],
    [4, 3],
  ]),
); // 期望 4
console.log(
  findCenterByDegree([
    [1, 2],
    [2, 3],
  ]),
); // 期望 2

export {};
