// ============================================================
// 044. 水资源分配优化
// ============================================================
// LeetCode 1168. Optimize Water Distribution in a Village
// n 个房子，wells[i] 在 i+1 修井成本，pipes=[house1,house2,cost] 修管道成本，
// 所有房子都能用水（直接打井或连管道）最小成本。
// 思路：虚拟节点 0 代表水源，well 作为 0 到 i+1 的边，与 pipe 一起求 MST。
// 时间复杂度：O(E log E)，空间复杂度：O(V+E)

// 方法1：虚拟节点 + Kruskal（推荐）
function minCostToSupplyWaterKruskal(n: number, wells: number[], pipes: number[][]): number {
  // 把所有边收集起来：well 作为虚拟节点 0 到 i+1 的边
  const edges: number[][] = [];
  for (let i = 0; i < wells.length; i++) {
    edges.push([0, i + 1, wells[i]]);
  }
  for (const [u, v, w] of pipes) {
    edges.push([u, v, w]);
  }
  // 按成本升序排序
  edges.sort((a, b) => a[2] - b[2]);

  const parent: number[] = new Array(n + 1).fill(0).map((_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const union = (x: number, y: number): boolean => {
    const px = find(x);
    const py = find(y);
    if (px === py) return false;
    parent[px] = py;
    return true;
  };

  let total = 0;
  let count = 0; // 需要连 n 条边（含虚拟节点共 n+1 个节点）
  for (const [u, v, w] of edges) {
    if (union(u, v)) {
      total += w;
      count++;
      if (count === n) return total;
    }
  }
  return total;
}

// 方法2：虚拟节点 + Prim
function minCostToSupplyWaterPrim(n: number, wells: number[], pipes: number[][]): number {
  const graph: Array<Array<{ to: number; w: number }>> = Array.from({ length: n + 1 }, () => []);
  // 虚拟节点 0 到各房子
  for (let i = 0; i < wells.length; i++) {
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
  let count = 0;
  const totalNodes = n + 1;
  while (heap.length > 0 && count < totalNodes) {
    const cur = pop()!;
    if (visited[cur.node]) continue;
    visited[cur.node] = true;
    total += cur.w;
    count++;
    for (const { to, w } of graph[cur.node]) {
      if (!visited[to]) push({ w, node: to });
    }
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 044. 水资源分配优化 =====");
console.log(
  "Kruskal:",
  minCostToSupplyWaterKruskal(
    3,
    [1, 2, 2],
    [
      [1, 2, 1],
      [2, 3, 1],
    ],
  ),
); // 期望 3
console.log(
  "Prim:",
  minCostToSupplyWaterPrim(
    3,
    [1, 2, 2],
    [
      [1, 2, 1],
      [2, 3, 1],
    ],
  ),
); // 期望 3
console.log("Kruskal 只打井:", minCostToSupplyWaterKruskal(2, [1, 2], [])); // 期望 3
console.log("Prim 只打井:", minCostToSupplyWaterPrim(2, [1, 2], [])); // 期望 3

export {};
