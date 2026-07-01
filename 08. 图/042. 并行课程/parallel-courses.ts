// ============================================================
// 042. 并行课程
// ============================================================
// LeetCode 1136. Parallel Courses
// n 门课，relations=[prevCourse,nextCourse]，每学期可选任意多无依赖课，
// 求最少几学期学完，有环返回 -1（拓扑排序求最长路径层数）。
// 时间复杂度：O(V+E)，空间复杂度：O(V+E)

// 方法1：拓扑排序 BFS（Kahn）求最长路径层数（推荐）
function minimumSemesters(n: number, relations: number[][]): number {
  const graph: number[][] = Array.from({ length: n + 1 }, () => []);
  const indegree: number[] = new Array(n + 1).fill(0);
  for (const [prev, next] of relations) {
    graph[prev].push(next);
    indegree[next]++;
  }

  // 队列存 [课程, 已用学期]
  const queue: Array<[number, number]> = [];
  for (let i = 1; i <= n; i++) {
    if (indegree[i] === 0) queue.push([i, 1]);
  }

  let studied = 0;
  let maxSemester = 0;
  while (queue.length > 0) {
    const [course, semester] = queue.shift()!;
    studied++;
    maxSemester = Math.max(maxSemester, semester);
    for (const next of graph[course]) {
      indegree[next]--;
      if (indegree[next] === 0) {
        queue.push([next, semester + 1]);
      }
    }
  }
  return studied === n ? maxSemester : -1;
}

// 方法2：拓扑排序按层处理（每学期整层）
function minimumSemestersByLayer(n: number, relations: number[][]): number {
  const graph: number[][] = Array.from({ length: n + 1 }, () => []);
  const indegree: number[] = new Array(n + 1).fill(0);
  for (const [prev, next] of relations) {
    graph[prev].push(next);
    indegree[next]++;
  }

  let queue: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (indegree[i] === 0) queue.push(i);
  }

  let semester = 0;
  let studied = 0;
  while (queue.length > 0) {
    semester++;
    const next: number[] = [];
    for (const course of queue) {
      studied++;
      for (const nx of graph[course]) {
        indegree[nx]--;
        if (indegree[nx] === 0) next.push(nx);
      }
    }
    queue = next;
  }
  return studied === n ? semester : -1;
}

// 方法3：DFS 求最长路径 + 环检测
function minimumSemestersDFS(n: number, relations: number[][]): number {
  const graph: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [prev, next] of relations) {
    graph[prev].push(next);
  }

  // state: 0=未访问, 1=访问中, 2=已完成
  const state: number[] = new Array(n + 1).fill(0);
  const memo: number[] = new Array(n + 1).fill(0);
  let hasCycle = false;

  const dfs = (u: number): number => {
    if (state[u] === 1) {
      hasCycle = true;
      return 0;
    }
    if (state[u] === 2) return memo[u];
    state[u] = 1;
    let maxChild = 0;
    for (const v of graph[u]) {
      maxChild = Math.max(maxChild, dfs(v));
      if (hasCycle) return 0;
    }
    state[u] = 2;
    memo[u] = maxChild + 1;
    return memo[u];
  };

  let result = 0;
  for (let i = 1; i <= n; i++) {
    result = Math.max(result, dfs(i));
    if (hasCycle) return -1;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 042. 并行课程 =====");
console.log(
  "BFS:",
  minimumSemesters(3, [
    [1, 3],
    [2, 3],
  ]),
); // 期望 2
console.log(
  "BFS 按层:",
  minimumSemestersByLayer(3, [
    [1, 3],
    [2, 3],
  ]),
); // 期望 2
console.log(
  "DFS:",
  minimumSemestersDFS(3, [
    [1, 3],
    [2, 3],
  ]),
); // 期望 2
console.log(
  "BFS 有环:",
  minimumSemesters(2, [
    [1, 2],
    [2, 1],
  ]),
); // 期望 -1
console.log("BFS 无依赖:", minimumSemesters(2, [])); // 期望 1

export {};
