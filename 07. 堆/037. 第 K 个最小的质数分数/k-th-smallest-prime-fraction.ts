// ============================================================
// 037. 第 K 个最小的质数分数
// ============================================================
// LeetCode 786. K-th Smallest Prime Fraction
// 给定升序质数数组，返回第 k 小的分数 [arr[i], arr[j]]。
// 时间复杂度：O(n log n log M)，空间复杂度：O(1)

// 方法1：最小堆（推荐）
function kthSmallestPrimeFraction(arr: number[], k: number): number[] {
  const n = arr.length;
  const heap: Array<{ val: number; i: number; j: number }> = [];
  const push = (v: { val: number; i: number; j: number }): void => {
    heap.push(v);
    let idx = heap.length - 1;
    while (idx > 0) {
      const p = (idx - 1) >> 1;
      if (heap[idx].val < heap[p].val) {
        [heap[idx], heap[p]] = [heap[p], heap[idx]];
        idx = p;
      } else break;
    }
  };
  const pop = (): { val: number; i: number; j: number } | undefined => {
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
        if (l < heap.length && heap[l].val < heap[s].val) s = l;
        if (r < heap.length && heap[r].val < heap[s].val) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (let i = 0; i < n - 1; i++) push({ val: arr[i] / arr[n - 1], i, j: n - 1 });
  for (let c = 0; c < k - 1; c++) {
    const top = pop()!;
    if (top.j - 1 > top.i) push({ val: arr[top.i] / arr[top.j - 1], i: top.i, j: top.j - 1 });
  }
  const res = heap[0];
  return [arr[res.i], arr[res.j]];
}

// 方法2：二分查找
function kthSmallestPrimeFractionBinary(arr: number[], k: number): number[] {
  const n = arr.length;
  let lo = 0;
  let hi = 1;
  let p = 0;
  let q = 1;
  while (lo < hi) {
    const mid = (lo + hi) / 2;
    let cnt = 0;
    let j = 1;
    let bestP = 0;
    let bestQ = 1;
    for (let i = 0; i < n - 1; i++) {
      while (j < n && arr[i] / arr[j] > mid) j++;
      if (j < n) {
        cnt += n - j;
        if (arr[i] * bestQ > arr[j] * bestP) {
          bestP = arr[i];
          bestQ = arr[j];
        }
      }
    }
    if (cnt === k) return [bestP, bestQ];
    if (cnt < k) lo = mid;
    else hi = mid;
    p = bestP;
    q = bestQ;
  }
  return [p, q];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 037. 第 K 个最小的质数分数 =====");
console.log("最小堆:", kthSmallestPrimeFraction([1, 2, 3, 5], 3)); // 期望 [2,5]
console.log("二分:", kthSmallestPrimeFractionBinary([1, 7], 1)); // 期望 [1,7]

export {};
