// ============================================================
// 051. 所有可能的路径
// ============================================================
// LeetCode 797. All Paths From Source to Target
// 给定有向无环图的邻接表 graph，返回从节点 0 到节点 n-1 的所有路径。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：DFS回溯 (推荐)
// 从节点0开始深度优先搜索，访问到节点n-1时把当前路径加入结果。
// 时间复杂度 O(2^n * n), 空间复杂度 O(n) 递归栈
function allPathsSourceTarget(graph: number[][]): number[][] {
  const n = graph.length;
  const result: number[][] = [];
  const path: number[] = [0];

  const backtrack = (node: number): void => {
    if (node === n - 1) {
      result.push([...path]);
      return;
    }
    for (const next of graph[node]) {
      path.push(next);
      backtrack(next);
      path.pop();
    }
  };

  backtrack(0);
  return result;
}

// 方法2：BFS
// 用队列保存当前路径，当到达终点时加入结果。
// 时间复杂度 O(2^n * n), 空间复杂度 O(2^n * n)
function allPathsSourceTargetBFS(graph: number[][]): number[][] {
  const n = graph.length;
  const result: number[][] = [];
  const queue: number[][] = [[0]];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];
    if (node === n - 1) {
      result.push(path);
      continue;
    }
    for (const next of graph[node]) {
      queue.push([...path, next]);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 051. 所有可能的路径 =====");
console.log(allPathsSourceTarget([[1, 2], [3], [3], []])); // 期望结果: [[0,1,3],[0,2,3]]
console.log(allPathsSourceTargetBFS([[1, 2], [3], [3], []])); // 期望结果: [[0,1,3],[0,2,3]]

export {};
