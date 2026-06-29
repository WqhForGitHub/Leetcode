// ============================================================
// 013. 查找和最小的 K 对数字
// ============================================================
// LeetCode 373. Find K Pairs with Smallest Sums
// 给定两个升序数组 nums1 和 nums2，返回和最小的 k 个数对。
// 时间复杂度：O(k log k)，空间复杂度：O(k)

// 方法1：最小堆（推荐）
function kSmallestPairs(nums1: number[], nums2: number[], k: number): number[][] {
  const result: number[][] = [];
  if (nums1.length === 0 || nums2.length === 0) return result;
  const heap: Array<{ sum: number; i: number; j: number }> = [];
  const push = (v: { sum: number; i: number; j: number }): void => {
    heap.push(v);
    let idx = heap.length - 1;
    while (idx > 0) {
      const p = (idx - 1) >> 1;
      if (heap[idx].sum < heap[p].sum) {
        [heap[idx], heap[p]] = [heap[p], heap[idx]];
        idx = p;
      } else break;
    }
  };
  const pop = (): { sum: number; i: number; j: number } | undefined => {
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
        if (l < heap.length && heap[l].sum < heap[s].sum) s = l;
        if (r < heap.length && heap[r].sum < heap[s].sum) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (let i = 0; i < Math.min(k, nums1.length); i++) {
    push({ sum: nums1[i] + nums2[0], i, j: 0 });
  }
  while (heap.length > 0 && result.length < k) {
    const top = pop()!;
    result.push([nums1[top.i], nums2[top.j]]);
    if (top.j + 1 < nums2.length) {
      push({ sum: nums1[top.i] + nums2[top.j + 1], i: top.i, j: top.j + 1 });
    }
  }
  return result;
}

// 方法2：暴力（小数据量）
function kSmallestPairsBrute(nums1: number[], nums2: number[], k: number): number[][] {
  const pairs: number[][] = [];
  for (const a of nums1) for (const b of nums2) pairs.push([a, b]);
  pairs.sort((x, y) => x[0] + x[1] - (y[0] + y[1]));
  return pairs.slice(0, k);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 013. 查找和最小的 K 对数字 =====");
console.log("最小堆:", JSON.stringify(kSmallestPairs([1, 7, 11], [2, 4, 6], 3)));
// 期望 [[1,2],[1,4],[1,6]]
console.log("暴力:", JSON.stringify(kSmallestPairsBrute([1, 1, 2], [1, 2, 3], 2)));
// 期望 [[1,1],[1,1]]

export {};
