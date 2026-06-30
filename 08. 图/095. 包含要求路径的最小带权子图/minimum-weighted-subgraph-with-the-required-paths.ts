// ============================================================
// 095. 包含要求路径的最小带权子图
// ============================================================
// LeetCode 2203. Minimum Weighted Subgraph With the Required Paths
// n 节点带权边，求包含 src1->dest 与 src2->dest 的最小权子图总权值。
// 方法：三次 Dijkstra（从 src1、src2 正向，从 dest 反向），枚举中间点 x 求 dist1[x]+dist2[x]+distR[x] 最小。
// 时间复杂度：O((n + E) log n)，空间复杂度：O(n + E)

function minimumWeight(
  n: number,
  edges: number[][],
  src1: number,
  src2: number,
  dest: number
): number {
  const adj: number[][][] = Array.from({ length: n }, () => []);
  const radj: number[][][] = Array.from({ length: n }, () => []); // 反图
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    radj[v].push([u, w]);
  }

  const dijkstra = (start: number, graph: number[][][]): bigint[] => {
    const dist = new Array<bigint>(n).fill((1n << 62n));
    dist[start] = 0n;
    // 最小堆：[距离, 节点]
    const heap: [bigint, number][] = [[0n, start]];
    while (heap.length > 0) {
      // 取最小（线性扫描，规模小可接受；如需更快可换真正的堆）
      let minIdx = 0;
      for (let i = 1; i < heap.length; i++) {
        if (heap[i][0] < heap[minIdx][0]) minIdx = i;
      }
      const [d, u] = heap[minIdx];
      heap.splice(minIdx, 1);
      if (d > dist[u]) continue;
      for (const [v, w] of graph[u]) {
        const nd = d + BigInt(w);
        if (nd < dist[v]) {
          dist[v] = nd;
          heap.push([nd, v]);
        }
      }
    }
    return dist;
  };

  const d1 = dijkstra(src1, adj); // 从 src1 到各点
  const d2 = dijkstra(src2, adj); // 从 src2 到各点
  const dr = dijkstra(dest, radj); // 从 dest 反向（即各点到 dest）

  let ans = (1n << 62n);
  for (let x = 0; x < n; x++) {
    if (d1[x] === (1n << 62n) || d2[x] === (1n << 62n) || dr[x] === (1n << 62n)) continue;
    const total = d1[x] + d2[x] + dr[x];
    if (total < ans) ans = total;
  }
  return ans >= (1n << 62n) ? -1 : Number(ans);
}

// 方法2：使用 Map 邻接 + 堆优化（同样的三次 Dijkstra，结构更清晰）
function minimumWeightV2(
  n: number,
  edges: number[][],
  src1: number,
  src2: number,
  dest: number
): number {
  const buildGraph = (reversed: boolean) => {
    const g = new Map<number, [number, number][]>();
    for (let i = 0; i < n; i++) g.set(i, []);
    for (const [u, v, w] of edges) {
      if (reversed) g.get(v)!.push([u, w]);
      else g.get(u)!.push([v, w]);
    }
    return g;
  };

  const dijkstra = (start: number, g: Map<number, [number, number][]>): number[] => {
    const INF = Number.MAX_SAFE_INTEGER;
    const dist = new Array<number>(n).fill(INF);
    dist[start] = 0;
    const visited = new Array<boolean>(n).fill(false);
    for (let i = 0; i < n; i++) {
      let u = -1;
      let best = INF;
      for (let j = 0; j < n; j++) {
        if (!visited[j] && dist[j] < best) {
          best = dist[j];
          u = j;
        }
      }
      if (u === -1) break;
      visited[u] = true;
      for (const [v, w] of g.get(u)!) {
        if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
      }
    }
    return dist;
  };

  const d1 = dijkstra(src1, buildGraph(false));
  const d2 = dijkstra(src2, buildGraph(false));
  const dr = dijkstra(dest, buildGraph(true));

  const INF = Number.MAX_SAFE_INTEGER;
  let ans = INF;
  for (let x = 0; x < n; x++) {
    if (d1[x] === INF || d2[x] === INF || dr[x] === INF) continue;
    ans = Math.min(ans, d1[x] + d2[x] + dr[x]);
  }
  return ans === INF ? -1 : ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 095. 包含要求路径的最小带权子图 =====");
console.log(minimumWeight(
  6,
  [[0, 2, 2], [0, 5, 6], [1, 0, 3], [1, 4, 5], [2, 1, 1], [2, 3, 3], [2, 3, 4], [3, 4, 2], [4, 5, 1]],
  0, 1, 5
)); // 期望: 9

console.log(minimumWeight(
  3,
  [[0, 1, 1], [2, 1, 1]],
  0, 2, 1
)); // 期望: 2

console.log(minimumWeightV2(
  6,
  [[0, 2, 2], [0, 5, 6], [1, 0, 3], [1, 4, 5], [2, 1, 1], [2, 3, 3], [2, 3, 4], [3, 4, 2], [4, 5, 1]],
  0, 1, 5
)); // 期望: 9

export {};
