// ============================================================
// 171. 超过阈值的最少操作数 II
// ============================================================
// LeetCode 3066. Minimum Operations to Exceed Threshold Value II
// 每次选最小的两个数 x <= y，替换为 min(x, y) * 2 + max(x, y)，直到所有数 >= k。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：最小堆
function minOperationsII(nums: number[], k: number): number {
  const heap: number[] = [...nums];
  const siftDown = (i: number, len: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l] < heap[s]) s = l;
      if (r < len && heap[r] < heap[s]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] < heap[p]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i, heap.length);
  let ops = 0;
  while (heap.length >= 2 && heap[0] < k) {
    const x = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(0, heap.length);
    const y = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(0, heap.length);
    // 使用 BigInt 防止溢出
    const newVal = Number(BigInt(Math.min(x, y)) * 2n + BigInt(Math.max(x, y)));
    heap.push(newVal);
    siftUp(heap.length - 1);
    ops++;
  }
  return heap[0] >= k ? ops : -1;
}

// 方法2：最小堆（BigInt 安全版）
function minOperationsIISafe(nums: number[], k: number): number {
  const heap: bigint[] = nums.map(x => BigInt(x));
  const siftDown = (i: number, len: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l] < heap[s]) s = l;
      if (r < len && heap[r] < heap[s]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] < heap[p]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i, heap.length);
  const bk = BigInt(k);
  let ops = 0;
  while (heap.length >= 2 && heap[0] < bk) {
    const x = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(0, heap.length);
    const y = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(0, heap.length);
    heap.push(x * 2n + y);
    siftUp(heap.length - 1);
    ops++;
  }
  return heap[0] >= bk ? ops : -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 171. 超过阈值的最少操作数 II =====");
console.log("堆:", minOperationsII([2, 11, 10, 1, 3], 10)); // 期望 2
console.log("BigInt:", minOperationsIISafe([1, 1, 3, 4], 10)); // 期望 3? 验证

export {};
