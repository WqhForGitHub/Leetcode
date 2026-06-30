// ============================================================
// 038. 不邻接植花
// ============================================================
// LeetCode 1042. Flower Planting With No Adjacent
// n 个花园（1..n），paths 为无向路径，4 种花。相邻花园不能种同一种花。
// 每个花园最多 3 条路径，必存在解。返回任意一种种植方案。
// 时间复杂度：O(n + P)，空间复杂度：O(n + P)

// 方法1：贪心（每个花园选邻居没用过的花）（推荐）
// 思路：按编号顺序，对每个花园收集邻居已用的花色，从中选最小未用的花色。
// 因每个花园邻居不超过 3 个、共 4 种花，必然可选出一种。
function gardenNoAdjGreedy(n: number, paths: number[][]): number[] {
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v] of paths) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const ans = new Array(n + 1).fill(0);
  for (let g = 1; g <= n; g++) {
    const used = new Set<number>();
    for (const nb of adj[g]) {
      if (ans[nb] !== 0) used.add(ans[nb]);
    }
    for (let c = 1; c <= 4; c++) {
      if (!used.has(c)) {
        ans[g] = c;
        break;
      }
    }
  }
  return ans.slice(1);
}

// 方法2：BFS 贪心
// 思路：从每个未染色花园出发做 BFS，染色时选邻居未用的花色，保证连通分量内合法。
function gardenNoAdjBFS(n: number, paths: number[][]): number[] {
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v] of paths) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const ans = new Array(n + 1).fill(0);
  for (let start = 1; start <= n; start++) {
    if (ans[start] !== 0) continue;
    const queue: number[] = [start];
    while (queue.length > 0) {
      const g = queue.shift()!;
      if (ans[g] !== 0) continue;
      const used = new Set<number>();
      for (const nb of adj[g]) {
        if (ans[nb] !== 0) used.add(ans[nb]);
      }
      for (let c = 1; c <= 4; c++) {
        if (!used.has(c)) {
          ans[g] = c;
          break;
        }
      }
      for (const nb of adj[g]) {
        if (ans[nb] === 0) queue.push(nb);
      }
    }
  }
  return ans.slice(1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 038. 不邻接植花 =====");
console.log("贪心:", gardenNoAdjGreedy(3, [[1, 2], [2, 3], [3, 1]])); // 期望 [1,2,3] 之一（合法即可）
console.log("贪心:", gardenNoAdjGreedy(4, [[1, 2], [3, 4]])); // 期望 合法方案，如 [1,2,1,2]
console.log("贪心:", gardenNoAdjGreedy(4, [[1, 2], [2, 3], [3, 4], [4, 1], [1, 3], [2, 4]])); // 期望 合法方案
console.log("BFS:", gardenNoAdjBFS(3, [[1, 2], [2, 3], [3, 1]])); // 期望 合法方案
console.log("BFS:", gardenNoAdjBFS(4, [[1, 2], [3, 4]])); // 期望 合法方案

export {};
