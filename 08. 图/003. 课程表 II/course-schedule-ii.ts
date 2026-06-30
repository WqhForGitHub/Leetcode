// ============================================================
// 003. 课程表 II
// ============================================================
// LeetCode 210. Course Schedule II
// 返回任意一个合法的拓扑顺序；若存在环无法完成则返回空数组。
// 时间复杂度：O(V + E)，空间复杂度：O(V + E)

// 方法1：BFS 拓扑排序（Kahn 算法）（推荐）
// 入度为 0 的课程入队，出队入结果并减小后继入度，最终结果长度等于课程数即合法。
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    adj[b].push(a); // b -> a
    indegree[a]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) queue.push(i);
  }
  const order: number[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    for (const v of adj[u]) {
      if (--indegree[v] === 0) queue.push(v);
    }
  }
  return order.length === numCourses ? order : [];
}

// 方法2：DFS 后序逆序
// 三态标记检测环，完成时入栈，最终逆序即为拓扑序。
function findOrderDFS(numCourses: number, prerequisites: number[][]): number[] {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) adj[b].push(a);
  const state = new Array(numCourses).fill(0); // 0 未访问, 1 访问中, 2 已完成
  const order: number[] = [];
  let hasCycle = false;
  const dfs = (u: number): void => {
    if (hasCycle) return;
    if (state[u] === 1) {
      hasCycle = true; // 环
      return;
    }
    if (state[u] === 2) return;
    state[u] = 1;
    for (const v of adj[u]) dfs(v);
    state[u] = 2;
    order.push(u); // 后序入栈
  };
  for (let i = 0; i < numCourses; i++) {
    if (state[i] === 0) dfs(i);
  }
  return hasCycle ? [] : order.reverse(); // 后序逆序 = 拓扑序
}

// ============================================================
// 测试
// ============================================================
console.log("===== 003. 课程表 II =====");
console.log("BFS:", findOrder(2, [[1, 0]])); // 期望 [0, 1]
console.log("DFS:", findOrderDFS(2, [[1, 0]])); // 期望 [0, 1]
console.log("BFS:", findOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]])); // 期望 [0,1,2,3] 或 [0,2,1,3]
console.log("DFS:", findOrderDFS(4, [[1, 0], [2, 0], [3, 1], [3, 2]])); // 期望 [0,2,1,3] 或 [0,1,2,3]
console.log("BFS:", findOrder(1, [])); // 期望 [0]
console.log("BFS(环):", findOrder(2, [[0, 1], [1, 0]])); // 期望 []

export {};
