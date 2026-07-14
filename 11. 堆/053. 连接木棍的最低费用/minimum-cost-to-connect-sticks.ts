// ============================================================
// 053. 连接木棍的最低费用
// ============================================================
// LeetCode 1167. Minimum Cost to Connect Sticks
// 每次连接两根木棍费用为长度之和，求连接所有木棍的最低费用。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：最小堆（Huffman 编码思想）（推荐）
function connectSticks(sticks: number[]): number {
  const heap: number[] = sticks.slice();
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
  let cost = 0;
  while (heap.length > 1) {
    const a = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    siftDown(0);
    const b = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    siftDown(0);
    const sum = a + b;
    cost += sum;
    heap.push(sum);
    siftUp(heap.length - 1);
  }
  return cost;
}

// 方法2：排序模拟（不高效）
function connectSticksSort(sticks: number[]): number {
  const arr = sticks.slice();
  let cost = 0;
  while (arr.length > 1) {
    arr.sort((a, b) => a - b);
    const sum = arr.shift()! + arr.shift()!;
    cost += sum;
    arr.push(sum);
  }
  return cost;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 053. 连接木棍的最低费用 =====");
console.log("最小堆:", connectSticks([2, 4, 3])); // 期望 14
console.log("排序:", connectSticksSort([1, 8, 3, 5])); // 期望 30

export {};
