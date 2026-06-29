// ============================================================
// 054. 水资源分配优化
// ============================================================
// LeetCode 1168. Optimize Water Distribution in a Village
// 村庄要供水，可在房子建水井或从其他房子引水，求最低成本。
// 时间复杂度：O(E log E)，空间复杂度：O(V+E)

// 方法1：虚拟节点 + 最小生成树（Kruskal）
function minCostToSupplyWater(n: number, wells: number[], pipes: number[][]): number {
  // 虚拟节点 0 连接到每个房子，成本为井的造价
  const edges: number[][] = [];
  for (let i = 0; i < n; i++) edges.push([0, i + 1, wells[i]]);
  for (const p of pipes) edges.push(p);
  edges.sort((a, b) => a[2] - b[2]);
  const parent: number[] = new Array(n + 1).fill(0).map((_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  let total = 0;
  for (const [u, v, w] of edges) {
    const pu = find(u);
    const pv = find(v);
    if (pu !== pv) {
      parent[pu] = pv;
      total += w;
    }
  }
  return total;
}

// 方法2：Prim + 最小堆
function minCostToSupplyWaterPrim(n: number, wells: number[], pipes: number[][]): number {
  const graph: Array<Array<{ to: number; w: number }>> = Array.from({ length: n + 1 }, () => []);
  for (let i = 0; i < n; i++) {
    graph[0].push({ to: i + 1, w: wells[i] });
    graph[i + 1].push({ to: 0, w: wells[i] });
  }
  for (const [u, v, w] of pipes) {
    graph[u].push({ to: v, w });
    graph[v].push({ to: u, w });
  }
  const visited: boolean[] = new Array(n + 1).fill(false);
  const heap: Array<{ w: number; node: number }> = [];
  const push = (v: { w: number; node: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].w < heap[p].w) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { w: number; node: number } | undefined => {
    if (heap.length === 0) return undefined;
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].w < heap[s].w) s = l;
        if (r < heap.length && heap[r].w < heap[s].w) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  push({ w: 0, node: 0 });
  let total = 0;
  while (heap.length > 0) {
    const cur = pop()!;
    if (visited[cur.node]) continue;
    visited[cur.node] = true;
    total += cur.w;
    for (const { to, w } of graph[cur.node]) {
      if (!visited[to]) push({ w, node: to });
    }
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 054. 水资源分配优化 =====");
console.log(
  "Kruskal:",
  minCostToSupplyWater(
    3,
    [1, 2, 2],
    [
      [1, 2, 1],
      [2, 3, 1],
    ],
  ),
); // 期望 3
console.log("Prim:", minCostToSupplyWaterPrim(2, [1, 2], [[1, 2, 1]])); // 期望 2

export {};
