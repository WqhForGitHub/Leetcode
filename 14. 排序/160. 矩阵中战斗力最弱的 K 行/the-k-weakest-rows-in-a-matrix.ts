// ============================================================
// 160. 矩阵中战斗力最弱的 K 行
// ============================================================
// LeetCode 1337. The K Weakest Rows in a Matrix
// 给定 m x n 二进制矩阵，每行元素先 1 后 0 排序。每行战斗力为 1 的个数。
// 返回战斗力最弱的 k 行的索引（战斗力相同则按索引升序）。

// 方法1：逐行计数 + 排序（O(m*n + m log m)）
function kWeakestRows1(mat: number[][], k: number): number[] {
  const m = mat.length;
  const counts: [number, number][] = [];
  for (let i = 0; i < m; i++) {
    let cnt = 0;
    for (const v of mat[i]) {
      if (v === 1) cnt++;
      else break;
    }
    counts.push([i, cnt]);
  }
  counts.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  return counts.slice(0, k).map((c) => c[0]);
}

// 方法2：二分找第一个 0 + 最大堆维护 k 个最弱（O(m log n + m log k)）
function kWeakestRows2(mat: number[][], k: number): number[] {
  const m = mat.length;
  // 二分查找每行 1 的个数（即第一个 0 的位置）
  const countOnes = (row: number[]): number => {
    let lo = 0;
    let hi = row.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (row[mid] === 1) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  // 最大堆：堆顶为 "最强" 的行（count 大优先，count 相同 index 大优先）
  const heap: [number, number][] = [];
  const stronger = (a: [number, number], b: [number, number]): boolean =>
    a[0] > b[0] || (a[0] === b[0] && a[1] > b[1]);
  const siftUp = (i: number) => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (stronger(heap[i], heap[p])) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const siftDown = (i: number) => {
    const n = heap.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let best = i;
      if (l < n && stronger(heap[l], heap[best])) best = l;
      if (r < n && stronger(heap[r], heap[best])) best = r;
      if (best === i) break;
      [heap[i], heap[best]] = [heap[best], heap[i]];
      i = best;
    }
  };

  for (let i = 0; i < m; i++) {
    const c = countOnes(mat[i]);
    heap.push([c, i]);
    siftUp(heap.length - 1);
    if (heap.length > k) {
      heap[0] = heap[heap.length - 1];
      heap.pop();
      siftDown(0);
    }
  }
  // 堆中保留 k 个最弱行，按 (count, index) 升序输出
  heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return heap.map((h) => h[1]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 160. 矩阵中战斗力最弱的 K 行 =====");
const mat160: number[][] = [
  [1, 1, 0, 0, 0],
  [1, 1, 1, 1, 0],
  [1, 0, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [1, 1, 1, 1, 1],
];
console.log("方法1 k=3:", kWeakestRows1(mat160, 3)); // [2,0,3]
console.log("方法2 k=3:", kWeakestRows2(mat160, 3)); // [2,0,3]

export {};
