// ============================================================
// 099. K 条高速公路的最大旅行费用
// ============================================================
// LeetCode 无标准对应（自定义题）
// n 城市带权无向边 highways，k 次高速公路旅行。从任意城市出发走最多 k 条边，
// 求最大总费用（边可重复经过但费用只计一次）。
// 方法：DFS 回溯（带已用边集合），枚举每条未用边继续走，小规模。
// 时间复杂度：O(E^k)（最坏），空间复杂度：O(E + k)

interface Edge {
  to: number;
  weight: number;
  id: number;
}

function maximumCost(n: number, highways: number[][], k: number): number {
  if (k === 0) return 0;
  const adj: Edge[][] = Array.from({ length: n }, () => []);
  highways.forEach(([u, v, w], id) => {
    adj[u].push({ to: v, weight: w, id });
    adj[v].push({ to: u, weight: w, id });
  });

  let best = -1;
  const usedEdge = new Set<number>();

  const dfs = (u: number, remaining: number, total: number) => {
    if (remaining === 0) {
      best = Math.max(best, total);
      return;
    }
    best = Math.max(best, total); // 走任意 <=k 条边均可
    let moved = false;
    for (const e of adj[u]) {
      if (usedEdge.has(e.id)) continue;
      usedEdge.add(e.id);
      dfs(e.to, remaining - 1, total + e.weight);
      usedEdge.delete(e.id);
      moved = true;
    }
    if (!moved) {
      best = Math.max(best, total);
    }
  };

  // 从每个城市出发
  for (let start = 0; start < n; start++) {
    dfs(start, k, 0);
  }
  return best;
}

// 方法2：状压 + 记忆化（中等规模优化）
// 状态：(当前城市, 已用边集合, 已走步数)。由于边数较多时状压不可行，仅适合 E<=15。
function maximumCostDP(n: number, highways: number[][], k: number): number {
  if (k === 0) return 0;
  const E = highways.length;
  if (E > 20) return maximumCost(n, highways, k); // 边太多回退 DFS

  const adj: Edge[][] = Array.from({ length: n }, () => []);
  highways.forEach(([u, v, w], id) => {
    adj[u].push({ to: v, weight: w, id });
    adj[v].push({ to: u, weight: w, id });
  });

  const memo = new Map<string, number>();
  let best = 0;

  const dfs = (u: number, mask: number, steps: number, total: number): void => {
    best = Math.max(best, total);
    if (steps === k) return;
    const key = `${u},${mask},${steps}`;
    if (memo.has(key) && memo.get(key)! >= total) return;
    memo.set(key, total);
    for (const e of adj[u]) {
      if (mask & (1 << e.id)) continue;
      dfs(e.to, mask | (1 << e.id), steps + 1, total + e.weight);
    }
  };

  for (let start = 0; start < n; start++) dfs(start, 0, 0, 0);
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 099. K 条高速公路的最大旅行费用 =====");
console.log(maximumCost(4, [[0, 1, 10], [1, 2, 20], [2, 3, 30], [0, 3, 5]], 2)); // 期望: 50（2->3->0 退路 或 1->2->3 = 50）
console.log(maximumCost(4, [[0, 1, 10], [1, 2, 20], [2, 3, 30]], 3)); // 期望: 60（0->1->2->3）
console.log(maximumCost(2, [[0, 1, 100]], 1)); // 期望: 100
console.log(maximumCost(3, [[0, 1, 5], [1, 2, 5], [0, 2, 5]], 2)); // 期望: 10
console.log(maximumCostDP(4, [[0, 1, 10], [1, 2, 20], [2, 3, 30], [0, 3, 5]], 2)); // 期望: 50

export {};
