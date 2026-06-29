// ============================================================
// 138. 购买苹果的最低成本
// ============================================================
// LeetCode 2467. Most Profitable Path in a Tree (变形)
// 在树中从根到叶路径上购买苹果，给定价格和成本。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：BFS + 最小堆
function minCostToBuyApples(prices: number[]): number {
  // 简化版：每层选最小价格的苹果
  const result: number[] = [];
  const heap: number[] = [...prices];
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
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i, heap.length);
  while (heap.length > 0) {
    result.push(heap[0]);
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(0, heap.length);
  }
  return result.reduce((a, b) => a + b, 0);
}

// 方法2：排序贪心
function minCostToBuyApplesSort(prices: number[]): number {
  const sorted = [...prices].sort((a, b) => a - b);
  return sorted.reduce((a, b) => a + b, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 138. 购买苹果的最低成本 =====");
console.log("堆:", minCostToBuyApples([3, 1, 2])); // 期望 6
console.log("排序:", minCostToBuyApplesSort([5, 2, 8, 1])); // 期望 16

export {};
