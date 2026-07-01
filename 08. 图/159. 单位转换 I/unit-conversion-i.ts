// ============================================================
// 159. 单位转换 I
// ============================================================
// 自定义题：n 单位 conversions = [source, target, ratio]（构成树），
// queries 求转换比。DFS / BFS 求比值（树结构）。
// 时间复杂度：O(n + q)，空间复杂度：O(n)。

interface Conversion {
  source: number;
  target: number;
  ratio: number;
}

// 方法1：DFS 求比值
// 以节点 0 为根（ratio=1），DFS 求每个节点相对根的比值。
function unitConversionDFS(n: number, conversions: Conversion[], queries: number[][]): number[] {
  const adj: Array<Array<{ to: number; r: number }>> = Array.from({ length: n }, () => []);
  for (const c of conversions) {
    adj[c.source].push({ to: c.target, r: c.ratio });
    adj[c.target].push({ to: c.source, r: 1 / c.ratio });
  }
  const ratioToRoot = new Array(n).fill(1);
  const visited = new Array(n).fill(false);
  const dfs = (u: number, val: number): void => {
    visited[u] = true;
    ratioToRoot[u] = val;
    for (const e of adj[u]) {
      if (!visited[e.to]) dfs(e.to, val * e.r);
    }
  };
  dfs(0, 1);
  return queries.map(([s, t]) => ratioToRoot[t] / ratioToRoot[s]);
}

// 方法2：BFS 求比值
// 从节点 0 出发 BFS，记录每个节点相对根的比值，再回答查询。
function unitConversionBFS(n: number, conversions: Conversion[], queries: number[][]): number[] {
  const adj: Array<Array<{ to: number; r: number }>> = Array.from({ length: n }, () => []);
  for (const c of conversions) {
    adj[c.source].push({ to: c.target, r: c.ratio });
    adj[c.target].push({ to: c.source, r: 1 / c.ratio });
  }
  const ratioToRoot = new Array(n).fill(1);
  const visited = new Array(n).fill(false);
  visited[0] = true;
  const queue: number[] = [0];
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const e of adj[u]) {
      if (!visited[e.to]) {
        visited[e.to] = true;
        ratioToRoot[e.to] = ratioToRoot[u] * e.r;
        queue.push(e.to);
      }
    }
  }
  return queries.map(([s, t]) => ratioToRoot[t] / ratioToRoot[s]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 159. 单位转换 I =====");
console.log(
  "DFS:",
  unitConversionDFS(
    3,
    [
      { source: 0, target: 1, ratio: 2 },
      { source: 1, target: 2, ratio: 3 },
    ],
    [
      [2, 0],
      [0, 2],
      [1, 2],
    ],
  ), // 期望 [1/6, 6, 3]
);
console.log(
  "BFS:",
  unitConversionBFS(
    3,
    [
      { source: 0, target: 1, ratio: 2 },
      { source: 1, target: 2, ratio: 3 },
    ],
    [
      [2, 0],
      [0, 2],
      [1, 2],
    ],
  ), // 期望 [1/6, 6, 3]
);
console.log(
  "DFS:",
  unitConversionDFS(
    2,
    [{ source: 0, target: 1, ratio: 5 }],
    [
      [0, 1],
      [1, 0],
    ],
  ), // 期望 [5, 0.2]
);
console.log(
  "BFS:",
  unitConversionBFS(
    2,
    [{ source: 0, target: 1, ratio: 5 }],
    [
      [0, 1],
      [1, 0],
    ],
  ), // 期望 [5, 0.2]
);
console.log(
  "DFS:",
  unitConversionDFS(1, [], [[0, 0]]), // 期望 [1]
);
console.log(
  "BFS:",
  unitConversionBFS(1, [], [[0, 0]]), // 期望 [1]
);

export {};
