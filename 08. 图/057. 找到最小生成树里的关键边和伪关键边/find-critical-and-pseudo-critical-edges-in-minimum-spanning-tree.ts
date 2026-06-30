// ============================================================
// 057. 找到最小生成树里的关键边和伪关键边
// ============================================================
// LeetCode 1489. Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree
// n 个节点，edges[i]=[u,v,w]。返回 [关键边索引, 伪关键边索引]。
// 关键边：所有 MST 都包含；伪关键边：至少一个 MST 包含但非关键。
// 时间复杂度：O(E^2 α(E))（每条边各做一次 Kruskal），空间复杂度：O(E)

// 带原始索引的边
type IndexedEdge = { u: number; v: number; w: number; idx: number };

class UF {
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

// Kruskal：可选强制包含/排除某条边（按索引在 sortedEdges 中的位置 excludeIdx / includeIdx）
function kruskal(
  n: number,
  sortedEdges: IndexedEdge[],
  excludeIdx: number = -1,
  includeIdx: number = -1,
): { weight: number; count: number } {
  const uf = new UF(n);
  let weight = 0;
  let count = 0; // 已加入的边数

  if (includeIdx !== -1) {
    const e = sortedEdges[includeIdx];
    if (uf.union(e.u, e.v)) {
      weight += e.w;
      count++;
    } else {
      // 该边构成环，无法被包含 -> 视为不可达 MST（返回大值）
      return { weight: Number.POSITIVE_INFINITY, count };
    }
  }

  for (let i = 0; i < sortedEdges.length; i++) {
    if (i === excludeIdx || i === includeIdx) continue;
    const e = sortedEdges[i];
    if (uf.union(e.u, e.v)) {
      weight += e.w;
      count++;
      if (count === n - 1) break;
    }
  }
  // 未能连通所有节点 -> 不构成 MST
  if (count !== n - 1) return { weight: Number.POSITIVE_INFINITY, count };
  return { weight, count };
}

// ============================================================
// 方法1：Kruskal + 逐边判定（推荐）
// 时间复杂度：O(E^2 α(E))，空间复杂度：O(E)
// ============================================================
function findCriticalAndPseudoCriticalEdges(
  n: number,
  edges: number[][],
): number[][] {
  const m = edges.length;
  // 附原始索引
  const indexed: IndexedEdge[] = edges.map((e, i) => ({ u: e[0], v: e[1], w: e[2], idx: i }));
  // 按权值排序（稳定：相同权值时保持原顺序，不影响判定正确性）
  const sorted = indexed.slice().sort((a, b) => a.w - b.w);

  // 原始 MST 权值
  const base = kruskal(n, sorted);
  const baseWeight = base.weight;

  const critical: number[] = [];
  const pseudo: number[] = [];

  for (let i = 0; i < m; i++) {
    // 排除该边后的 MST 权值
    const withoutIt = kruskal(n, sorted, i);
    if (withoutIt.weight > baseWeight) {
      // 删除后 MST 变大（或不可达）-> 关键边
      critical.push(sorted[i].idx);
    } else {
      // 否则检查是否可属于某个 MST：强制包含该边
      const withIt = kruskal(n, sorted, -1, i);
      if (withIt.weight === baseWeight) {
        // 至少一个 MST 包含 -> 伪关键边
        pseudo.push(sorted[i].idx);
      }
    }
  }

  return [critical, pseudo];
}

// ============================================================
// 方法2：Kruskal + 连通分量等价类判定（同一轮可互换的边）
// 时间复杂度：O(E log E + E α(E))，空间复杂度：O(E)
// 思路：按权值分轮处理。同一权值轮内，对每条边判断：
//   - 若两端点在"上一轮结束时的 UF"中已连通 -> 该边无贡献（成环），跳过
//   - 否则该边在某 MST 中被使用（伪关键候选）
//   - 若该边是"必须"的（其两端点在该轮所有等价边处理完后仍跨分量）-> 关键
// 这里给出简化版实现，与方法1互为对照。
// ============================================================
function findCriticalAndPseudoCriticalEdgesAdvanced(
  n: number,
  edges: number[][],
): number[][] {
  const m = edges.length;
  const indexed: IndexedEdge[] = edges.map((e, i) => ({ u: e[0], v: e[1], w: e[2], idx: i }));
  const sorted = indexed.slice().sort((a, b) => a.w - b.w);

  const ufFinal = new UF(n); // 最终 MST 的并查集
  let i = 0;
  const critical: number[] = [];
  const pseudo: number[] = [];

  while (i < m) {
    // 找到同一权值的边段 [i, j)
    let j = i;
    while (j < m && sorted[j].w === sorted[i].w) j++;

    // 1) 用"上轮结束时的 UF"快照判断每条边是否跨分量
    const ufBefore = new UF(n);
    ufBefore.parent = ufFinal.parent.slice();
    ufBefore.rank = ufFinal.rank.slice();

    // 跨分量的边（候选使用边）
    const crossing: IndexedEdge[] = [];
    for (let k = i; k < j; k++) {
      const e = sorted[k];
      if (ufBefore.find(e.u) !== ufBefore.find(e.v)) crossing.push(e);
    }

    // 2) 在该轮内把所有跨分量边合并，得到该轮结束后的连通状态
    const ufAfter = new UF(n);
    ufAfter.parent = ufFinal.parent.slice();
    ufAfter.rank = ufFinal.rank.slice();
    for (const e of crossing) ufAfter.union(e.u, e.v);

    // 3) 对每条跨分量边：判断是否关键
    //    关键 <=> 删去它后，用本轮其它跨分量边仍无法合并其两端点
    for (const e of crossing) {
      const ufTmp = new UF(n);
      ufTmp.parent = ufFinal.parent.slice();
      ufTmp.rank = ufFinal.rank.slice();
      for (const other of crossing) {
        if (other.idx === e.idx) continue;
        ufTmp.union(other.u, other.v);
      }
      if (ufTmp.find(e.u) !== ufTmp.find(e.v)) {
        // 删去后无法连通 -> 关键
        critical.push(e.idx);
      } else {
        // 可被替换但仍属于某 MST -> 伪关键
        pseudo.push(e.idx);
      }
    }

    // 4) 推进 ufFinal 到本轮结束后状态
    ufFinal.parent = ufAfter.parent;
    ufFinal.rank = ufAfter.rank;

    i = j;
  }

  return [critical, pseudo];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 057. 找到最小生成树里的关键边和伪关键边 =====");
// 测试1: n=5, edges=[[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]
//   MST 权值=7。关键边：[0,1]；伪关键边：[2,3,4,5]
console.log(
  findCriticalAndPseudoCriticalEdges(5, [
    [0, 1, 1],
    [1, 2, 1],
    [2, 3, 2],
    [0, 3, 2],
    [0, 4, 3],
    [3, 4, 3],
    [1, 4, 6],
  ]),
); // 期望 [[0,1],[2,3,4,5]]
console.log(
  findCriticalAndPseudoCriticalEdgesAdvanced(5, [
    [0, 1, 1],
    [1, 2, 1],
    [2, 3, 2],
    [0, 3, 2],
    [0, 4, 3],
    [3, 4, 3],
    [1, 4, 6],
  ]),
); // 期望 [[0,1],[2,3,4,5]]
// 测试2: n=4, edges=[[0,1,1],[1,2,2],[2,3,3],[0,3,4]] -> 全是关键 [[0,1,2],[]]
console.log(
  findCriticalAndPseudoCriticalEdges(4, [[0, 1, 1], [1, 2, 2], [2, 3, 3], [0, 3, 4]]),
); // 期望 [[0,1,2],[]]

export {};
