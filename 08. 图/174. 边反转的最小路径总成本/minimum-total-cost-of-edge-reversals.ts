// 174. 边反转的最小路径总成本
// 自定义题：n 节点有向树，对每个节点作为根，求需反转的最少边数使所有边朝向根。
// 思路：换根 DP。先以 0 为根统计需反转边数，再向子节点转移。

type DirectedEdge = [number, number]; // from -> to

function edgeReversalCosts(n: number, edges: DirectedEdge[]): number[] {
  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push([v, 1]); // u -> v：从 u 出发
    adj[v].push([u, 0]); // 对 v 而言该边指向 v
  }
  const parent = new Array(n).fill(-1);
  const parentDir = new Array(n).fill(0); // 父到子方向：1 表示 parent->child（背离根 0）
  const order: number[] = [];
  const visited = new Array(n).fill(false);
  visited[0] = true;
  const stack = [0];
  while (stack.length) {
    const u = stack.pop()!;
    order.push(u);
    for (const [v, isOut] of adj[u]) {
      if (!visited[v]) {
        visited[v] = true;
        parent[v] = u;
        parentDir[v] = isOut;
        stack.push(v);
      }
    }
  }
  const ans = new Array(n).fill(0);
  for (let i = 1; i < n; i++) ans[0] += parentDir[i];
  for (const c of order) {
    if (c === 0) continue;
    const dir = parentDir[c];
    ans[c] = ans[parent[c]] + 1 - 2 * dir;
  }
  return ans;
}

function minimumTotalCostOfEdgeReversals(n: number, edges: DirectedEdge[]): number {
  const costs = edgeReversalCosts(n, edges);
  return costs.length ? Math.min(...costs) : 0;
}

// 测试
console.log(
  edgeReversalCosts(4, [
    [0, 1],
    [1, 2],
    [2, 3],
  ]),
); // 期望 [3, 2, 1, 0]
console.log(
  minimumTotalCostOfEdgeReversals(4, [
    [0, 1],
    [1, 2],
    [2, 3],
  ]),
); // 期望 0
console.log(
  edgeReversalCosts(3, [
    [0, 1],
    [2, 1],
  ]),
); // 期望 [1, 0, 1]
console.log(
  minimumTotalCostOfEdgeReversals(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ]),
); // 期望 0

export {};
