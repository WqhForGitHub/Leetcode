// ============================================================
// 147. 从数量最多的堆取走礼物
// ============================================================
// LeetCode 2558. Take Gifts From the Richest Pile
// 每次选最大的礼物堆，取走 floor(sqrt(礼物数)) 个礼物。
// 时间复杂度：O(n + k log n)，空间复杂度：O(n)

// 方法1：最大堆
function pickGifts(gifts: number[], k: number): number {
  const heap: number[] = [...gifts];
  const siftDown = (i: number, len: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < len && heap[l] > heap[s]) s = l;
      if (r < len && heap[r] > heap[s]) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i, heap.length);
  for (let i = 0; i < k; i++) {
    const top = heap[0];
    if (top === 0) break;
    heap[0] = Math.floor(Math.sqrt(top));
    siftDown(0, heap.length);
  }
  return heap.reduce((a, b) => a + b, 0);
}

// 方法2：排序（每轮）
function pickGiftsSort(gifts: number[], k: number): number {
  for (let i = 0; i < k; i++) {
    let maxIdx = 0;
    for (let j = 1; j < gifts.length; j++) {
      if (gifts[j] > gifts[maxIdx]) maxIdx = j;
    }
    if (gifts[maxIdx] === 0) break;
    gifts[maxIdx] = Math.floor(Math.sqrt(gifts[maxIdx]));
  }
  return gifts.reduce((a, b) => a + b, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 147. 从数量最多的堆取走礼物 =====");
console.log("堆:", pickGifts([25, 64, 9, 4, 100], 4)); // 期望 29
console.log("排序:", pickGiftsSort([1, 1, 1, 1], 4)); // 期望 4

export {};
