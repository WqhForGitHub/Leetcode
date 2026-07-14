// ============================================================
// 196. 判断二分图
// ============================================================
// LeetCode 785. Is Graph Bipartite
// 注意：本题与 022. 判断二分图 重复（重复题），此处为再次实现。
// 给定无向图邻接表 graph，判断是否为二分图。
// 思路：BFS 染色 / DFS 染色 / 并查集。
// 时间复杂度：O(V + E)，空间复杂度：O(V)

// 方法1：BFS 染色（推荐）
// 思路：用 0/1 两种颜色交替染色相邻节点，若冲突则非二分图。
function isBipartiteBFS(graph: number[][]): boolean {
  const n = graph.length;
  const color: number[] = new Array(n).fill(-1); // -1 未染色，0/1 两种颜色

  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue;
    const queue: number[] = [start];
    color[start] = 0;
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of graph[u]) {
        if (color[v] === -1) {
          color[v] = color[u] ^ 1;
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;
        }
      }
    }
  }
  return true;
}

// 方法2：DFS 染色
// 思路：递归染色，相邻节点染相反颜色，发现同色邻居则返回 false。
function isBipartiteDFS(graph: number[][]): boolean {
  const n = graph.length;
  const color: number[] = new Array(n).fill(-1);

  function dfs(u: number, c: number): boolean {
    color[u] = c;
    for (const v of graph[u]) {
      if (color[v] === -1) {
        if (!dfs(v, c ^ 1)) return false;
      } else if (color[v] === c) {
        return false;
      }
    }
    return true;
  }

  for (let i = 0; i < n; i++) {
    if (color[i] === -1 && !dfs(i, 0)) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 196. 判断二分图（与 022 重复）=====");

console.log(
  isBipartiteBFS([
    [1, 2, 3],
    [0, 2],
    [0, 1, 3],
    [0, 2],
  ]),
); // 期望: false
console.log(
  isBipartiteBFS([
    [1, 3],
    [0, 2],
    [1, 3],
    [0, 2],
  ]),
); // 期望: true

console.log(
  isBipartiteDFS([
    [1, 2, 3],
    [0, 2],
    [0, 1, 3],
    [0, 2],
  ]),
); // 期望: false
console.log(
  isBipartiteDFS([
    [1, 3],
    [0, 2],
    [1, 3],
    [0, 2],
  ]),
); // 期望: true

export {};
