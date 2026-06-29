// ============================================================
// 098. 树中距离之和
// ============================================================
// LeetCode 834. Sum of Distances in Tree
// 给定一个无向、连通的树。树中有 n 个标记为 0...n-1 的节点以及 n-1 条边。
// 返回一个数组 ans，其中 ans[i] 表示树中第 i 个节点到其他所有节点的距离之和。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：两次 DFS 换根 DP（推荐）
// 第一次 DFS（以 0 为根）：
//   - 求出每个子树大小 size[u]
//   - 求出 ans[0]（0 到所有节点距离之和）
// 第二次 DFS（换根）：
//   - 当根从 u 换到其孩子 v 时：
//     ans[v] = ans[u] - size[v] + (n - size[v])
//   解释：v 子树中所有节点到 v 的距离都比到 u 少 1（共减少 size[v]）；
//        其余 n - size[v] 个节点到 v 的距离都比到 u 多 1（共增加 n - size[v]）。

function sumOfDistancesInTree(n: number, edges: number[][]): number[] {
  // 建邻接表
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const size = new Array(n).fill(0); // 子树大小（含自身）
  const ans = new Array(n).fill(0);

  // 第一次 DFS：从 0 出发，求 size 和 ans[0]
  function dfs1(u: number, parent: number, depth: number): void {
    size[u] = 1;
    ans[0] += depth;
    for (const v of adj[u]) {
      if (v !== parent) {
        dfs1(v, u, depth + 1);
        size[u] += size[v];
      }
    }
  }
  dfs1(0, -1, 0);

  // 第二次 DFS：换根 DP
  function dfs2(u: number, parent: number): void {
    for (const v of adj[u]) {
      if (v !== parent) {
        ans[v] = ans[u] - size[v] + (n - size[v]);
        dfs2(v, u);
      }
    }
  }
  dfs2(0, -1);

  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 098. 树中距离之和 =====");

// 测试1: n = 6, edges = [[0,1],[0,2],[2,3],[2,4],[2,5]]
// 树结构：
//       0
//      / \
//     1   2
//        / | \
//       3  4  5
// ans = [8,12,6,10,10,10]
const result1 = sumOfDistancesInTree(6, [
  [0, 1],
  [0, 2],
  [2, 3],
  [2, 4],
  [2, 5],
]);
console.log("测试1:", result1); // 期望 [8,12,6,10,10,10]

// 测试2: n = 2, edges = [[1,0]]
// ans = [1,1]
const result2 = sumOfDistancesInTree(2, [[1, 0]]);
console.log("测试2:", result2); // 期望 [1,1]

// 测试3: n = 1, edges = []
// 单节点
const result3 = sumOfDistancesInTree(1, []);
console.log("测试3:", result3); // 期望 [0]

// 测试4: 链状树 n = 4, edges = [[0,1],[1,2],[2,3]]
// 0-1-2-3
// ans: 0->1+2+3=6, 1->1+1+2=4, 2->2+1+1=4, 3->3+2+1=6
const result4 = sumOfDistancesInTree(4, [
  [0, 1],
  [1, 2],
  [2, 3],
]);
console.log("测试4:", result4); // 期望 [6,4,4,6]

export {};
