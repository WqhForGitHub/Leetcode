// 167. 升级后最大生成树稳定性
// n 节点带权无向 edges，可升级 k 条边权翻倍，求最大生成树总权值。
// 解法：Kruskal 变体，按升级后权值排序贪心。

interface WEdge {
  u: number;
  v: number;
  w: number;
}

class UF167 {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x: number, y: number): boolean {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return false;
    if (this.rank[rx] < this.rank[ry]) this.parent[rx] = ry;
    else if (this.rank[rx] > this.rank[ry]) this.parent[ry] = rx;
    else {
      this.parent[ry] = rx;
      this.rank[rx]++;
    }
    return true;
  }
}

function maximumSpanningTreeStabilityAfterUpgrade(
  n: number,
  edgesRaw: [number, number, number][],
  k: number,
): number {
  const m = edgesRaw.length;
  // 每条边可选升级（w*2）或不升级（w）。共选 n-1 条构成树，最多 k 条升级。
  // 贪心：按"升级后权值"降序排序，但需限制升级边数 <= k。
  // 转化为：每条边有两个候选值，选 n-1 条使总权最大且升级数<=k。
  // 贪心策略：对每条边尝试升级（若升级数 < k），按升级后值降序选。
  const candidates: { idx: number; upgraded: boolean; val: number }[] = [];
  for (let i = 0; i < m; i++) {
    candidates.push({ idx: i, upgraded: false, val: edgesRaw[i][2] });
    candidates.push({ idx: i, upgraded: true, val: edgesRaw[i][2] * 2 });
  }
  candidates.sort((a, b) => b.val - a.val);
  const uf = new UF167(n);
  let sum = 0;
  let used = 0;
  const edgeUsed = new Array(m).fill(false);
  const usedUpgrades = new Set<number>();
  for (const c of candidates) {
    if (used === n - 1) break;
    if (edgeUsed[c.idx]) continue;
    if (c.upgraded && usedUpgrades.size >= k) continue;
    const [u, v] = edgesRaw[c.idx];
    if (uf.union(u, v)) {
      edgeUsed[c.idx] = true;
      sum += c.val;
      used++;
      if (c.upgraded) usedUpgrades.add(c.idx);
    }
  }
  return used === n - 1 ? sum : -1;
}

// 方法二：枚举升级子集（k 较小时）+ Kruskal
function maximumSpanningTreeStabilityBrute(
  n: number,
  edgesRaw: [number, number, number][],
  k: number,
): number {
  const m = edgesRaw.length;
  let best = -1;
  const enumerateUpgrades = (start: number, chosen: number[], upgradesLeft: number): void => {
    if (start === m) {
      const uf = new UF167(n);
      const ws = chosen.map((i) => ({ i, w: edgesRaw[i][2] * 2 }));
      const rest = [];
      for (let i = 0; i < m; i++) if (!chosen.includes(i)) rest.push({ i, w: edgesRaw[i][2] });
      const all = [...ws, ...rest].sort((a, b) => b.w - a.w);
      let sum = 0;
      let cnt = 0;
      for (const { i, w } of all) {
        const [u, v] = edgesRaw[i];
        if (uf.union(u, v)) {
          sum += w;
          cnt++;
          if (cnt === n - 1) break;
        }
      }
      if (cnt === n - 1) best = Math.max(best, sum);
      return;
    }
    enumerateUpgrades(start + 1, chosen, upgradesLeft);
    if (upgradesLeft > 0) {
      chosen.push(start);
      enumerateUpgrades(start + 1, chosen, upgradesLeft - 1);
      chosen.pop();
    }
  };
  enumerateUpgrades(0, [], k);
  return best;
}

// 测试
console.log(
  maximumSpanningTreeStabilityAfterUpgrade(
    4,
    [
      [0, 1, 1],
      [1, 2, 2],
      [2, 3, 3],
      [0, 3, 4],
    ],
    1,
  ),
);
console.log(
  maximumSpanningTreeStabilityBrute(
    4,
    [
      [0, 1, 1],
      [1, 2, 2],
      [2, 3, 3],
      [0, 3, 4],
    ],
    1,
  ),
);

export {};
