// ============================================================
// 060. 矩阵中战斗力最弱的 K 行
// ============================================================
// LeetCode 1337. The K Weakest Rows in a Matrix
// 矩阵每行 1 在前 0 在后，返回战斗力最弱的 k 行索引。
// 时间复杂度：O(m log n + k log m)，空间复杂度：O(m)

// 方法1：最大堆维护 k 个最弱
function kWeakestRows(mat: number[][], k: number): number[] {
  const count = (row: number[]): number => {
    let lo = 0;
    let hi = row.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (row[mid] === 1) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  const heap: Array<{ cnt: number; idx: number }> = [];
  const less = (a: number, b: number): boolean => {
    return heap[a].cnt > heap[b].cnt || (heap[a].cnt === heap[b].cnt && heap[a].idx > heap[b].idx);
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
    const n = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && less(l, s)) s = l;
      if (r < n && less(r, s)) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  for (let i = 0; i < mat.length; i++) {
    const c = count(mat[i]);
    heap.push({ cnt: c, idx: i });
    siftUp(heap.length - 1);
    if (heap.length > k) {
      const last = heap.pop()!;
      heap[0] = last;
      siftDown(0);
    }
  }
  const res: number[] = [];
  while (heap.length > 0) {
    res.unshift(heap[0].idx);
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      siftDown(0);
    }
  }
  return res;
}

// 方法2：二分 + 排序
function kWeakestRowsSort(mat: number[][], k: number): number[] {
  const count = (row: number[]): number => {
    let lo = 0;
    let hi = row.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (row[mid] === 1) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  const arr = mat.map((row, i) => ({ c: count(row), i }));
  arr.sort((a, b) => a.c - b.c || a.i - b.i);
  return arr.slice(0, k).map((x) => x.i);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 060. 矩阵中战斗力最弱的 K 行 =====");
console.log(
  "堆:",
  kWeakestRows(
    [
      [1, 1, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ],
    3,
  ),
); // 期望 [2,0,3]
console.log(
  "排序:",
  kWeakestRowsSort(
    [
      [1, 0, 0, 0],
      [1, 1, 1, 1],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
    ],
    2,
  ),
); // 期望 [0,2]

export {};
