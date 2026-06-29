// ============================================================
// 045. 最接近原点的 K 个点
// ============================================================
// LeetCode 973. K Closest Points to Origin
// 返回距离原点最近的 k 个点。
// 时间复杂度：O(N log k)，空间复杂度：O(k)

// 方法1：最大堆维护 k 个最近点（推荐）
function kClosest(points: number[][], k: number): number[][] {
  const heap: Array<{ d: number; p: number[] }> = [];
  const less = (a: number, b: number): boolean => heap[a].d > heap[b].d;
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
  for (const p of points) {
    const d = p[0] * p[0] + p[1] * p[1];
    heap.push({ d, p });
    siftUp(heap.length - 1);
    if (heap.length > k) {
      const last = heap.pop()!;
      heap[0] = last;
      siftDown(0);
    }
  }
  return heap.map((h) => h.p);
}

// 方法2：快速选择
function kClosestQuickSelect(points: number[][], k: number): number[][] {
  const dist = (p: number[]): number => p[0] * p[0] + p[1] * p[1];
  const partition = (lo: number, hi: number): number => {
    const pivot = dist(points[hi]);
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (dist(points[j]) <= pivot) {
        [points[i], points[j]] = [points[j], points[i]];
        i++;
      }
    }
    [points[i], points[hi]] = [points[hi], points[i]];
    return i;
  };
  let lo = 0;
  let hi = points.length - 1;
  while (lo < hi) {
    const p = partition(lo, hi);
    if (p === k) break;
    if (p < k) lo = p + 1;
    else hi = p - 1;
  }
  return points.slice(0, k);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 045. 最接近原点的 K 个点 =====");
console.log("堆:", JSON.stringify(kClosest([[1, 3], [-2, 2]], 1))); // 期望 [[-2,2]]
console.log("快选:", JSON.stringify(kClosestQuickSelect([[3, 3], [5, -1], [-2, 4]], 2))); // 期望 [[3,3],[-2,4]]

export {};
