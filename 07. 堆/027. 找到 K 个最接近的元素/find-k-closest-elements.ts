// ============================================================
// 027. 找到 K 个最接近的元素
// ============================================================
// LeetCode 658. Find K Closest Elements
// 给定升序数组 arr 和 x，找到最接近 x 的 k 个整数（升序返回）。
// 时间复杂度：O(log n + k)，空间复杂度：O(k)

// 方法1：二分查找 + 双指针（推荐）
function findClosestElements(arr: number[], k: number, x: number): number[] {
  let lo = 0;
  let hi = arr.length - k;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
    else hi = mid;
  }
  return arr.slice(lo, lo + k);
}

// 方法2：最大堆
function findClosestElementsHeap(arr: number[], k: number, x: number): number[] {
  const heap: Array<{ val: number; diff: number }> = [];
  const less = (a: number, b: number): boolean => {
    return heap[a].diff > heap[b].diff || (heap[a].diff === heap[b].diff && heap[a].val > heap[b].val);
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
  for (const v of arr) {
    heap.push({ val: v, diff: Math.abs(v - x) });
    siftUp(heap.length - 1);
    if (heap.length > k) {
      const last = heap.pop()!;
      heap[0] = last;
      siftDown(0);
    }
  }
  return heap.map((h) => h.val).sort((a, b) => a - b);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 027. 找到 K 个最接近的元素 =====");
console.log("二分:", findClosestElements([1, 2, 3, 4, 5], 4, 3)); // 期望 [1,2,3,4]
console.log("堆:", findClosestElementsHeap([1, 2, 3, 4, 5], 4, -1)); // 期望 [1,2,3,4]

export {};
