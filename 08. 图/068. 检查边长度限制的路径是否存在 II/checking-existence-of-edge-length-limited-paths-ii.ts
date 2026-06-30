// ============================================================
// 068. 检查边长度限制的路径是否存在 II
// ============================================================
// LeetCode 1724. Checking Existence of Edge Length Limited Paths II
// 上一题的在线版本。实现 DistanceLimitedNeighbors 类：构造后多次调用
// query(p, limit) 返回从 p 出发仅使用边权 < limit 的边能到达的节点数。
// 使用 Kruskal 重构树 + 倍增 LCA。
// 时间复杂度：构造 O(e log e)，查询 O(log n)；空间复杂度：O(n)

// ============================================================
// 方法1：Kruskal 重构树 + 倍增爬升（推荐）
// ============================================================
class DistanceLimitedNeighbors1 {
  private parent: number[][]; // parent[k][node] 倍增祖先
  private weight: number[]; // 节点权值（内部节点=合并边的权，叶子=0）
  private size: number[]; // 子树包含的叶子数（即可达节点数）
  private maxLevel: number;
  private nodeCount: number;

  constructor(n: number, edgeList: number[][]) {
    const edges = [...edgeList].sort((a, b) => a[2] - b[2]);
    const maxNodes = 2 * n;

    this.weight = new Array<number>(maxNodes).fill(0);
    this.size = new Array<number>(maxNodes).fill(1); // 叶子节点初始 size=1
    const treeChildren: number[][] = Array.from({ length: maxNodes }, () => []);

    // 并查集（按当前重构树的根）
    const ufParent = new Array<number>(maxNodes);
    for (let i = 0; i < maxNodes; i++) ufParent[i] = i;
    const find = (x: number): number => {
      while (ufParent[x] !== x) {
        ufParent[x] = ufParent[ufParent[x]];
        x = ufParent[x];
      }
      return x;
    };

    let next = n; // 内部节点编号从 n 开始
    for (const [u, v, w] of edges) {
      const ru = find(u);
      const rv = find(v);
      if (ru !== rv) {
        const node = next++;
        this.weight[node] = w;
        this.size[node] = this.size[ru] + this.size[rv];
        treeChildren[node] = [ru, rv];
        ufParent[ru] = node;
        ufParent[rv] = node;
        ufParent[node] = node;
      }
    }
    this.nodeCount = next;

    // 构建倍增表
    this.maxLevel = this.nodeCount > 1 ? Math.floor(Math.log2(this.nodeCount)) + 1 : 1;
    this.parent = Array.from(
      { length: this.maxLevel + 1 },
      () => new Array<number>(maxNodes).fill(-1),
    );
    // parent[0]：直接父亲
    for (let node = n; node < this.nodeCount; node++) {
      for (const child of treeChildren[node]) {
        this.parent[0][child] = node;
      }
    }
    // 倍增
    for (let k = 1; k <= this.maxLevel; k++) {
      for (let node = 0; node < this.nodeCount; node++) {
        const p = this.parent[k - 1][node];
        if (p !== -1) this.parent[k][node] = this.parent[k - 1][p];
      }
    }
  }

  query(p: number, limit: number): number {
    let node = p;
    // 爬到权值 < limit 的最高祖先
    for (let k = this.maxLevel; k >= 0; k--) {
      const up = this.parent[k][node];
      if (up !== -1 && this.weight[up] < limit) {
        node = up;
      }
    }
    return this.size[node];
  }
}

// ============================================================
// 方法2：Kruskal 重构树 + 线性爬升（更直观，查询 O(深度)）
// ============================================================
class DistanceLimitedNeighbors2 {
  private parent0: number[]; // 直接父亲
  private weight: number[];
  private size: number[];
  private nodeCount: number;

  constructor(n: number, edgeList: number[][]) {
    const edges = [...edgeList].sort((a, b) => a[2] - b[2]);
    const maxNodes = 2 * n;

    this.weight = new Array<number>(maxNodes).fill(0);
    this.size = new Array<number>(maxNodes).fill(1);
    this.parent0 = new Array<number>(maxNodes).fill(-1);

    const ufParent = new Array<number>(maxNodes);
    for (let i = 0; i < maxNodes; i++) ufParent[i] = i;
    const find = (x: number): number => {
      while (ufParent[x] !== x) {
        ufParent[x] = ufParent[ufParent[x]];
        x = ufParent[x];
      }
      return x;
    };

    let next = n;
    const treeChildren: number[][] = Array.from({ length: maxNodes }, () => []);
    for (const [u, v, w] of edges) {
      const ru = find(u);
      const rv = find(v);
      if (ru !== rv) {
        const node = next++;
        this.weight[node] = w;
        this.size[node] = this.size[ru] + this.size[rv];
        treeChildren[node] = [ru, rv];
        ufParent[ru] = node;
        ufParent[rv] = node;
        ufParent[node] = node;
      }
    }
    this.nodeCount = next;

    for (let node = n; node < this.nodeCount; node++) {
      for (const child of treeChildren[node]) {
        this.parent0[child] = node;
      }
    }
  }

  query(p: number, limit: number): number {
    let node = p;
    // 沿父指针线性向上，直到父亲权值 >= limit 或无父亲
    while (this.parent0[node] !== -1 && this.weight[this.parent0[node]] < limit) {
      node = this.parent0[node];
    }
    return this.size[node];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 068. 检查边长度限制的路径是否存在 II =====");
const d1 = new DistanceLimitedNeighbors1(5, [
  [0, 1, 2],
  [1, 2, 4],
  [2, 3, 8],
  [3, 4, 16],
]);
console.log(d1.query(0, 3)); // 期望: 2
console.log(d1.query(0, 5)); // 期望: 3
console.log(d1.query(0, 9)); // 期望: 4
console.log(d1.query(0, 17)); // 期望: 5

const d2 = new DistanceLimitedNeighbors2(5, [
  [0, 1, 2],
  [1, 2, 4],
  [2, 3, 8],
  [3, 4, 16],
]);
console.log(d2.query(0, 5)); // 期望: 3
console.log(d2.query(0, 17)); // 期望: 5

export {};
