// 171. 最小化连通分量的最大成本
// 自定义题：n 节点无向带权图，将节点划分为恰好 k 个连通分量，
// 使最大分量的边权和最小。允许选择边的子集构成生成森林。
// 思路：二分答案上限 + 并查集 + Kruskal 风格贪心合并。

type WeightedEdge = [number, number, number]; // u, v, w

class UnionFind {
  parent: number[];
  cost: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.cost = new Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  // 合并 x, y 所在分量，仅当合并后成本不超过 limit
  union(x: number, y: number, w: number, limit: number): boolean {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return false;
    const combined = this.cost[rx] + this.cost[ry] + w;
    if (combined > limit) return false;
    this.parent[ry] = rx;
    this.cost[rx] = combined;
    return true;
  }
}

function canPartition(edges: WeightedEdge[], n: number, k: number, limit: number): boolean {
  const uf = new UnionFind(n);
  let components = n;
  for (const [u, v, w] of edges) {
    if (uf.union(u, v, w, limit)) {
      components--;
    }
  }
  return components <= k;
}

function minimizeMaxCostOfConnectedComponents(n: number, edges: WeightedEdge[], k: number): number {
  if (k >= n) return 0;
  const sorted = edges.slice().sort((a, b) => a[2] - b[2]);
  let lo = 0;
  let hi = sorted.reduce((s, e) => s + e[2], 0);
  let ans = hi;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (canPartition(sorted, n, k, mid)) {
      ans = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  return ans;
}

// 测试
console.log(
  minimizeMaxCostOfConnectedComponents(
    4,
    [
      [0, 1, 3],
      [1, 2, 2],
      [2, 3, 4],
    ],
    2,
  ),
); // 期望 5
console.log(
  minimizeMaxCostOfConnectedComponents(
    3,
    [
      [0, 1, 1],
      [1, 2, 1],
    ],
    1,
  ),
); // 期望 2
console.log(
  minimizeMaxCostOfConnectedComponents(
    5,
    [
      [0, 1, 2],
      [1, 2, 3],
      [2, 3, 1],
      [3, 4, 5],
    ],
    2,
  ),
); // 期望 6

export {};
