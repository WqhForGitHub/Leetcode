// ============================================================
// 002. 课程表
// ============================================================
// LeetCode 207. Course Schedule
// numCourses 门课，prerequisites[i]=[a,b] 表示要先修 b 才能修 a。判断能否完成所有课程（有向图检测环）。
// 时间复杂度：O(V + E)，空间复杂度：O(V + E)

// 方法1：DFS 三色标记检测环（推荐）
// 0=未访问, 1=访问中(灰), 2=已完成(黑)。遇到访问中的节点说明存在环。
function canFinishDFS(numCourses: number, prerequisites: number[][]): boolean {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) adj[b].push(a); // b -> a
  const color = new Array(numCourses).fill(0);
  const dfs = (u: number): boolean => {
    if (color[u] === 1) return false; // 出现环
    if (color[u] === 2) return true;
    color[u] = 1;
    for (const v of adj[u]) {
      if (!dfs(v)) return false;
    }
    color[u] = 2;
    return true;
  };
  for (let i = 0; i < numCourses; i++) {
    if (color[i] === 0 && !dfs(i)) return false;
  }
  return true;
}

// 方法2：BFS 拓扑排序（Kahn 算法）
// 每次取入度为 0 的节点入队，能出队的节点数等于总节点数则无环。
function canFinishBFS(numCourses: number, prerequisites: number[][]): boolean {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    indegree[a]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) queue.push(i);
  }
  let count = 0;
  while (queue.length > 0) {
    const u = queue.shift()!;
    count++;
    for (const v of adj[u]) {
      if (--indegree[v] === 0) queue.push(v);
    }
  }
  return count === numCourses;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 002. 课程表 =====");
console.log("DFS:", canFinishDFS(2, [[1, 0]])); // 期望 true
console.log("BFS:", canFinishBFS(2, [[1, 0]])); // 期望 true
console.log(
  "DFS:",
  canFinishDFS(2, [
    [1, 0],
    [0, 1],
  ]),
); // 期望 false
console.log(
  "BFS:",
  canFinishBFS(2, [
    [1, 0],
    [0, 1],
  ]),
); // 期望 false
console.log(
  "DFS:",
  canFinishDFS(4, [
    [1, 0],
    [2, 1],
    [3, 2],
  ]),
); // 期望 true
console.log("BFS:", canFinishBFS(1, [])); // 期望 true

export {};
