// ============================================================
// 102. 移除石子使总数最小
// ============================================================
// LeetCode 1962. Remove Stones to Minimize the Total
// 每次操作选一堆石子移除一半（向下取整），求 k 次后剩余最小总数。
// 时间复杂度：O(N + k log N)，空间复杂度：O(N)

// 方法1：最大堆（推荐）
function minStoneSum(piles: number[], k: number): number {
  const heap: number[] = piles.slice();
  const siftDown = (i: number, n: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && heap[l] > heap[s]) s = l;
      if (r < n && heap[r] > heap[s]) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] > heap[p]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const n = heap.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(i, n);
  for (let i = 0; i < k; i++) {
    heap[0] = heap[0] - Math.floor(heap[0] / 2);
    siftDown(0, heap.length);
  }
  return heap.reduce((a, b) => a + b, 0);
}

// 方法2：排序模拟（低效）
function minStoneSumSort(piles: number[], k: number): number {
  const arr = piles.slice();
  for (let i = 0; i < k; i++) {
    arr.sort((a, b) => b - a);
    arr[0] = arr[0] - Math.floor(arr[0] / 2);
  }
  return arr.reduce((a, b) => a + b, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 102. 移除石子使总数最小 =====");
console.log("最大堆:", minStoneSum([5, 4, 9], 2)); // 期望 12
console.log("排序:", minStoneSumSort([4, 3, 6, 7], 3)); // 期望 12

export {};
