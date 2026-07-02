// ============================================================
// 218. 检查边长度限制的路径是否存在 II
// ============================================================
// LeetCode 1724. Checking Existence of Edge Length Limited Paths II
// 在线版本：构造时给定 n 与带权边 edgeList，
// 之后可多次调用 query(u, v, limit)，判断是否存在所有边权都 < limit 的路径。

// 方法1：并查集 + 快照版本化（构造 O(E log E)，查询 O(log S + α(n))）
// 按 edgeList 权重升序逐步合并，每次成功合并保存一份并查集快照，
// 查询时二分找到权重 < limit 的最新快照即可。
class DistanceLimitedPathsList {
  private snapshots: { weight: number; parent: number[] }[];

  constructor(n: number, edgeList: number[][]) {
    const sortedEdges = [...edgeList].sort((a, b) => a[2] - b[2]);
    const initParent: number[] = Array.from({ length: n }, (_, i) => i);
    this.snapshots = [{ weight: 0, parent: [...initParent] }];
    const parent = [...initParent];
    const find = (p: number[], x: number): number => {
      while (p[x] !== x) {
        p[x] = p[p[x]];
        x = p[x];
      }
      return x;
    };
    for (const [u, v, w] of sortedEdges) {
      const ru = find(parent, u);
      const rv = find(parent, v);
      if (ru !== rv) {
        parent[ru] = rv;
        this.snapshots.push({ weight: w, parent: [...parent] });
      }
    }
  }

  query(u: number, v: number, limit: number): boolean {
    // 二分找最大的 weight < limit 的快照
    let lo = 0;
    let hi = this.snapshots.length - 1;
    let idx = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (this.snapshots[mid].weight < limit) {
        idx = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    const parent = this.snapshots[idx].parent;
    const find = (x: number): number => {
      while (parent[x] !== x) x = parent[x];
      return x;
    };
    return find(u) === find(v);
  }
}

// 方法2：Kruskal 重构树 + 倍增 LCA（构造 O(E log E + n log n)，查询 O(log n)）
// 合并两连通块时新建一个权值为边权的内部节点作为两块根的父亲，
// u 与 v 在重构树上的 LCA 权值即为连通它们的最小瓶颈边权。
class DistanceLimitedPathsList2 {
  private LOG: number;
  private up: number[][];
  private weight: number[];
  private depth: number[];
  private nodeCount: number;

  constructor(n: number, edgeList: number[][]) {
    const sortedEdges = [...edgeList].sort((a, b) => a[2] - b[2]);
    const maxNodes = 2 * n;
    this.weight = new Array<number>(maxNodes).fill(0);
    this.depth = new Array<number>(maxNodes).fill(0);
    this.nodeCount = n;
    const ufParent: number[] = Array.from({ length: maxNodes }, (_, i) => i);
    const find = (x: number): number => {
      while (ufParent[x] !== x) {
        ufParent[x] = ufParent[ufParent[x]];
        x = ufParent[x];
      }
      return x;
    };
    const children: number[][] = Array.from({ length: maxNodes }, () => []);
    for (const [u, v, w] of sortedEdges) {
      const ru = find(u);
      const rv = find(v);
      if (ru !== rv) {
        const newNode = this.nodeCount++;
        this.weight[newNode] = w;
        children[newNode].push(ru);
        children[newNode].push(rv);
        ufParent[ru] = newNode;
        ufParent[rv] = newNode;
      }
    }
    // 计算 LOG
    this.LOG = 1;
    while (1 << this.LOG < this.nodeCount) this.LOG++;
    this.LOG += 1;
    this.up = Array.from({ length: this.LOG }, () => new Array<number>(maxNodes).fill(-1));
    // BFS 建立深度和 up[0]
    const hasParent = new Array<boolean>(maxNodes).fill(false);
    for (let i = n; i < this.nodeCount; i++) {
      for (const c of children[i]) hasParent[c] = true;
    }
    const queue: number[] = [];
    for (let i = 0; i < this.nodeCount; i++) {
      if (!hasParent[i]) {
        this.depth[i] = 0;
        queue.push(i);
      }
    }
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const c of children[u]) {
        this.depth[c] = this.depth[u] + 1;
        this.up[0][c] = u;
        queue.push(c);
      }
    }
    // 倍增预处理
    for (let k = 1; k < this.LOG; k++) {
      for (let v = 0; v < this.nodeCount; v++) {
        if (this.up[k - 1][v] !== -1) {
          this.up[k][v] = this.up[k - 1][this.up[k - 1][v]];
        }
      }
    }
  }

  private getRoot(x: number): number {
    let cur = x;
    while (this.up[0][cur] !== -1) cur = this.up[0][cur];
    return cur;
  }

  private lca(u: number, v: number): number {
    let a = u;
    let b = v;
    if (this.depth[a] < this.depth[b]) {
      const t = a;
      a = b;
      b = t;
    }
    const diff = this.depth[a] - this.depth[b];
    for (let k = 0; k < this.LOG; k++) {
      if ((diff >> k) & 1) a = this.up[k][a];
    }
    if (a === b) return a;
    for (let k = this.LOG - 1; k >= 0; k--) {
      if (this.up[k][a] !== this.up[k][b]) {
        a = this.up[k][a];
        b = this.up[k][b];
      }
    }
    return this.up[0][a];
  }

  query(u: number, v: number, limit: number): boolean {
    if (u === v) return true;
    if (this.getRoot(u) !== this.getRoot(v)) return false;
    const l = this.lca(u, v);
    return this.weight[l] < limit;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 218. 检查边长度限制的路径是否存在 II =====");
const dlp1 = new DistanceLimitedPathsList(3, [
  [0, 1, 2],
  [1, 2, 4],
  [2, 0, 8],
  [1, 0, 16],
]);
console.log("方法1 query(0,1,2):", dlp1.query(0, 1, 2)); // false
console.log("方法1 query(0,2,5):", dlp1.query(0, 2, 5)); // true
const dlp2 = new DistanceLimitedPathsList2(3, [
  [0, 1, 2],
  [1, 2, 4],
  [2, 0, 8],
  [1, 0, 16],
]);
console.log("方法2 query(0,1,2):", dlp2.query(0, 1, 2)); // false
console.log("方法2 query(0,2,5):", dlp2.query(0, 2, 5)); // true

export {};
