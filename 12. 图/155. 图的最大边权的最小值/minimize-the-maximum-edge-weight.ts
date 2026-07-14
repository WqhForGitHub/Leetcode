// ============================================================
// 155. 图的最大边权的最小值
// ============================================================
// 自定义题：n 节点无向图，选连通子图使最大边权最小。
// 思路：二分 + 并查集 / Kruskal 最小生成树。
// 时间复杂度：O(E log E) Kruskal，空间复杂度：O(n)。

interface Edge {
  u: number;
  v: number;
  w: number;
}

class DSU {
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
  union(a: number, b: number): boolean {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) this.parent[ra] = rb;
    else if (this.rank[ra] > this.rank[rb]) this.parent[rb] = ra;
    else {
      this.parent[rb] = ra;
      this.rank[ra]++;
    }
    return true;
  }
}

// 方法1：二分 + 并查集
// 二分最大边权上限，只用 <= mid 的边判断能否连通目标节点。
function minimizeMaxEdgeBinary(n: number, edges: Edge[], src: number, dst: number): number {
  const weights = edges.map((e) => e.w).sort((a, b) => a - b);
  const lo = 0;
  const hi = weights.length - 1;
  let ans = -1;
  const canConnect = (limit: number): boolean => {
    const dsu = new DSU(n);
    for (const e of edges) {
      if (e.w <= limit) dsu.union(e.u, e.v);
    }
    return dsu.find(src) === dsu.find(dst);
  };
  // 收集所有边权去重排序
  const uniq = [...new Set(edges.map((e) => e.w))].sort((a, b) => a - b);
  let l = 0;
  let r = uniq.length - 1;
  while (l <= r) {
    const mid = (l + r) >> 1;
    if (canConnect(uniq[mid])) {
      ans = uniq[mid];
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }
  return ans;
}

// 方法2：Kruskal 最小生成树
// 按边权升序加入，直到 src 与 dst 连通，当前边权即答案。
function minimizeMaxEdgeKruskal(n: number, edges: Edge[], src: number, dst: number): number {
  const sorted = [...edges].sort((a, b) => a.w - b.w);
  const dsu = new DSU(n);
  for (const e of sorted) {
    dsu.union(e.u, e.v);
    if (dsu.find(src) === dsu.find(dst)) return e.w;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 155. 图的最大边权的最小值 =====");
console.log(
  "Binary:",
  minimizeMaxEdgeBinary(
    4,
    [
      { u: 0, v: 1, w: 5 },
      { u: 1, v: 2, w: 3 },
      { u: 2, v: 3, w: 7 },
      { u: 0, v: 3, w: 10 },
    ],
    0,
    3,
  ), // 期望 7
);
console.log(
  "Kruskal:",
  minimizeMaxEdgeKruskal(
    4,
    [
      { u: 0, v: 1, w: 5 },
      { u: 1, v: 2, w: 3 },
      { u: 2, v: 3, w: 7 },
      { u: 0, v: 3, w: 10 },
    ],
    0,
    3,
  ), // 期望 7
);
console.log(
  "Binary:",
  minimizeMaxEdgeBinary(
    3,
    [
      { u: 0, v: 1, w: 1 },
      { u: 1, v: 2, w: 2 },
    ],
    0,
    2,
  ), // 期望 2
);
console.log(
  "Kruskal:",
  minimizeMaxEdgeKruskal(
    3,
    [
      { u: 0, v: 1, w: 1 },
      { u: 1, v: 2, w: 2 },
    ],
    0,
    2,
  ), // 期望 2
);
console.log(
  "Binary:",
  minimizeMaxEdgeBinary(3, [{ u: 0, v: 1, w: 1 }], 0, 2), // 期望 -1 不连通
);
console.log(
  "Kruskal:",
  minimizeMaxEdgeKruskal(3, [{ u: 0, v: 1, w: 1 }], 0, 2), // 期望 -1
);
console.log(
  "Binary:",
  minimizeMaxEdgeBinary(2, [{ u: 0, v: 1, w: 9 }], 0, 1), // 期望 9
);
console.log(
  "Kruskal:",
  minimizeMaxEdgeKruskal(2, [{ u: 0, v: 1, w: 9 }], 0, 1), // 期望 9
);

export {};
