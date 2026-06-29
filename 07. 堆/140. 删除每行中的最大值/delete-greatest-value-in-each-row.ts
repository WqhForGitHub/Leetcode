// ============================================================
// 140. 删除每行中的最大值
// ============================================================
// LeetCode 2500. Delete Greatest Value in Each Row
// 每次删除每行最大值，删除值的最大值累加。
// 时间复杂度：O(mn log n)，空间复杂度：O(1)

// 方法1：排序
function deleteGreatestValue(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  for (const row of grid) {
    row.sort((a, b) => a - b);
  }
  let result = 0;
  for (let j = n - 1; j >= 0; j--) {
    let maxVal = 0;
    for (let i = 0; i < m; i++) {
      maxVal = Math.max(maxVal, grid[i][j]);
    }
    result += maxVal;
  }
  return result;
}

// 方法2：最大堆
function deleteGreatestValueHeap(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const heaps: number[][] = grid.map(row => [...row]);
  // 为每行建最大堆
  const siftDown = (heap: number[], i: number, len: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l] > heap[s]) s = l;
      if (r < len && heap[r] > heap[s]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  for (const heap of heaps) {
    for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(heap, i, heap.length);
  }
  let result = 0;
  for (let step = 0; step < n; step++) {
    let maxVal = 0;
    for (const heap of heaps) {
      maxVal = Math.max(maxVal, heap[0]);
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) siftDown(heap, 0, heap.length);
    }
    result += maxVal;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 140. 删除每行中的最大值 =====");
console.log("排序:", deleteGreatestValue([[1, 2, 4], [3, 3, 1]])); // 期望 8
console.log("堆:", deleteGreatestValueHeap([[10]])); // 期望 10

export {};
