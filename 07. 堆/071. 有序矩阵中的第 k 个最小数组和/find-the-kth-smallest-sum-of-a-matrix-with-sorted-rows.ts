// ============================================================
// 071. 有序矩阵中的第 k 个最小数组和
// ============================================================
// LeetCode 1439. Find the Kth Smallest Sum of a Matrix With Sorted Rows
// 给定 m 行 n 列矩阵，每行选一个数，求第 k 小的数组和。
// 时间复杂度：O(k * m * log(k*m))，空间复杂度：O(k)

// 方法1：最小堆 + 二分查找（推荐）
function kthSmallest(mat: number[][], k: number): number {
  let prev = mat[0].slice(0, k);
  for (let r = 1; r < mat.length; r++) {
    const heap: Array<{ sum: number; idx: number }> = [];
    const push = (v: { sum: number; idx: number }): void => {
      heap.push(v);
      let i = heap.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (heap[i].sum < heap[p].sum) {
          [heap[i], heap[p]] = [heap[p], heap[i]];
          i = p;
        } else break;
      }
    };
    const pop = (): { sum: number; idx: number } | undefined => {
      if (heap.length === 0) return undefined;
      const top = heap[0];
      const last = heap.pop()!;
      if (heap.length > 0) {
        heap[0] = last;
        let i = 0;
        while (true) {
          let s = i;
          const l = 2 * i + 1;
          const rr = 2 * i + 2;
          if (l < heap.length && heap[l].sum < heap[s].sum) s = l;
          if (rr < heap.length && heap[rr].sum < heap[s].sum) s = rr;
          if (s !== i) {
            [heap[i], heap[s]] = [heap[s], heap[i]];
            i = s;
          } else break;
        }
      }
      return top;
    };
    const seen: Set<number> = new Set();
    for (let i = 0; i < prev.length; i++) {
      push({ sum: prev[i] + mat[r][0], idx: i });
      seen.add(i);
    }
    const next: number[] = [];
    while (next.length < k && heap.length > 0) {
      const top = pop()!;
      next.push(top.sum);
      if (top.idx + 1 < mat[r].length && !seen.has(top.idx + 1)) {
        seen.add(top.idx + 1);
        push({ sum: prev[top.idx + 1] + mat[r][0], idx: top.idx + 1 });
      }
    }
    prev = next;
  }
  return prev[k - 1];
}

// 方法2：二分查找 + 计数
function kthSmallestBinary(mat: number[][], k: number): number {
  const m = mat.length;
  const count = (mid: number, r: number, sum: number): number => {
    if (r === m) return sum <= mid ? 1 : 0;
    let cnt = 0;
    for (const v of mat[r]) {
      if (sum + v > mid) break;
      cnt += count(mid, r + 1, sum + v);
      if (cnt >= k) return cnt;
    }
    return cnt;
  };
  let lo = 0;
  let hi = 0;
  for (const row of mat) {
    lo += row[0];
    hi += row[row.length - 1];
  }
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (count(mid, 0, 0) >= k) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 071. 有序矩阵中的第 k 个最小数组和 =====");
console.log(
  "最小堆:",
  kthSmallest(
    [
      [1, 3, 11],
      [2, 4, 6],
    ],
    5,
  ),
); // 期望 7
console.log(
  "二分:",
  kthSmallestBinary(
    [
      [1, 3, 11],
      [2, 4, 6],
    ],
    9,
  ),
); // 期望 17

export {};
