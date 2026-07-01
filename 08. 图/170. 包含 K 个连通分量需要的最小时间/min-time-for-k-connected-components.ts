// 170. 包含 K 个连通分量需要的最小时间
// n 节点无向 edges，删边使恰好 k 个连通分量，求最小删边数。
// 解法：并查集保留 n-k 条边（保留尽量多边使连通分量少）。
// 注：题目求"最小时间"理解为最小删边数；若需恰好 k 个连通分量，则需保留 n-k 条边。

class UF170 {
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
  components(): number {
    const set = new Set<number>();
    for (let i = 0; i < this.parent.length; i++) set.add(this.find(i));
    return set.size;
  }
}

function minTimeForKConnectedComponents(n: number, edges: [number, number][], k: number): number {
  // 初始所有边都存在：删边使连通分量从初始变为 k。
  // 初始连通分量 c0，每删一条"桥式"边（在生成森林中）连通分量 +1。
  // 需要至少 max(0, k - c0) 次删边，且需检查可达性。
  const uf = new UF170(n);
  let kept = 0;
  // 任意保留 n - k 条边（若有这么多）
  for (const [u, v] of edges) {
    if (kept >= n - k) break;
    if (uf.union(u, v)) kept++;
  }
  const comps = uf.components();
  if (comps === k) return edges.length - kept; // 删边数
  if (comps < k) return -1; // 即使删掉所有非树边也无法达到 k（删非树边不增连通分量）
  // comps > k 说明边不够连接，需补边；这里只讨论删边，返回 -1
  return -1;
}

// 方法二：并查集保留 n-k 条边（贪心保留，统计删边数）
function minTimeForKConnectedComponentsV2(n: number, edges: [number, number][], k: number): number {
  if (k > n) return -1;
  const uf = new UF170(n);
  let kept = 0;
  for (const [u, v] of edges) {
    if (kept >= n - k) break;
    if (uf.union(u, v)) kept++;
  }
  if (uf.components() !== k) return -1;
  return edges.length - kept;
}

// 测试
console.log(
  minTimeForKConnectedComponents(
    5,
    [
      [0, 1],
      [1, 2],
      [3, 4],
      [0, 3],
    ],
    2,
  ),
);
console.log(
  minTimeForKConnectedComponentsV2(
    5,
    [
      [0, 1],
      [1, 2],
      [3, 4],
      [0, 3],
    ],
    2,
  ),
);

export {};
