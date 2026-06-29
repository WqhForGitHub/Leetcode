// ============================================================
// 110. 价格范围内最高排名的 K 样物品
// ============================================================
// LeetCode 2146. K Highest Ranked Items Within a Price Range
// 网格中从起点 BFS，按距离、价格、行列排序返回 k 个。
// 时间复杂度：O(mn log k)，空间复杂度：O(mn)

// 方法1：BFS + 最小堆维护 k 个
function highestRankedKItems(grid: number[][], pricing: number[], start: number[], k: number): number[][] {
  const m = grid.length;
  const n = grid[0].length;
  const [low, high] = pricing;
  const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  const queue: Array<[number, number, number]> = [[start[0], start[1], 0]];
  visited[start[0]][start[1]] = true;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const items: Array<{ dist: number; price: number; r: number; c: number }> = [];
  let head = 0;
  while (head < queue.length) {
    const [r, c, d] = queue[head++];
    const price = grid[r][c];
    if (price >= low && price <= high) {
      items.push({ dist: d, price, r, c });
    }
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited[nr][nc] || grid[nr][nc] === 0) continue;
      visited[nr][nc] = true;
      queue.push([nr, nc, d + 1]);
    }
  }
  items.sort((a, b) => a.dist - b.dist || a.price - b.price || a.r - b.r || a.c - b.c);
  return items.slice(0, k).map((x) => [x.r, x.c]);
}

// 方法2：BFS + 堆
function highestRankedKItemsHeap(grid: number[][], pricing: number[], start: number[], k: number): number[][] {
  const m = grid.length;
  const n = grid[0].length;
  const [low, high] = pricing;
  const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  const queue: Array<[number, number, number]> = [[start[0], start[1], 0]];
  visited[start[0]][start[1]] = true;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const heap: Array<{ dist: number; price: number; r: number; c: number }> = [];
  const less = (a: number, b: number): boolean => {
    const ha = heap[a];
    const hb = heap[b];
    return ha.dist > hb.dist || (ha.dist === hb.dist && ha.price > hb.price) ||
      (ha.dist === hb.dist && ha.price === hb.price && ha.r > hb.r) ||
      (ha.dist === hb.dist && ha.price === hb.price && ha.r === hb.r && ha.c > hb.c);
  };
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (less(i, p)) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const siftDown = (i: number): void => {
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < len && less(l, s)) s = l;
      if (r < len && less(r, s)) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  let head = 0;
  while (head < queue.length) {
    const [r, c, d] = queue[head++];
    const price = grid[r][c];
    if (price >= low && price <= high) {
      heap.push({ dist: d, price, r, c });
      siftUp(heap.length - 1);
      if (heap.length > k) {
        const last = heap.pop()!;
        heap[0] = last;
        siftDown(0);
      }
    }
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited[nr][nc] || grid[nr][nc] === 0) continue;
      visited[nr][nc] = true;
      queue.push([nr, nc, d + 1]);
    }
  }
  const res: number[][] = [];
  const temp = heap.slice();
  temp.sort((a, b) => a.dist - b.dist || a.price - b.price || a.r - b.r || a.c - b.c);
  return temp.map((x) => [x.r, x.c]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 110. 价格范围内最高排名的 K 样物品 =====");
console.log("BFS:", JSON.stringify(highestRankedKItems([[1, 2, 0, 1], [1, 3, 0, 1], [0, 2, 5, 1]], [2, 5], [0, 0], 3)));
// 期望 [[0,1],[1,1],[2,1]]

export {};
