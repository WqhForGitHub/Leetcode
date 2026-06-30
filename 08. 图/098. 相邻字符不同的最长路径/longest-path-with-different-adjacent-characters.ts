// ============================================================
// 098. 相邻字符不同的最长路径
// ============================================================
// LeetCode 2246. Longest Path With Different Adjacent Characters
// 树（parent 数组，parent[i] 为 i 的父节点，根为 -1），s 字符串每个节点字符。
// 求最长路径使路径上任意相邻节点字符不同（路径中的边数表示路径长度，节点数-1）。
// 方法：树形 DP，每个节点维护子树中以不同字符向下延伸的最长两条路径，更新全局答案。
// 时间复杂度：O(n)，空间复杂度：O(n)

function longestPath(parent: number[], s: string): number {
  const n = parent.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) {
    children[parent[i]].push(i);
  }

  let ans = 1; // 至少有一个节点
  const dfs = (u: number): number => {
    // 返回以 u 为端点向下延伸的最长"相邻字符不同"路径的节点数
    let max1 = 0; // 最长子链
    let max2 = 0; // 次长子链
    for (const v of children[u]) {
      const childLen = dfs(v);
      if (s[v] === s[u]) continue; // 相邻字符相同，不能接续
      if (childLen > max1) {
        max2 = max1;
        max1 = childLen;
      } else if (childLen > max2) {
        max2 = childLen;
      }
    }
    // 经过 u 的最长路径 = max1 + max2 + 1（节点数）
    ans = Math.max(ans, max1 + max2 + 1);
    return max1 + 1;
  };
  dfs(0);
  return ans; // 返回节点数（按 LC 定义路径长度为节点数）
}

// 方法2：显式维护前两大值（同思路，结构更直观）
function longestPathV2(parent: number[], s: string): number {
  const n = parent.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) children[parent[i]].push(i);

  let best = 0;
  const dfs = (u: number): number => {
    let first = 0;
    let second = 0;
    for (const v of children[u]) {
      const len = dfs(v);
      if (s[v] !== s[u]) {
        if (len > first) {
          second = first;
          first = len;
        } else if (len > second) {
          second = len;
        }
      }
    }
    // 经过 u 的最长链（节点数）= first + second + 1
    best = Math.max(best, first + second + 1);
    return first + 1;
  };
  dfs(0);
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 098. 相邻字符不同的最长路径 =====");
console.log(longestPath([-1, 0, 0, 1, 1, 2], "abacbe")); // 期望: 3
console.log(longestPath([-1, 0, 0, 0], "aabc")); // 期望: 3
console.log(longestPath([-1, 0, 1, 0, 3, 3], "abacba")); // 期望: 5
console.log(longestPathV2([-1, 0, 0, 1, 1, 2], "abacbe")); // 期望: 3

export {};
