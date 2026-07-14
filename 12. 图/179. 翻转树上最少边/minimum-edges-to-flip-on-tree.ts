// 179. 翻转树上最少边
// 自定义题：n 节点有向树，使从根到所有叶子的方向一致（全部由根指向叶子），
// 求最少需要翻转的边数。
// 思路：DFS 贪心，统计方向与"背离根"不一致的边。

type DirectedTreeEdge = [number, number]; // from -> to

function buildTreeAdj(n: number, edges: DirectedTreeEdge[]): Array<Array<[number, number]>> {
  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push([v, 1]); // u -> v
    adj[v].push([u, 0]); // 对 v 而言指向 v
  }
  return adj;
}

function minimumEdgesToFlipOnTree(n: number, edges: DirectedTreeEdge[], root: number): number {
  if (n <= 1) return 0;
  const adj = buildTreeAdj(n, edges);
  const visited = new Array(n).fill(false);
  visited[root] = true;
  const stack: number[] = [root];
  let flips = 0;
  while (stack.length) {
    const u = stack.pop()!;
    for (const [v, isOutgoing] of adj[u]) {
      if (!visited[v]) {
        visited[v] = true;
        // 父 u 到子 v：isOutgoing=1 表示 u->v（背离根，正确）；0 表示需翻转
        if (isOutgoing === 0) flips++;
        stack.push(v);
      }
    }
  }
  return flips;
}

// 测试
console.log(
  minimumEdgesToFlipOnTree(
    4,
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    0,
  ),
); // 期望 0
console.log(
  minimumEdgesToFlipOnTree(
    4,
    [
      [1, 0],
      [1, 2],
      [3, 2],
    ],
    1,
  ),
); // 期望 1
console.log(minimumEdgesToFlipOnTree(1, [], 0)); // 期望 0

export {};
