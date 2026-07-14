// ============================================================
// 152. 施法所需最低符文数量
// ============================================================
// 自定义题：n 个符文，依赖图 edges（前置关系），每个符文消耗 cost，
// 激活给定的目标符文集合所需的最小总消耗。激活某符文前必须先激活其前置。
// 思路：拓扑排序 + 状态压缩 DP，枚举已激活集合转移。
// 时间复杂度：O(2^n * n)，空间复杂度：O(2^n)。

// 方法1：状态压缩 DP
// dp[mask] 表示已激活符文集合为 mask 时的最小总消耗。
// 对每个未激活符文，若其所有前置已在 mask 中，则可激活。
function minRunesToCastSpell(
  n: number,
  edges: number[][],
  cost: number[],
  targets: number[],
): number {
  const prereq: number[] = new Array(n).fill(0);
  for (const [u, v] of edges) {
    // 激活 v 需要先激活 u
    prereq[v] |= 1 << u;
  }
  let targetMask = 0;
  for (const t of targets) targetMask |= 1 << t;
  const INF = Number.POSITIVE_INFINITY;
  const dp: number[] = new Array(1 << n).fill(INF);
  dp[0] = 0;
  let ans = INF;
  for (let mask = 0; mask < 1 << n; mask++) {
    if (dp[mask] === INF) continue;
    if ((mask & targetMask) === targetMask) {
      ans = Math.min(ans, dp[mask]);
    }
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue;
      if ((mask & prereq[i]) === prereq[i]) {
        const next = mask | (1 << i);
        dp[next] = Math.min(dp[next], dp[mask] + cost[i]);
      }
    }
  }
  return ans === INF ? -1 : ans;
}

// 方法2：拓扑排序 + 贪心缩减（求必须激活的符文集合后求和）
// 先求出所有目标符文及其传递依赖，再对必须集合求 cost 之和。
function minRunesToCastSpellTopo(
  n: number,
  edges: number[][],
  cost: number[],
  targets: number[],
): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[v].push(u); // v 依赖 u
  const need = new Set<number>();
  const stack: number[] = [...targets];
  while (stack.length > 0) {
    const cur = stack.pop()!;
    if (need.has(cur)) continue;
    need.add(cur);
    for (const pre of adj[cur]) stack.push(pre);
  }
  // 验证依赖无环（拓扑）
  const needArr = [...need];
  const needSet = new Set(needArr);
  const indeg: Map<number, number> = new Map();
  for (const v of needArr) indeg.set(v, 0);
  for (const [u, v] of edges) {
    if (needSet.has(u) && needSet.has(v)) indeg.set(v, (indeg.get(v) ?? 0) + 1);
  }
  const q: number[] = [];
  for (const v of needArr) if ((indeg.get(v) ?? 0) === 0) q.push(v);
  let cnt = 0;
  const radj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) if (needSet.has(u) && needSet.has(v)) radj[u].push(v);
  while (q.length > 0) {
    const cur = q.shift()!;
    cnt++;
    for (const nx of radj[cur]) {
      indeg.set(nx, (indeg.get(nx) ?? 0) - 1);
      if ((indeg.get(nx) ?? 0) === 0) q.push(nx);
    }
  }
  if (cnt !== needArr.length) return -1; // 存在环
  return needArr.reduce((s, i) => s + cost[i], 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 152. 施法所需最低符文数量 =====");
console.log(
  "DP:",
  minRunesToCastSpell(3, [[0, 1]], [5, 10, 3], [1]), // 期望 15
);
console.log(
  "Topo:",
  minRunesToCastSpellTopo(3, [[0, 1]], [5, 10, 3], [1]), // 期望 15
);
console.log(
  "DP:",
  minRunesToCastSpell(
    4,
    [
      [0, 1],
      [1, 2],
    ],
    [1, 2, 3, 4],
    [2],
  ), // 期望 6
);
console.log(
  "Topo:",
  minRunesToCastSpellTopo(
    4,
    [
      [0, 1],
      [1, 2],
    ],
    [1, 2, 3, 4],
    [2],
  ), // 期望 6
);
console.log(
  "DP:",
  minRunesToCastSpell(
    3,
    [
      [0, 1],
      [1, 0],
    ],
    [1, 1, 1],
    [1],
  ), // 期望 -1（环）
);
console.log(
  "Topo:",
  minRunesToCastSpellTopo(
    3,
    [
      [0, 1],
      [1, 0],
    ],
    [1, 1, 1],
    [1],
  ), // 期望 -1
);
console.log(
  "DP:",
  minRunesToCastSpell(2, [], [3, 7], [0, 1]), // 期望 10
);
console.log(
  "Topo:",
  minRunesToCastSpellTopo(2, [], [3, 7], [0, 1]), // 期望 10
);

export {};
