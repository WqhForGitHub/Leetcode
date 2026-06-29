// ============================================================
// 014. 有序矩阵中第 K 小的元素
// ============================================================
// LeetCode 378. Kth Smallest Element in a Sorted Matrix
// 给定 n x n 矩阵，每行每列均升序，返回第 k 小的元素。
// 时间复杂度：O(k log n)，空间复杂度：O(n)

// 方法1：最小堆，归并 k 个有序链表（推荐）
function kthSmallest(matrix: number[][], k: number): number {
  const n = matrix.length;
  const heap: Array<{ val: number; r: number; c: number }> = [];
  const push = (v: { val: number; r: number; c: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].val < heap[p].val) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { val: number; r: number; c: number } | undefined => {
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
  for (let r = 0; r < n; r++) push({ val: matrix[r][0], r, c: 0 });
  let result = 0;
  for (let i = 0; i < k; i++) {
    const top = pop()!;
    result = top.val;
    if (top.c + 1 < n) push({ val: matrix[top.r][top.c + 1], r: top.r, c: top.c + 1 });
  }
  return result;
}

// 方法2：二分查找
function kthSmallestBinary(matrix: number[][], k: number): number {
  const n = matrix.length;
  let lo = matrix[0][0];
  let hi = matrix[n - 1][n - 1];
  const count = (mid: number): number => {
    let cnt = 0;
    let r = n - 1;
    let c = 0;
    while (r >= 0 && c < n) {
      if (matrix[r][c] <= mid) {
        cnt += r + 1;
        c++;
      } else {
        r--;
      }
    }
    return cnt;
  };
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (count(mid) < k) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 014. 有序矩阵中第 K 小的元素 =====");
console.log("最小堆:", kthSmallest([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8)); // 期望 13
console.log("二分:", kthSmallestBinary([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8)); // 期望 13

export {};
