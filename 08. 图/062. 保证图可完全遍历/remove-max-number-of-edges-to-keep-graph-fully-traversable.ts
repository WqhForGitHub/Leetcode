// ============================================================
// 062. 保证图可完全遍历
// ============================================================
// LeetCode 1579. Remove Max Number of Edges to Keep Graph Fully Traversable
// n 个节点，edges 中 type 1 为 Alice 独享，type 2 为 Bob 独享，type 3 为共享。
// Alice 和 Bob 都能完全遍历全图，最多可删除多少边。
// 时间复杂度：O(e * α(n))，空间复杂度：O(n)

class UnionFind {
  parent: number[];
  rank: number[];
  components: number;

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

  // 返回是否成功合并（之前不连通）
  union(x: number, y: number): boolean {
    const px = this.find(x);
    const py = this.find(y);
    if (px === py) {
      return false;
    }
    if (this.rank[px] < this.rank[py]) {
      this.parent[px] = py;
    } else if (this.rank[px] > this.rank[py]) {
      this.parent[py] = px;
    } else {
      this.parent[py] = px;
      this.rank[px]++;
    }
    this.components--;
    return true;
  }
}

// ============================================================
// 方法1：并查集（先共享边，再分别补独享边）（推荐）
// ============================================================
function maxNumEdgesToRemove1(n: number, edges: number[][]): number {
  // 按 type 降序排序，先处理 type 3 共享边
  edges.sort((a, b) => b[0] - a[0]);

  const alice = new UnionFind(n);
  const bob = new UnionFind(n);
  let used = 0; // 实际使用的边数

  for (const [type, u, v] of edges) {
    if (type === 3) {
      // 共享边：Alice 和 Bob 都尝试合并
      const aMerged = alice.union(u - 1, v - 1);
      const bMerged = bob.union(u - 1, v - 1);
      if (aMerged || bMerged) {
        used++;
      }
    } else if (type === 1) {
      // Alice 独享边
      if (alice.union(u - 1, v - 1)) {
        used++;
      }
    } else {
      // Bob 独享边
      if (bob.union(u - 1, v - 1)) {
        used++;
      }
    }
  }

  // 检查两人是否都能完全遍历（连通分量数为 1）
  if (alice.components !== 1 || bob.components !== 1) {
    return -1;
  }
  return edges.length - used;
}

// ============================================================
// 方法2：分两轮并查集（共享边单独统计）
// ============================================================
function maxNumEdgesToRemove2(n: number, edges: number[][]): number {
  const shared: number[][] = [];
  const aliceEdges: number[][] = [];
  const bobEdges: number[][] = [];
  for (const [t, u, v] of edges) {
    if (t === 3) {
      shared.push([u - 1, v - 1]);
    } else if (t === 1) {
      aliceEdges.push([u - 1, v - 1]);
    } else {
      bobEdges.push([u - 1, v - 1]);
    }
  }

  // 第一轮：用共享边连通两人
  const alice = new UnionFind(n);
  const bob = new UnionFind(n);
  let used = 0;
  for (const [u, v] of shared) {
    const aM = alice.union(u, v);
    const bM = bob.union(u, v);
    if (aM || bM) {
      used++;
    }
  }

  // 第二轮：Alice 用 type1 补全
  for (const [u, v] of aliceEdges) {
    if (alice.union(u, v)) {
      used++;
    }
  }
  // Bob 用 type2 补全
  for (const [u, v] of bobEdges) {
    if (bob.union(u, v)) {
      used++;
    }
  }

  if (alice.components !== 1 || bob.components !== 1) {
    return -1;
  }
  return edges.length - used;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 062. 保证图可完全遍历 =====");
console.log(
  maxNumEdgesToRemove1(4, [
    [3, 1, 2],
    [3, 2, 3],
    [1, 1, 3],
    [1, 2, 4],
    [1, 1, 2],
    [2, 3, 4],
  ]),
);
// 期望: 2
console.log(
  maxNumEdgesToRemove1(4, [
    [3, 1, 2],
    [3, 2, 3],
    [1, 1, 4],
    [2, 1, 4],
  ]),
);
// 期望: 0
console.log(
  maxNumEdgesToRemove2(4, [
    [3, 2, 3],
    [1, 1, 2],
    [2, 3, 4],
  ]),
);
// 期望: -1

export {};
