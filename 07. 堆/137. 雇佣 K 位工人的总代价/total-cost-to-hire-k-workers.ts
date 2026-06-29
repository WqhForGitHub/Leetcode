// ============================================================
// 137. 雇佣 K 位工人的总代价
// ============================================================
// LeetCode 2462. Total Cost to Hire K Workers
// 从数组两端选最小的 k 个元素，每端选 candidates 个。
// 时间复杂度：O((k + candidates) log candidates)，空间复杂度：O(candidates)

// 方法1：双最小堆
function totalCost(costs: number[], k: number, candidates: number): number {
  const n = costs.length;
  const leftHeap: number[] = [];
  const rightHeap: number[] = [];
  let left = 0;
  let right = n - 1;
  let total = 0;

  const siftUp = (heap: number[], i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] < heap[p]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (heap: number[], i: number): void => {
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l] < heap[s]) s = l;
      if (r < len && heap[r] < heap[s]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  const push = (heap: number[], v: number): void => { heap.push(v); siftUp(heap, heap.length - 1); };
  const pop = (heap: number[]): number => {
    const top = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(heap, 0);
    return top;
  };

  // 初始化左右堆
  for (let i = 0; i < candidates && left <= right; i++) {
    push(leftHeap, costs[left++]);
  }
  for (let i = 0; i < candidates && left <= right; i++) {
    push(rightHeap, costs[right--]);
  }

  for (let i = 0; i < k; i++) {
    if (leftHeap.length === 0) {
      total += pop(rightHeap);
      if (left <= right) push(rightHeap, costs[right--]);
    } else if (rightHeap.length === 0) {
      total += pop(leftHeap);
      if (left <= right) push(leftHeap, costs[left++]);
    } else if (leftHeap[0] <= rightHeap[0]) {
      total += pop(leftHeap);
      if (left <= right) push(leftHeap, costs[left++]);
    } else {
      total += pop(rightHeap);
      if (left <= right) push(rightHeap, costs[right--]);
    }
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 137. 雇佣 K 位工人的总代价 =====");
console.log("双堆:", totalCost([17, 12, 10, 2, 7, 2, 11, 20, 8], 3, 4)); // 期望 11
console.log("双堆:", totalCost([1, 2, 4, 1], 3, 3)); // 期望 4

export {};
