// ============================================================
// 157. 子树中标签相同的节点数
// ============================================================
// LeetCode 1519. Number of Nodes in the Sub-Tree With the Same Label
// 给定一棵树（用边表示），每个节点有一个标签。
// 返回数组 ans，其中 ans[i] 表示以节点 i 为根的子树中标签与 i 相同的节点数。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：DFS后序遍历 + 计数数组合并
// 每个节点返回一个长度 26 的计数数组，表示其子树中各字母出现次数
// 父节点合并所有子节点的计数数组，再加上自身字母
function countSubTrees(n: number, edges: number[][], labels: string): number[] {
  // 建图
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const result: number[] = new Array(n).fill(0);

  function dfs(node: number, parent: number): number[] {
    // count[i] 表示当前子树中字母 'a'+i 出现的次数
    const count: number[] = new Array(26).fill(0);
    for (const child of adj[node]) {
      if (child === parent) continue;
      const childCount = dfs(child, node);
      for (let i = 0; i < 26; i++) {
        count[i] += childCount[i];
      }
    }
    // 加入自身
    const idx = labels.charCodeAt(node) - "a".charCodeAt(0);
    count[idx]++;
    result[node] = count[idx];
    return count;
  }

  dfs(0, -1);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 157. 子树中标签相同的节点数 =====");

// 测试1: n=7, edges=[[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]], labels="abaedcd"
//        0(a)
//       /   \
//     1(b)  2(a)
//    / \    / \
//   4(e)5(d)3(d)6(c)
console.log("测试1:", countSubTrees(7, [[0, 1], [0, 2], [1, 4], [1, 5], [2, 3], [2, 6]], "abaedcd"));
// 期望 [2,1,1,1,1,1,1]

// 测试2: n=4, edges=[[0,2],[0,3],[1,2]], labels="aeed"
console.log("测试2:", countSubTrees(4, [[0, 2], [0, 3], [1, 2]], "aeed"));
// 期望 [1,1,2,1]

// 测试3: n=5, edges=[[0,1],[0,2],[1,3],[0,4]], labels="aabab"
console.log("测试3:", countSubTrees(5, [[0, 1], [0, 2], [1, 3], [0, 4]], "aabab"));
// 期望 [3,2,1,1,1]

export {};
