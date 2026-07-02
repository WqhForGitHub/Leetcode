// ============================================================
// 135. 彼此熟识的最早时间
// ============================================================
// LeetCode 1101. The Earliest Moment When Everyone Become Friends
// 给定日志 logs[i] = [timestamp, a, b] 表示 a 与 b 在该时刻成为朋友，
// 朋友关系有传递性。返回所有人成为朋友（连通）的最早时间戳；若无法全部
// 连通则返回 -1。

// 并查集（带路径压缩与按秩合并）
class UnionFind {
  private parent: number[];
  private rank: number[];
  private components: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array<number>(n).fill(0);
    this.components = n;
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return false;
    if (this.rank[rx] < this.rank[ry]) {
      this.parent[rx] = ry;
    } else if (this.rank[rx] > this.rank[ry]) {
      this.parent[ry] = rx;
    } else {
      this.parent[ry] = rx;
      this.rank[rx]++;
    }
    this.components--;
    return true;
  }

  count(): number {
    return this.components;
  }
}

// 方法1：按时间排序 + 并查集（O(n log n + n * α)）
// 按时间戳升序处理每条日志，合并两端点；当连通分量数变为 1 时返回该时间戳。
function earliestAcq(logs: number[][], n: number): number {
  // 按时间戳升序处理
  const sorted = [...logs].sort((a, b) => a[0] - b[0]);
  const uf = new UnionFind(n);
  for (const [ts, a, b] of sorted) {
    uf.union(a, b);
    if (uf.count() === 1) return ts;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 135. 彼此熟识的最早时间 =====");
console.log(
  earliestAcq(
    [
      [20190101, 0, 1],
      [20190104, 3, 4],
      [20190107, 2, 3],
      [20190211, 1, 5],
      [20190224, 2, 4],
      [20190301, 0, 3],
      [20190312, 1, 2],
    ],
    6,
  ),
); // 期望: 20190301
console.log(
  earliestAcq(
    [
      [0, 2, 0],
      [1, 0, 1],
      [3, 0, 3],
      [3, 1, 3],
      [2, 2, 1],
      [4, 2, 3],
    ],
    4,
  ),
); // 期望: 3

export {};
