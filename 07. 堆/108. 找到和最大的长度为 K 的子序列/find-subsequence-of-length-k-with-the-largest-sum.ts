// ============================================================
// 108. 找到和最大的长度为 K 的子序列
// ============================================================
// LeetCode 2099. Find Subsequence of Length K With the Largest Sum
// 返回和最大的长度为 k 的子序列（保持原顺序）。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：最小堆 + 排序（推荐）
function maxSubsequence(nums: number[], k: number): number[] {
  const indexed = nums.map((v, i) => ({ v, i }));
  // 最大堆选 k 个最大值
  indexed.sort((a, b) => b.v - a.v);
  const topK = indexed.slice(0, k).sort((a, b) => a.i - b.i);
  return topK.map((x) => x.v);
}

// 方法2：最小堆维护 k 大
function maxSubsequenceHeap(nums: number[], k: number): number[] {
  const heap: Array<{ v: number; i: number }> = [];
  const less = (a: number, b: number): boolean => heap[a].v < heap[b].v;
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
  for (let i = 0; i < nums.length; i++) {
    heap.push({ v: nums[i], i });
    siftUp(heap.length - 1);
    if (heap.length > k) {
      const last = heap.pop()!;
      heap[0] = last;
      siftDown(0);
    }
  }
  heap.sort((a, b) => a.i - b.i);
  return heap.map((x) => x.v);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 108. 找到和最大的长度为 K 的子序列 =====");
console.log("排序:", maxSubsequence([2, 1, 3, 3], 2)); // 期望 [3,3]
console.log("堆:", maxSubsequenceHeap([-1, -2, 3, 4], 3)); // 期望 [-1,3,4]

export {};
