// ============================================================
// 185. 找到最小生成树里的关键边和伪关键边
// ============================================================
// LeetCode 1489. Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree
// 给定 n 个节点和边数组 edges（每条边 [u, v, weight]，带原始下标）。
// 关键边：出现在所有 MST 中；伪关键边：出现在某些 MST 中但不是所有。
// 返回 [关键边列表, 伪关键边列表]（按下标排序）。

class UnionFind {
  parent: number[];
  rank: number[];
  components: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.components = n;
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

// 方法1：Kruskal + 对比每条边是否包含/排除（O(m^2 α(n))）
function findCriticalAndPseudoCriticalEdges(n: number, edges: number[][]): number[][] {
  const m = edges.length;
  // 给每条边加上原始下标后按权重排序
  const indexed = edges.map((e, i) => [e[0], e[1], e[2], i] as const);
  indexed.sort((a, b) => a[2] - b[2]);

  // 标准 Kruskal 计算 MST 权重
  const kruskal = (exclude: number, forceInclude: number): { weight: number; ok: boolean } => {
    const uf = new UnionFind(n);
    let weight = 0;
    let usedEdges = 0;
    if (forceInclude !== -1) {
      const e = edges[forceInclude];
      if (uf.union(e[0], e[1])) {
        weight += e[2];
        usedEdges++;
      }
    }
    for (const [u, v, w, idx] of indexed) {
      if (idx === exclude) continue;
      if (idx === forceInclude) continue;
      if (uf.union(u, v)) {
        weight += w;
        usedEdges++;
      }
    }
    return { weight, ok: usedEdges === n - 1 };
  };

  const base = kruskal(-1, -1);
  const baseWeight = base.weight;

  const critical: number[] = [];
  const pseudo: number[] = [];
  for (let i = 0; i < m; i++) {
    // 排除边 i
    const without = kruskal(i, -1);
    if (!without.ok || without.weight > baseWeight) {
      critical.push(i);
      continue;
    }
    // 强制包含边 i
    const withForce = kruskal(-1, i);
    if (withForce.ok && withForce.weight === baseWeight) {
      pseudo.push(i);
    }
  }
  return [critical, pseudo];
}

// 方法2：并查集 + 边权重分组处理（O(m^2 α(n))）
// 按 (weight, idx) 排序后逐组处理同权重边，思路与 Kruskal 类似但更紧凑。
function findCriticalAndPseudoCriticalEdges2(n: number, edges: number[][]): number[][] {
  const m = edges.length;
  const order = edges.map((e, i) => i).sort((a, b) => edges[a][2] - edges[b][2] || a - b);

  const buildMST = (exclude: number, force: number): number => {
    const uf = new UnionFind(n);
    let weight = 0;
    let count = 0;
    const tryEdge = (idx: number): void => {
      const e = edges[idx];
      if (uf.union(e[0], e[1])) {
        weight += e[2];
        count++;
      }
    };
    if (force !== -1) tryEdge(force);
    for (const idx of order) {
      if (idx === exclude || idx === force) continue;
      tryEdge(idx);
    }
    return count === n - 1 ? weight : Infinity;
  };

  const baseWeight = buildMST(-1, -1);
  const critical: number[] = [];
  const pseudo: number[] = [];
  for (let i = 0; i < m; i++) {
    const without = buildMST(i, -1);
    if (without > baseWeight) {
      critical.push(i);
    } else {
      const withForce = buildMST(-1, i);
      if (withForce === baseWeight) {
        pseudo.push(i);
      }
    }
  }
  return [critical, pseudo];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 185. 找到最小生成树里的关键边和伪关键边 =====");
console.log(
  "方法1 n=5, edges=[[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]:",
  findCriticalAndPseudoCriticalEdges(5, [
    [0, 1, 1],
    [1, 2, 1],
    [2, 3, 2],
    [0, 3, 2],
    [0, 4, 3],
    [3, 4, 3],
    [1, 4, 6],
  ]),
); // [[0,1],[2,3,4,5]]
console.log(
  "方法1 n=4, edges=[[0,1,1],[1,2,1],[2,3,1],[0,3,1]]:",
  findCriticalAndPseudoCriticalEdges(4, [
    [0, 1, 1],
    [1, 2, 1],
    [2, 3, 1],
    [0, 3, 1],
  ]),
); // [[],[0,1,2,3]]
console.log(
  "方法2 n=5, edges=[[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]:",
  findCriticalAndPseudoCriticalEdges2(5, [
    [0, 1, 1],
    [1, 2, 1],
    [2, 3, 2],
    [0, 3, 2],
    [0, 4, 3],
    [3, 4, 3],
    [1, 4, 6],
  ]),
); // [[0,1],[2,3,4,5]]

export {};
