// ============================================================
// 025. 找到最终的安全状态
// ============================================================
// LeetCode 802. Find Eventual Safe States
// 有向图 graph，安全节点：所有从它出发的路径都终止于终点（无出边）或其它安全节点。
// 返回所有安全节点，升序。
// 时间复杂度：O(V+E)，空间复杂度：O(V+E)

// 方法1：反向图 + 拓扑排序 Kahn（推荐）
// 思路：终点（出度为 0）必安全。建立反向图，从出度为 0 的节点出发，
// 每移除一个安全节点，就令其前驱的出度 -1；出度归零则成为安全节点。
function eventualSafeNodesKahn(graph: number[][]): number[] {
  const n = graph.length;
  // 反向图
  const radj: number[][] = Array.from({ length: n }, () => []);
  const outdeg: number[] = new Array(n).fill(0);
  for (let u = 0; u < n; u++) {
    outdeg[u] = graph[u].length;
    for (const v of graph[u]) {
      radj[v].push(u); // v -> u（反向）
    }
  }

  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (outdeg[i] === 0) queue.push(i); // 终点入队
  }

  const safe: boolean[] = new Array(n).fill(false);
  while (queue.length > 0) {
    const u = queue.shift()!;
    safe[u] = true;
    for (const prev of radj[u]) {
      outdeg[prev]--;
      if (outdeg[prev] === 0) queue.push(prev);
    }
  }

  const result: number[] = [];
  for (let i = 0; i < n; i++) if (safe[i]) result.push(i);
  return result;
}

// 方法2：DFS 三色标记
// 思路：0=未访问(白)，1=访问中(灰，在当前递归栈)，2=安全(黑)。
// 若某节点所有邻居都安全，则它安全；若遇到灰色节点说明存在环，不安全。
function eventualSafeNodesDFS(graph: number[][]): number[] {
  const n = graph.length;
  const color: number[] = new Array(n).fill(0); // 0 白 1 灰 2 黑

  function dfs(u: number): boolean {
    if (color[u] === 1) return false; // 环
    if (color[u] === 2) return true; // 已确认安全
    color[u] = 1; // 标记访问中
    for (const v of graph[u]) {
      if (!dfs(v)) return false;
    }
    color[u] = 2; // 所有邻居都安全，本节点安全
    return true;
  }

  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    if (dfs(i)) result.push(i);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 025. 找到最终的安全状态 =====");

console.log(eventualSafeNodesKahn([[1, 2], [2, 3], [5], [0], [5], [], []])); // 期望: [2,4,5,6]
console.log(eventualSafeNodesKahn([[1], [2], [0], []])); // 期望: [3]

console.log(eventualSafeNodesDFS([[1, 2], [2, 3], [5], [0], [5], [], []])); // 期望: [2,4,5,6]
console.log(eventualSafeNodesDFS([[1], [2], [0], []])); // 期望: [3]

export {};
