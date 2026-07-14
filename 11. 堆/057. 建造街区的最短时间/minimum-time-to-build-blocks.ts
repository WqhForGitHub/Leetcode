// ============================================================
// 057. 建造街区的最短时间
// ============================================================
// LeetCode 1199. Minimum Time to Build Blocks
// 用一台机器和分身机分割建造区块，求建完所有区块的最短时间。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：最小堆（Huffman 树思想）
function minBuildTime(blocks: number[], split: number): number {
  const heap: number[] = blocks.slice();
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] < heap[p]) {
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
      if (l < n && heap[l] < heap[s]) s = l;
      if (r < n && heap[r] < heap[s]) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  for (let i = (heap.length >> 1) - 1; i >= 0; i--) siftDown(i);
  while (heap.length > 1) {
    const a = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    siftDown(0);
    const b = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    siftDown(0);
    heap.push(Math.max(a, b) + split);
    siftUp(heap.length - 1);
  }
  return heap[0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 057. 建造街区的最短时间 =====");
console.log("最短时间:", minBuildTime([1, 2, 3], 1)); // 期望 4
console.log("最短时间:", minBuildTime([1, 1, 1, 1], 2)); // 期望 5

export {};
