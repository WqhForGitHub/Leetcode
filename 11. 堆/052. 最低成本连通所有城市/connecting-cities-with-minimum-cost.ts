// ============================================================
// 052. 最低成本连通所有城市
// ============================================================
// LeetCode 1135. Connecting Cities With Minimum Cost
// 有 n 个城市和连接成本，求连通所有城市的最低成本。
// 时间复杂度：O(E log V)，空间复杂度：O(V+E)

// 方法1：Prim + 最小堆
function minimumCost(n: number, connections: number[][]): number {
  const graph: Array<Array<{ to: number; w: number }>> = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of connections) {
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
  push({ w: 0, node: 1 });
  let total = 0;
  let count = 0;
  while (heap.length > 0 && count < n) {
    const cur = pop()!;
    if (visited[cur.node]) continue;
    visited[cur.node] = true;
    total += cur.w;
    count++;
    for (const { to, w } of graph[cur.node]) {
      if (!visited[to]) push({ w, node: to });
    }
  }
  return count === n ? total : -1;
}

// 方法2：Kruskal + 并查集
function minimumCostKruskal(n: number, connections: number[][]): number {
  connections.sort((a, b) => a[2] - b[2]);
  const parent: number[] = new Array(n + 1).fill(0).map((_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  let total = 0;
  let count = 0;
  for (const [u, v, w] of connections) {
    const pu = find(u);
    const pv = find(v);
    if (pu !== pv) {
      parent[pu] = pv;
      total += w;
      count++;
      if (count === n - 1) return total;
    }
  }
  return count === n - 1 ? total : -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 052. 最低成本连通所有城市 =====");
console.log(
  "Prim:",
  minimumCost(3, [
    [1, 2, 5],
    [1, 3, 6],
    [2, 3, 1],
  ]),
); // 期望 6
console.log(
  "Kruskal:",
  minimumCostKruskal(4, [
    [1, 2, 3],
    [3, 4, 4],
  ]),
); // 期望 -1

export {};
