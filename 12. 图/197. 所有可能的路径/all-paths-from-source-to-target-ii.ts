// ============================================================
// 197. 所有可能的路径
// ============================================================
// LeetCode 797. All Paths From Source to Target
// 注意：本题与 024. 所有可能的路径 重复（重复题），此处为再次实现。
// 给定 DAG 邻接表 graph，返回从 0 到 n-1 的所有路径。
// 思路：DFS 回溯 / BFS 路径扩展。
// 时间复杂度：最坏 O(2^V · V)，空间复杂度：O(V) 递归栈

// 方法1：DFS 回溯（推荐）
function allPathsSourceTargetDFS(graph: number[][]): number[][] {
  const n = graph.length;
  const res: number[][] = [];
  const path: number[] = [0];

  function dfs(u: number): void {
    if (u === n - 1) {
      res.push([...path]);
      return;
    }
    for (const v of graph[u]) {
      path.push(v);
      dfs(v);
      path.pop();
    }
  }
  dfs(0);
  return res;
}

// 方法2：BFS 路径扩展
// 思路：队列中保存当前路径，到达 n-1 即加入答案。
function allPathsSourceTargetBFS(graph: number[][]): number[][] {
  const n = graph.length;
  const res: number[][] = [];
  const queue: number[][] = [[0]];
  while (queue.length > 0) {
    const path = queue.shift()!;
    const u = path[path.length - 1];
    if (u === n - 1) {
      res.push(path);
      continue;
    }
    for (const v of graph[u]) {
      queue.push([...path, v]);
    }
  }
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 197. 所有可能的路径（与 024 重复）=====");

console.log(allPathsSourceTargetDFS([[1, 2], [3], [3], []]));
// 期望: [[0,1,3],[0,2,3]]

console.log(allPathsSourceTargetDFS([[4, 3, 1], [3, 2, 4], [3], [4], []]));
// 期望: [[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]

console.log(allPathsSourceTargetBFS([[1, 2], [3], [3], []]));
// 期望: [[0,1,3],[0,2,3]]

console.log(allPathsSourceTargetBFS([[4, 3, 1], [3, 2, 4], [3], [4], []]));
// 期望: [[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]

export {};
