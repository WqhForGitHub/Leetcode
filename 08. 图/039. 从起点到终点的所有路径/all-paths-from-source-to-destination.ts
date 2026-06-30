// ============================================================
// 039. 从起点到终点的所有路径
// ============================================================
// 通用题（类似 LeetCode 797. All Paths From Source to Target）
// 给定 n 个节点、有向边列表 edges，以及起点 start、终点 end。
// 返回所有从 start 到 end 的路径。图按 DAG 处理。
// 时间复杂度：O(路径总数 * 路径长度)，空间复杂度：O(路径总数 * 路径长度)

function buildAdj(n: number, edges: number[][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  return adj;
}

// 方法1：DFS 回溯（推荐）
// 思路：从 start 出发深搜，沿途记录路径，到达 end 时把路径副本加入结果。
function allPathsDFS(n: number, edges: number[][], start: number, end: number): number[][] {
  const adj = buildAdj(n, edges);
  const result: number[][] = [];
  const path: number[] = [start];

  function dfs(u: number): void {
    if (u === end) {
      result.push([...path]);
      return;
    }
    for (const v of adj[u]) {
      path.push(v);
      dfs(v);
      path.pop();
    }
  }
  dfs(start);
  return result;
}

// 方法2：BFS 路径扩展
// 思路：队列中维护完整路径，取出末尾节点扩展；末尾为 end 时记录。
function allPathsBFS(n: number, edges: number[][], start: number, end: number): number[][] {
  const adj = buildAdj(n, edges);
  const result: number[][] = [];
  const queue: number[][] = [[start]];
  while (queue.length > 0) {
    const path = queue.shift()!;
    const u = path[path.length - 1];
    if (u === end) {
      result.push(path);
      continue;
    }
    for (const v of adj[u]) {
      queue.push([...path, v]);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 039. 从起点到终点的所有路径 =====");
console.log("DFS:", allPathsDFS(4, [[0, 1], [0, 2], [1, 3], [2, 3]], 0, 3));
// 期望 [[0,1,3],[0,2,3]]
console.log("DFS:", allPathsDFS(5, [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [1, 4]], 0, 4));
// 期望 [[0,1,3,4],[0,1,4],[0,2,3,4]]
console.log("BFS:", allPathsBFS(4, [[0, 1], [0, 2], [1, 3], [2, 3]], 0, 3));
// 期望 [[0,1,3],[0,2,3]]
console.log("BFS:", allPathsBFS(5, [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [1, 4]], 0, 4));
// 期望 [[0,1,3,4],[0,1,4],[0,2,3,4]]

export {};
