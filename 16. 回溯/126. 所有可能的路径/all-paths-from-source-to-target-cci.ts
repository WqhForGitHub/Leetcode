// ============================================================
// 126. 所有可能的路径
// ============================================================
// 面试金典 08.12 / LeetCode 797. All Paths From Source to Target
// 给定 DAG（用邻接表表示），返回从节点 0 到节点 n-1 的所有路径。

// 时间复杂度：O(2^n * n) 最坏（完全图）
// 空间复杂度：O(n) 递归栈

// 方法1：DFS 回溯
// 从节点 0 出发 DFS，到达 n-1 时收集路径，回溯时弹出当前节点。
// 时间复杂度 O(2^n * n), 空间复杂度 O(n)
function allPathsSourceTarget(graph: number[][]): number[][] {
  const n: number = graph.length;
  const result: number[][] = [];
  const path: number[] = [0];

  function backtrack(node: number): void {
    if (node === n - 1) {
      result.push([...path]);
      return;
    }
    for (const next of graph[node]) {
      path.push(next);
      backtrack(next);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}

// 方法2：BFS
// 用队列维护当前路径，到达终点时收集。DAG 无环，无需访问标记。
// 时间复杂度 O(2^n * n), 空间复杂度 O(2^n * n)
function allPathsSourceTarget2(graph: number[][]): number[][] {
  const n: number = graph.length;
  const result: number[][] = [];
  // 队列中元素为完整路径
  const queue: number[][] = [[0]];

  while (queue.length > 0) {
    const path: number[] = queue.shift()!;
    const node: number = path[path.length - 1];
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
console.log("===== 126. 所有可能的路径 =====");
console.log(allPathsSourceTarget([[1, 2], [3], [3], []]));
// 期望: [[0,1,3],[0,2,3]]
console.log(allPathsSourceTarget2([[1, 2], [3], [3], []]));
console.log(allPathsSourceTarget([[4, 3, 1], [3, 2, 4], [3], [4], []]));

export {};
