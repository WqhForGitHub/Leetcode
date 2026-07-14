// 180. 统计每个顶点的度
// 自定义题：n 节点无向图，返回每个顶点的度数（自环贡献 2）。
// 思路：直接遍历边，对两端点累加度数。

type UndirectedEdge = [number, number];

function countDegreeOfEachVertex(n: number, edges: UndirectedEdge[]): number[] {
  const degree = new Array(n).fill(0);
  for (const [u, v] of edges) {
    degree[u]++;
    if (u === v) {
      degree[u]++; // 自环贡献 2
    } else {
      degree[v]++;
    }
  }
  return degree;
}

function maxDegree(n: number, edges: UndirectedEdge[]): number {
  const deg = countDegreeOfEachVertex(n, edges);
  return deg.length ? Math.max(...deg) : 0;
}

// 测试
console.log(
  countDegreeOfEachVertex(4, [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 3],
  ]),
); // 期望 [2, 2, 2, 2]
console.log(
  countDegreeOfEachVertex(2, [
    [0, 0],
    [0, 1],
  ]),
); // 期望 [3, 1]
console.log(
  maxDegree(4, [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 3],
  ]),
); // 期望 2

export {};
