// ============================================================
// 098. 矩阵中最大的三个菱形和
// ============================================================
// LeetCode 1878. Get Biggest Three Rhombus Sums in a Grid
// 给定网格，求所有菱形面积和的前三大的不同值。
// 时间复杂度：O(mn * min(m,n))，空间复杂度：O(1)

// 方法1：枚举菱形中心 + 最小堆维护前三
function getBiggestThree(grid: number[][]): number[] {
  const m = grid.length;
  const n = grid[0].length;
  const heap: number[] = []; // 最小堆维护前三不同值
  const seen: Set<number> = new Set();
  const pushMin = (v: number): void => {
    if (seen.has(v)) return;
    seen.add(v);
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] < heap[p]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
    if (heap.length > 3) {
      const last = heap.pop()!;
      heap[0] = last;
      let j = 0;
      while (true) {
        let s = j;
        const l = 2 * j + 1;
        const r = 2 * j + 2;
        if (l < heap.length && heap[l] < heap[s]) s = l;
        if (r < heap.length && heap[r] < heap[s]) s = r;
        if (s !== j) {
          [heap[j], heap[s]] = [heap[s], heap[j]];
          j = s;
        } else break;
      }
    }
  };
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      // 半径 0
      pushMin(grid[r][c]);
      // 枚举半径
      for (let k = 1; r - k >= 0 && r + k < m && c - k >= 0 && c + k < n; k++) {
        let sum = 0;
        // 上
        for (let t = 0; t <= k; t++) sum += grid[r - t][c - (k - t)];
        // 右
        for (let t = 1; t <= k; t++) sum += grid[r - (k - t)][c + t];
        // 下
        for (let t = 1; t <= k; t++) sum += grid[r + t][c + (k - t)];
        // 左
        for (let t = 1; t < k; t++) sum += grid[r + (k - t)][c - t];
        pushMin(sum);
      }
    }
  }
  heap.sort((a, b) => b - a);
  return heap;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 098. 矩阵中最大的三个菱形和 =====");
console.log(
  "前三:",
  getBiggestThree([
    [3, 4, 5, 1, 3],
    [3, 3, 4, 2, 3],
    [20, 30, 200, 40, 10],
    [1, 5, 5, 4, 1],
    [4, 3, 2, 2, 5],
  ]),
);
// 期望 [228,216,211]
console.log(
  "前三:",
  getBiggestThree([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
); // 期望 [20,9,8]

export {};
