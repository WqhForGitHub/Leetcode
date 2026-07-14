// ============================================================
// 060. 图中最相似的路径
// ============================================================
// 自定义题：给定无向图（邻接表，节点 0..n-1）与目标路径 targetPath（节点序列），
// 求一条长度等于 targetPath 的图上路径（每步沿一条边走到相邻节点），
// 使其与 targetPath 在对应位置上"节点不同"的个数最小，返回该路径。
// 编辑距离 = 对应位置节点不同的个数。
// 时间复杂度：O(L * (V + E))，空间复杂度：O(L * V)

// ============================================================
// 方法1：动态规划（推荐）
// dp[i][v] = 走到 targetPath 第 i 步、停在节点 v 时的最小差异。
// 转移：dp[i][v] = min_{u in adj[v]} dp[i-1][u] + (v != targetPath[i] ? 1 : 0)
// 用 prev[i][v] 记录最优前驱，最后回溯得到路径。
// 时间复杂度：O(L * (V + E))，空间复杂度：O(L * V)
// ============================================================
function mostSimilarPathDP(adj: number[][], targetPath: number[]): number[] {
  const n = adj.length;
  const L = targetPath.length;
  if (L === 0) return [];
  if (n === 0) return [];

  const INF = Number.POSITIVE_INFINITY;
  // dp[i][v]
  const dp: number[][] = Array.from({ length: L }, () => new Array(n).fill(INF));
  const prev: number[][] = Array.from({ length: L }, () => new Array(n).fill(-1));

  // 初始步：可从任意节点出发
  for (let v = 0; v < n; v++) {
    dp[0][v] = targetPath[0] !== v ? 1 : 0;
  }

  // 递推
  for (let i = 1; i < L; i++) {
    for (let v = 0; v < n; v++) {
      const add = targetPath[i] !== v ? 1 : 0;
      let best = INF;
      let bestU = -1;
      for (const u of adj[v]) {
        if (dp[i - 1][u] === INF) continue;
        const val = dp[i - 1][u] + add;
        if (val < best) {
          best = val;
          bestU = u;
        }
      }
      dp[i][v] = best;
      prev[i][v] = bestU;
    }
  }

  // 找终点（最后一步差异最小的节点）
  let endV = 0;
  let endCost = dp[L - 1][0];
  for (let v = 1; v < n; v++) {
    if (dp[L - 1][v] < endCost) {
      endCost = dp[L - 1][v];
      endV = v;
    }
  }

  // 回溯路径
  const path: number[] = new Array(L);
  let cur = endV;
  for (let i = L - 1; i >= 0; i--) {
    path[i] = cur;
    if (i > 0) cur = prev[i][cur];
  }
  return path;
}

// ============================================================
// 方法2：DFS 记忆化
// dfs(i, v) = 从第 i 步、节点 v 出发走到结束的最小差异（含当前位置）。
// 时间复杂度：O(L * (V + E))，空间复杂度：O(L * V)
// ============================================================
function mostSimilarPathDFS(adj: number[][], targetPath: number[]): number[] {
  const n = adj.length;
  const L = targetPath.length;
  if (L === 0) return [];
  if (n === 0) return [];

  const INF = Number.POSITIVE_INFINITY;
  // memo[i][v] = {cost, nextV}
  const memoCost: number[][] = Array.from({ length: L }, () => new Array(n).fill(-1));
  const memoNext: number[][] = Array.from({ length: L }, () => new Array(n).fill(-1));

  const dfs = (i: number, v: number): number => {
    const add = targetPath[i] !== v ? 1 : 0;
    if (i === L - 1) return add;
    if (memoCost[i][v] !== -1) return memoCost[i][v];
    let best = INF;
    let bestNext = -1;
    for (const u of adj[v]) {
      const val = dfs(i + 1, u);
      if (val < best) {
        best = val;
        bestNext = u;
      }
    }
    memoCost[i][v] = best === INF ? INF : add + best;
    memoNext[i][v] = bestNext;
    return memoCost[i][v];
  };

  // 枚举起点
  let startV = 0;
  let startCost = dfs(0, 0);
  for (let v = 1; v < n; v++) {
    const c = dfs(0, v);
    if (c < startCost) {
      startCost = c;
      startV = v;
    }
  }

  // 沿 next 重建路径
  const path: number[] = new Array(L);
  let cur = startV;
  for (let i = 0; i < L; i++) {
    path[i] = cur;
    cur = memoNext[i][cur];
  }
  return path;
}

// 统一入口
function mostSimilarPath(adj: number[][], targetPath: number[]): number[] {
  return mostSimilarPathDP(adj, targetPath);
}

// 计算路径与目标路径的差异（用于验证）
function pathCost(path: number[], targetPath: number[]): number {
  let c = 0;
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== targetPath[i]) c++;
  }
  return c;
}

// 验证路径合法（相邻节点在图中连通，假设无向）
function isValidPath(adj: number[][], path: number[]): boolean {
  const adjSet: Set<number>[] = adj.map((arr) => new Set(arr));
  for (let i = 1; i < path.length; i++) {
    if (!adjSet[path[i - 1]].has(path[i])) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 060. 图中最相似的路径 =====");
// 图：0-1-2 链式
const adj1: number[][] = [[1], [0, 2], [1]];
// 测试1: targetPath=[0,1,2] -> 路径 [0,1,2]，差异 0
{
  const tp = [0, 1, 2];
  const p = mostSimilarPath(adj1, tp);
  console.log(p, "cost=", pathCost(p, tp), "valid=", isValidPath(adj1, p)); // 期望 [0,1,2] cost 0
}
// 测试2: targetPath=[0,2,1] -> 最优 [1,2,1]，差异 1
{
  const tp = [0, 2, 1];
  const p = mostSimilarPath(adj1, tp);
  console.log(p, "cost=", pathCost(p, tp), "valid=", isValidPath(adj1, p)); // 期望 [1,2,1] cost 1
  const p2 = mostSimilarPathDFS(adj1, tp);
  console.log(p2, "cost=", pathCost(p2, tp), "valid=", isValidPath(adj1, p2)); // 期望 [1,2,1] cost 1
}
// 测试3: 三角形图 0-1-2-0
const adj2: number[][] = [
  [1, 2],
  [0, 2],
  [0, 1],
];
{
  const tp = [0, 1, 2, 0];
  const p = mostSimilarPath(adj2, tp);
  console.log(p, "cost=", pathCost(p, tp), "valid=", isValidPath(adj2, p)); // 期望 [0,1,2,0] cost 0
}
// 测试4: 单节点路径 targetPath=[2,2,2]（图无自环，需来回走）
{
  const tp = [2, 2, 2];
  const p = mostSimilarPath(adj1, tp);
  console.log(p, "cost=", pathCost(p, tp), "valid=", isValidPath(adj1, p)); // 合法路径，cost>=1
  const p2 = mostSimilarPathDFS(adj1, tp);
  console.log(p2, "cost=", pathCost(p2, tp), "valid=", isValidPath(adj1, p2));
}

export {};
