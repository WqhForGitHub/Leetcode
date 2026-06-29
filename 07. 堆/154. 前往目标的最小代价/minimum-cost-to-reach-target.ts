// ============================================================
// 154. 前往目标的最小代价
// ============================================================
// LeetCode 2662. Minimum Cost of a Path With Special Roads
// 从起点到终点，可以走特殊道路或曼哈顿距离。
// 时间复杂度：O(n^2 log n)，空间复杂度：O(n)

// 方法1：Dijkstra + 最小堆
function minCost(startPos: number[], homePos: number[], rowCosts: number[], colCosts: number[]): number {
  const [sr, sc] = startPos;
  const [hr, hc] = homePos;
  let cost = 0;
  // 向 home 走，每步花费 rowCosts 或 colCosts
  let r = sr;
  while (r !== hr) {
    r += hr > r ? 1 : -1;
    cost += rowCosts[r];
  }
  let c = sc;
  while (c !== hc) {
    c += hc > c ? 1 : -1;
    cost += colCosts[c];
  }
  return cost;
}

// 方法2：直接计算
function minCostDirect(startPos: number[], homePos: number[], rowCosts: number[], colCosts: number[]): number {
  const [sr, sc] = startPos;
  const [hr, hc] = homePos;
  let cost = 0;
  for (let i = Math.min(sr, hr); i <= Math.max(sr, hr); i++) {
    if (i !== sr) cost += rowCosts[i];
  }
  for (let j = Math.min(sc, hc); j <= Math.max(sc, hc); j++) {
    if (j !== sc) cost += colCosts[j];
  }
  return cost;
}

// 方法3：特殊道路的 Dijkstra（不同问题定义）
function minCostSpecial(start: number[], target: number[], specialRoads: number[][]): number {
  const points: Array<[number, number]> = [start, target];
  for (const [x1, y1, x2, y2, cost] of specialRoads) {
    points.push([x1, y1]);
    points.push([x2, y2]);
  }
  const dist: Map<string, number> = new Map();
  const key = (p: [number, number]): string => `${p[0]},${p[1]}`;
  const manhattan = (a: [number, number], b: [number, number]): number =>
    Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  dist.set(key(start), 0);
  const heap: Array<[number, number, number]> = [[0, start[0], start[1]]];
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] < heap[p][0]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l][0] < heap[s][0]) s = l;
      if (r < len && heap[r][0] < heap[s][0]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  const seen: Set<string> = new Set();
  while (heap.length > 0) {
    const [d, x, y] = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown();
    const k = key([x, y]);
    if (seen.has(k)) continue;
    seen.add(k);
    if (x === target[0] && y === target[1]) return d;
    // 走曼哈顿到所有点
    for (const [px, py] of points) {
      const nk = key([px, py]);
      if (seen.has(nk)) continue;
      const nd = d + manhattan([x, y], [px, py]);
      if (nd < (dist.get(nk) ?? Infinity)) {
        dist.set(nk, nd);
        heap.push([nd, px, py]);
        siftUp(heap.length - 1);
      }
    }
    // 走特殊道路
    for (const [x1, y1, x2, y2, cost] of specialRoads) {
      if (x === x1 && y === y1) {
        const nd = d + cost;
        const nk = key([x2, y2]);
        if (nd < (dist.get(nk) ?? Infinity)) {
          dist.set(nk, nd);
          heap.push([nd, x2, y2]);
          siftUp(heap.length - 1);
        }
      }
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 154. 前往目标的最小代价 =====");
console.log("直接:", minCost([1, 0], [2, 3], [5, 4, 3], [8, 2, 6, 7])); // 期望 17
console.log("特殊:", minCostSpecial([1, 1], [4, 5], [[1, 2, 3, 3, 2], [3, 4, 4, 5, 1]])); // 期望 5

export {};
