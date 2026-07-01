// ============================================================
// 026. 树中距离之和
// ============================================================
// LeetCode 834. Sum of Distances in Tree
// n 个节点的树（边 edges），对每个节点求它到所有其他节点的距离之和。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：两次 DFS 换根 DP（推荐）
// 思路：
// 1) 第一次 DFS（以 0 为根）：求每个子树大小 size[u] 和 ans[0]（0 到各点距离和）。
// 2) 第二次 DFS（换根）：从父 u 转移到子 v 时：
//    ans[v] = ans[u] - size[v] + (n - size[v])
//    即 v 子树内 size[v] 个节点距离 -1，其余 n-size[v] 个节点距离 +1。
function sumOfDistancesInTree(n: number, edges: number[][]): number[] {
  // 建邻接表
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const size: number[] = new Array(n).fill(0); // 子树大小
  const ans: number[] = new Array(n).fill(0);

  // 第一次 DFS：求 size 与 ans[0]
  function dfs1(u: number, parent: number, depth: number): void {
    size[u] = 1;
    ans[0] += depth; // 累加到 0 的距离
    for (const v of adj[u]) {
      if (v !== parent) {
        dfs1(v, u, depth + 1);
        size[u] += size[v];
      }
    }
  }

  // 第二次 DFS：换根转移
  function dfs2(u: number, parent: number): void {
    for (const v of adj[u]) {
      if (v !== parent) {
        // v 子树内节点距离 -1，其余 +1
        ans[v] = ans[u] - size[v] + (n - size[v]);
        dfs2(v, u);
      }
    }
  }

  dfs1(0, -1, 0);
  dfs2(0, -1);
  return ans;
}

// 方法2：暴力 BFS（仅用于验证，O(n^2)）
// 思路：对每个节点做一次 BFS 求距离和。仅在小规模可参考对比。
function sumOfDistancesInTreeBrute(n: number, edges: number[][]): number[] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const result: number[] = new Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    const dist: number[] = new Array(n).fill(-1);
    const queue: number[] = [s];
    dist[s] = 0;
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of adj[u]) {
        if (dist[v] === -1) {
          dist[v] = dist[u] + 1;
          queue.push(v);
        }
      }
    }
    result[s] = dist.reduce((a, b) => a + b, 0);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 026. 树中距离之和 =====");

console.log(
  sumOfDistancesInTree(6, [
    [0, 1],
    [0, 2],
    [2, 3],
    [2, 4],
    [2, 5],
  ]),
); // 期望: [8,12,6,10,10,10]
console.log(
  sumOfDistancesInTreeBrute(6, [
    [0, 1],
    [0, 2],
    [2, 3],
    [2, 4],
    [2, 5],
  ]),
); // 期望: [8,12,6,10,10,10]

console.log(sumOfDistancesInTree(1, [])); // 期望: [0]
console.log(sumOfDistancesInTree(2, [[1, 0]])); // 期望: [1,1]

export {};
