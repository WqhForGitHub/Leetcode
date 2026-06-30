// ============================================================
// 076. 有向图中最大颜色值
// ============================================================
// LeetCode 1857. Largest Color Value in a Directed Graph
// 给定颜色字符串 colors 与有向边 edges，每个节点一种颜色（小写字母）。
// 求任意路径中某颜色出现次数的最大值；若存在环返回 -1。
// 时间复杂度：O((N+E) * 26)，空间复杂度：O(N * 26)

// 方法1：拓扑排序 + 26 色计数 DP（推荐）
function largestPathValue(colors: string, edges: number[][]): number {
  const n = colors.length;
  const g: number[][] = Array.from({ length: n }, () => []);
  const indeg = new Array<number>(n).fill(0);
  for (const [u, v] of edges) {
    g[u].push(v);
    indeg[v]++;
  }

  const count: number[][] = Array.from({ length: n }, () => new Array<number>(26).fill(0));
  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (indeg[i] === 0) queue.push(i);
  }

  let visited = 0;
  let ans = 0;
  while (queue.length > 0) {
    const u = queue.shift()!;
    visited++;
    const c = colors.charCodeAt(u) - 97;
    count[u][c]++;
    if (count[u][c] > ans) ans = count[u][c];
    for (const v of g[u]) {
      for (let i = 0; i < 26; i++) {
        if (count[u][i] > count[v][i]) count[v][i] = count[u][i];
      }
      indeg[v]--;
      if (indeg[v] === 0) queue.push(v);
    }
  }
  return visited === n ? ans : -1;
}

// 方法2：基于 DFS + 记忆化的状态搜索（含环检测）
function largestPathValueDFS(colors: string, edges: number[][]): number {
  const n = colors.length;
  const g: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) g[u].push(v);

  const memo: number[][] = Array.from({ length: n }, () => new Array<number>(26).fill(-1));
  // 0=未访问,1=访问中,2=完成
  const state = new Array<number>(n).fill(0);
  let ans = 0;
  let hasCycle = false;

  function dfs(u: number): boolean {
    if (hasCycle) return false;
    if (state[u] === 1) {
      hasCycle = true;
      return false;
    }
    if (state[u] === 2) return true;
    state[u] = 1;
    const cur = new Array<number>(26).fill(0);
    for (const v of g[u]) {
      if (!dfs(v)) return false;
      for (let i = 0; i < 26; i++) {
        if (memo[v][i] > cur[i]) cur[i] = memo[v][i];
      }
    }
    cur[colors.charCodeAt(u) - 97]++;
    memo[u] = cur;
    for (let i = 0; i < 26; i++) {
      if (cur[i] > ans) ans = cur[i];
    }
    state[u] = 2;
    return true;
  }

  for (let i = 0; i < n; i++) {
    if (state[i] === 0) {
      dfs(i);
      if (hasCycle) return -1;
    }
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 076. 有向图中最大颜色值 =====");
console.log(
  largestPathValue("abaca", [
    [0, 1],
    [0, 2],
    [2, 3],
    [3, 4],
  ]),
); // 期望 3
console.log(
  largestPathValue("a", [
    [0, 0],
  ]),
); // 期望 -1（自环）
console.log(
  largestPathValueDFS("abaca", [
    [0, 1],
    [0, 2],
    [2, 3],
    [3, 4],
  ]),
); // 期望 3

export {};
