// ============================================================
// 216. 检查边长度限制的路径是否存在
// ============================================================
// LeetCode 1697. Checking Existence of Edge Length Limited Paths
// 给定无向带权图 edgeList 与若干查询 queries[i] = [u, v, limit]，
// 判断 u 与 v 之间是否存在一条所有边权都严格小于 limit 的路径。

// 方法1：查询按 limit 排序 + 离线并查集（O((E+Q) log(E+Q)))
function distanceLimitedPathsExist(
  n: number,
  edgeList: number[][],
  queries: number[][],
): boolean[] {
  const indexedQueries = queries.map((q, i) => ({ u: q[0], v: q[1], limit: q[2], i }));
  indexedQueries.sort((a, b) => a.limit - b.limit);
  const sortedEdges = [...edgeList].sort((a, b) => a[2] - b[2]);
  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const union = (a: number, b: number): void => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };
  const answer: boolean[] = new Array<boolean>(queries.length).fill(false);
  let edgeIdx = 0;
  for (const q of indexedQueries) {
    while (edgeIdx < sortedEdges.length && sortedEdges[edgeIdx][2] < q.limit) {
      union(sortedEdges[edgeIdx][0], sortedEdges[edgeIdx][1]);
      edgeIdx++;
    }
    answer[q.i] = find(q.u) === find(q.v);
  }
  return answer;
}

// 方法2：Kruskal 建 MST + 倍增 LCA 求路径最大边（O(E log E + Q log n)）
// MST 上两点路径的"最大边权"即为原图连通二者的"最小瓶颈"，
// 若该瓶颈 < limit 则存在满足条件的路径。
function distanceLimitedPathsExist2(
  n: number,
  edgeList: number[][],
  queries: number[][],
): boolean[] {
  const sortedEdges = [...edgeList].sort((a, b) => a[2] - b[2]);
  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  // Kruskal 构造 MST
  for (const [u, v, w] of sortedEdges) {
    const ru = find(u);
    const rv = find(v);
    if (ru !== rv) {
      parent[ru] = rv;
      adj[u].push([v, w]);
      adj[v].push([u, w]);
    }
  }
  // 计算 LOG
  let LOG = 1;
  while (1 << LOG < n) LOG++;
  LOG += 1;
  const depth: number[] = new Array<number>(n).fill(-1);
  const up: number[][] = Array.from({ length: LOG }, () => new Array<number>(n).fill(-1));
  const mx: number[][] = Array.from({ length: LOG }, () => new Array<number>(n).fill(0));
  // BFS 建立深度与 up[0]、mx[0]
  for (let s = 0; s < n; s++) {
    if (depth[s] !== -1) continue;
    depth[s] = 0;
    const queue: number[] = [s];
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const [v, w] of adj[u]) {
        if (depth[v] === -1) {
          depth[v] = depth[u] + 1;
          up[0][v] = u;
          mx[0][v] = w;
          queue.push(v);
        }
      }
    }
  }
  // 倍增预处理
  for (let k = 1; k < LOG; k++) {
    for (let v = 0; v < n; v++) {
      if (up[k - 1][v] !== -1) {
        up[k][v] = up[k - 1][up[k - 1][v]];
        mx[k][v] = Math.max(mx[k - 1][v], mx[k - 1][up[k - 1][v]]);
      }
    }
  }
  const getMaxEdge = (u: number, v: number): number => {
    if (depth[u] === -1 || depth[v] === -1) return Infinity;
    if (find(u) !== find(v)) return Infinity;
    let res = 0;
    let a = u;
    let b = v;
    if (depth[a] < depth[b]) {
      const t = a;
      a = b;
      b = t;
    }
    const diff = depth[a] - depth[b];
    for (let k = 0; k < LOG; k++) {
      if ((diff >> k) & 1) {
        res = Math.max(res, mx[k][a]);
        a = up[k][a];
      }
    }
    if (a === b) return res;
    for (let k = LOG - 1; k >= 0; k--) {
      if (up[k][a] !== -1 && up[k][a] !== up[k][b]) {
        res = Math.max(res, mx[k][a], mx[k][b]);
        a = up[k][a];
        b = up[k][b];
      }
    }
    res = Math.max(res, mx[0][a], mx[0][b]);
    return res;
  };
  return queries.map((q) => getMaxEdge(q[0], q[1]) < q[2]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 216. 检查边长度限制的路径是否存在 =====");
console.log(
  "方法1 n=3, edges=[[0,1,2],[1,2,4],[2,0,8],[1,0,16]], q=[[0,1,2],[0,2,5]]:",
  distanceLimitedPathsExist(
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
); // [false, true]
console.log(
  "方法2 n=3, edges=[[0,1,2],[1,2,4],[2,0,8],[1,0,16]], q=[[0,1,2],[0,2,5]]:",
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
); // [false, true]
console.log(
  "方法1 n=5, edges=[[0,1,10],[1,2,5],[2,3,9],[3,4,13]], q=[[0,4,14],[1,4,13]]:",
  distanceLimitedPathsExist(
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
); // [true, false]
console.log(
  "方法2 n=5, edges=[[0,1,10],[1,2,5],[2,3,9],[3,4,13]], q=[[0,4,14],[1,4,13]]:",
  distanceLimitedPathsExist2(
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
); // [true, false]

export {};
