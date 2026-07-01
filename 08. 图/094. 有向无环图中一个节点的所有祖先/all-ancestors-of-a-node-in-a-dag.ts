// ============================================================
// 094. 有向无环图中一个节点的所有祖先
// ============================================================
// LeetCode 2192. All Ancestors of a Node in a Directed Acyclic Graph
// n 节点 DAG，edges 有向。返回每个节点的所有祖先（升序）。
// 时间复杂度：O(n + E * n)（祖先集合传递），空间复杂度：O(n^2)

// 方法1：拓扑排序 + 祖先集合传递（推荐）
function getAncestors(n: number, edges: number[][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  const indeg = new Array<number>(n).fill(0);
  for (const [u, v] of edges) {
    adj[u].push(v);
    indeg[v]++;
  }
  const ancestors: Set<number>[] = Array.from({ length: n }, () => new Set<number>());

  const queue: number[] = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of adj[u]) {
      // v 的祖先 += u 的所有祖先 + u 本身
      for (const a of ancestors[u]) ancestors[v].add(a);
      ancestors[v].add(u);
      if (--indeg[v] === 0) queue.push(v);
    }
  }
  return ancestors.map((s) => Array.from(s).sort((a, b) => a - b));
}

// 方法2：DFS 记忆化（反向图，从每个节点出发可达的所有节点 = 该节点是它们的祖先）
function getAncestorsDFS(n: number, edges: number[][]): number[][] {
  const reverseAdj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) reverseAdj[v].push(u); // 反向：v -> u
  const result: number[][] = [];
  for (let i = 0; i < n; i++) {
    const visited = new Set<number>();
    const dfs = (node: number) => {
      for (const prev of reverseAdj[node]) {
        if (visited.has(prev)) continue;
        visited.add(prev);
        dfs(prev);
      }
    };
    dfs(i);
    result.push(Array.from(visited).sort((a, b) => a - b));
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 094. 有向无环图中一个节点的所有祖先 =====");
console.log(
  getAncestors(8, [
    [0, 3],
    [0, 4],
    [1, 3],
    [2, 4],
    [2, 7],
    [3, 5],
    [3, 6],
    [3, 7],
    [4, 6],
  ]),
);
// 期望: [[],[],[],[0,1],[0,2],[0,1,3],[0,1,2,3,4],[0,1,2,3]]

console.log(
  getAncestors(5, [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
  ]),
);
// 期望: [[],[0],[0,1],[0,1,2],[0,1,2,3]]

console.log(
  getAncestorsDFS(8, [
    [0, 3],
    [0, 4],
    [1, 3],
    [2, 4],
    [2, 7],
    [3, 5],
    [3, 6],
    [3, 7],
    [4, 6],
  ]),
);
// 期望: [[],[],[],[0,1],[0,2],[0,1,3],[0,1,2,3,4],[0,1,2,3]]

export {};
