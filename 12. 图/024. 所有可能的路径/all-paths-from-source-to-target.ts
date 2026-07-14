// ============================================================
// 024. 所有可能的路径
// ============================================================
// LeetCode 797. All Paths From Source to Target
// 给定有向无环图（DAG）邻接表 graph，节点编号 0..n-1。返回从 0 到 n-1 的所有路径。
// 时间复杂度：O(2^n * n)（最坏情况路径数指数级），空间复杂度：O(n) 递归栈

// 方法1：DFS 回溯（推荐）
// 思路：从 0 出发深度优先搜索，到达 n-1 时记录路径，回溯时弹出当前节点。
function allPathsSourceTargetDFS(graph: number[][]): number[][] {
  const n = graph.length;
  const result: number[][] = [];
  const path: number[] = [0];

  function dfs(u: number): void {
    if (u === n - 1) {
      result.push([...path]);
      return;
    }
    for (const v of graph[u]) {
      path.push(v);
      dfs(v);
      path.pop();
    }
  }

  dfs(0);
  return result;
}

// 方法2：BFS
// 思路：队列中保存当前路径，扩展到邻居时复制路径并追加。
// 到达 n-1 时把该路径加入结果。
function allPathsSourceTargetBFS(graph: number[][]): number[][] {
  const n = graph.length;
  const result: number[][] = [];
  const queue: number[][] = [[0]];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const u = path[path.length - 1];
    if (u === n - 1) {
      result.push(path);
      continue;
    }
    for (const v of graph[u]) {
      queue.push([...path, v]);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 024. 所有可能的路径 =====");

console.log(allPathsSourceTargetDFS([[1, 2], [3], [3], []])); // 期望: [[0,1,3],[0,2,3]]
console.log(allPathsSourceTargetDFS([[4, 3, 1], [3, 2, 4], [3], [4], []])); // 期望: [[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]

console.log(allPathsSourceTargetBFS([[1, 2], [3], [3], []])); // 期望: [[0,1,3],[0,2,3]]
console.log(allPathsSourceTargetBFS([[4, 3, 1], [3, 2, 4], [3], [4], []])); // 期望: [[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]

export {};
