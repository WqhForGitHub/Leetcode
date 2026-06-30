// ============================================================
// 063. 连接所有点的最小费用
// ============================================================
// LeetCode 1584. Min Cost to Connect All Points
// 给定 points 坐标数组，两点间距离为曼哈顿距离，求连通所有点的最小总成本（最小生成树）。
// 时间复杂度：Prim O(n^2)，Kruskal O(n^2 log n)

// ============================================================
// 方法1：Prim 算法（稠密图，邻接矩阵，推荐）
// 时间复杂度：O(n^2)，空间复杂度：O(n)
// ============================================================
function minCostConnectPoints1(points: number[][]): number {
  const n = points.length;
  const dist = (a: number[], b: number[]): number =>
    Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

  const minDist = new Array<number>(n).fill(Infinity);
  const visited = new Array<boolean>(n).fill(false);
  minDist[0] = 0;
  let total = 0;

  for (let i = 0; i < n; i++) {
    // 选出未访问中距离最小的点
    let u = -1;
    for (let j = 0; j < n; j++) {
      if (!visited[j] && (u === -1 || minDist[j] < minDist[u])) {
        u = j;
      }
    }
    visited[u] = true;
    total += minDist[u];

    // 更新其它点到 MST 的距离
    for (let v = 0; v < n; v++) {
      if (!visited[v]) {
        const d = dist(points[u], points[v]);
        if (d < minDist[v]) {
          minDist[v] = d;
        }
      }
    }
  }
  return total;
}

// ============================================================
// 方法2：Kruskal 算法（边排序 + 并查集）
// 时间复杂度：O(n^2 log n)，空间复杂度：O(n^2)
// ============================================================
class UF {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array<number>(n).fill(0);
  }
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }
  union(x: number, y: number): boolean {
    const px = this.find(x);
    const py = this.find(y);
    if (px === py) return false;
    if (this.rank[px] < this.rank[py]) this.parent[px] = py;
    else if (this.rank[px] > this.rank[py]) this.parent[py] = px;
    else {
      this.parent[py] = px;
      this.rank[px]++;
    }
    return true;
  }
}

function minCostConnectPoints2(points: number[][]): number {
  const n = points.length;
  const edges: number[][] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d =
        Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
      edges.push([d, i, j]);
    }
  }
  edges.sort((a, b) => a[0] - b[0]);

  const uf = new UF(n);
  let total = 0;
  let count = 0;
  for (const [d, i, j] of edges) {
    if (uf.union(i, j)) {
      total += d;
      count++;
      if (count === n - 1) break;
    }
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 063. 连接所有点的最小费用 =====");
console.log(
  minCostConnectPoints1([
    [0, 0],
    [2, 2],
    [3, 10],
    [5, 2],
    [7, 0],
  ]),
);
// 期望: 20
console.log(
  minCostConnectPoints1([
    [3, 12],
    [-2, 5],
    [-4, 1],
  ]),
);
// 期望: 18
console.log(
  minCostConnectPoints2([
    [0, 0],
    [2, 2],
    [3, 10],
    [5, 2],
    [7, 0],
  ]),
);
// 期望: 20

export {};
