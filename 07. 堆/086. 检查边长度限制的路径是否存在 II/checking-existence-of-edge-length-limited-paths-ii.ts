// ============================================================
// 086. 检查边长度限制的路径是否存在 II
// ============================================================
// LeetCode 1724. Checking Existence of Edge Length Limited Paths II
// 在线查询两点间是否存在路径使所有边权 < limit。
// 时间复杂度：build O(E log E)，query O(log N)

// 方法1：Kruskal 重构树（最小生成树）
class DistanceLimitedPathsExist {
  private parent: number[] = [];
  private depth: number[] = [];
  private weight: number[] = [];
  private up: number[][] = [];
  private LOG: number = 0;
  constructor(n: number, edgeList: number[][]) {
    edgeList.sort((a, b) => a[2] - b[2]);
    const par: number[] = new Array(2 * n).fill(0).map((_, i) => i);
    const find = (x: number): number => {
      while (par[x] !== x) {
        par[x] = par[par[x]];
        x = par[x];
      }
      return x;
    };
    const w: number[] = new Array(2 * n).fill(0);
    let nodeCount = n;
    for (const [u, v, dis] of edgeList) {
      const pu = find(u);
      const pv = find(v);
      if (pu !== pv) {
        const newNode = nodeCount++;
        par[pu] = newNode;
        par[pv] = newNode;
        w[newNode] = dis;
      }
    }
    this.LOG = Math.ceil(Math.log2(nodeCount)) + 1;
    this.up = Array.from({ length: nodeCount }, () => new Array(this.LOG).fill(-1));
    this.weight = w;
    this.depth = new Array(nodeCount).fill(0);
    this.parent = par;
    // BFS 建树
    const roots: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      if (par[i] === i) roots.push(i);
    }
    for (const root of roots) {
      const queue: number[] = [root];
      let head = 0;
      while (head < queue.length) {
        const u = queue[head++];
        for (let i = 1; i < this.LOG; i++) {
          if (this.up[u][i - 1] !== -1) this.up[u][i] = this.up[this.up[u][i - 1]][i - 1];
        }
        for (let v = 0; v < nodeCount; v++) {
          if (par[v] === u && v !== u) {
            this.depth[v] = this.depth[u] + 1;
            this.up[v][0] = u;
            queue.push(v);
          }
        }
      }
    }
  }
  isConnected(p: number, q: number, limit: number): boolean {
    return this.getLimit(p, limit) === this.getLimit(q, limit);
  }
  private getLimit(u: number, limit: number): number {
    for (let i = this.LOG - 1; i >= 0; i--) {
      const anc = this.up[u][i];
      if (anc !== -1 && this.weight[anc] < limit) u = anc;
    }
    return u;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 086. 检查边长度限制的路径是否存在 II =====");
const dlp = new DistanceLimitedPathsExist(6, [
  [0, 2, 4],
  [0, 3, 2],
  [1, 2, 3],
  [2, 3, 1],
  [4, 5, 5],
]);
console.log("查询:", dlp.isConnected(2, 3, 2)); // 期望 true
console.log("查询:", dlp.isConnected(0, 5, 10)); // 期望 false

export {};
