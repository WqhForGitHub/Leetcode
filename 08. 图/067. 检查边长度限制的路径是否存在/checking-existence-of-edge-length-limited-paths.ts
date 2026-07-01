// ============================================================
// 067. 检查边长度限制的路径是否存在
// ============================================================
// LeetCode 1697. Checking Existence of Edge Length Limited Paths
// n 个节点，edgeList 带权无向边，queries = [p, q, limit]。判断 p, q 是否存在
// 一条路径，其中所有边权都 < limit。离线处理。
// 时间复杂度：O((e + q) * α(n) + q log q + e log e)，空间复杂度：O(n + q)

class UF1697 {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array<number>(n).fill(0);
  }
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x: number, y: number): void {
    const px = this.find(x);
    const py = this.find(y);
    if (px === py) return;
    if (this.rank[px] < this.rank[py]) this.parent[px] = py;
    else if (this.rank[px] > this.rank[py]) this.parent[py] = px;
    else {
      this.parent[py] = px;
      this.rank[px]++;
    }
  }
  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}

// ============================================================
// 方法1：离线 + 并查集（queries 按 limit 排序，边按权排序）（推荐）
// ============================================================
function distanceLimitedPathsExist1(
  n: number,
  edgeList: number[][],
  queries: number[][],
): boolean[] {
  // 给每个 query 记录原始下标
  const indexed = queries.map((q, i) => [q[0], q[1], q[2], i]);
  // 按 limit 升序
  indexed.sort((a, b) => a[2] - b[2]);
  // 边按权升序
  edgeList.sort((a, b) => a[2] - b[2]);

  const uf = new UF1697(n);
  const result = new Array<boolean>(queries.length).fill(false);
  let ei = 0;
  for (const [p, q, limit, idx] of indexed) {
    // 把所有边权 < limit 的边加入并查集
    while (ei < edgeList.length && edgeList[ei][2] < limit) {
      uf.union(edgeList[ei][0], edgeList[ei][1]);
      ei++;
    }
    result[idx] = uf.connected(p, q);
  }
  return result;
}

// ============================================================
// 方法2：离线 + 并查集（边按权升序，二分定位每个 query 的边界）
// ============================================================
function distanceLimitedPathsExist2(
  n: number,
  edgeList: number[][],
  queries: number[][],
): boolean[] {
  edgeList.sort((a, b) => a[2] - b[2]);
  const order = queries.map((q, i) => [q[2], i]).sort((a, b) => a[0] - b[0]);

  const uf = new UF1697(n);
  const result = new Array<boolean>(queries.length).fill(false);
  let ei = 0;
  for (const [limit, idx] of order) {
    while (ei < edgeList.length && edgeList[ei][2] < limit) {
      uf.union(edgeList[ei][0], edgeList[ei][1]);
      ei++;
    }
    result[idx] = uf.connected(queries[idx][0], queries[idx][1]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 067. 检查边长度限制的路径是否存在 =====");
console.log(
  distanceLimitedPathsExist1(
    3,
    [
      [0, 1, 2],
      [1, 2, 4],
      [2, 0, 8],
      [1, 0, 16],
    ],
    [
      [0, 1, 2],
      [0, 2, 5],
    ],
  ),
);
// 期望: [false, true]
console.log(
  distanceLimitedPathsExist1(
    5,
    [
      [0, 1, 10],
      [1, 2, 5],
      [2, 3, 9],
      [3, 4, 13],
    ],
    [
      [0, 4, 14],
      [1, 4, 13],
    ],
  ),
);
// 期望: [true, false]
console.log(
  distanceLimitedPathsExist2(
    3,
    [
      [0, 1, 2],
      [1, 2, 4],
      [2, 0, 8],
      [1, 0, 16],
    ],
    [
      [0, 1, 2],
      [0, 2, 5],
    ],
  ),
);
// 期望: [false, true]

export {};
