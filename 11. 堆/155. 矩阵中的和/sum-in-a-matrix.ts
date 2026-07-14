// ============================================================
// 155. 矩阵中的和
// ============================================================
// LeetCode 2679. Sum in a Matrix
// 每轮每行选最大值，累加所有行最大值中的最大值。
// 时间复杂度：O(mn log n)，空间复杂度：O(1)

// 方法1：排序
function matrixSum(nums: number[][]): number {
  for (const row of nums) {
    row.sort((a, b) => b - a);
  }
  let result = 0;
  const m = nums.length;
  const n = nums[0].length;
  for (let j = 0; j < n; j++) {
    let maxVal = 0;
    for (let i = 0; i < m; i++) {
      maxVal = Math.max(maxVal, nums[i][j]);
    }
    result += maxVal;
  }
  return result;
}

// 方法2：最大堆
function matrixSumHeap(nums: number[][]): number {
  const m = nums.length;
  const n = nums[0].length;
  const heaps: number[][] = nums.map((row) => [...row]);
  const siftDown = (heap: number[], i: number, len: number): void => {
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
  for (const heap of heaps) {
    for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(heap, i, heap.length);
  }
  let result = 0;
  for (let round = 0; round < n; round++) {
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
console.log("===== 155. 矩阵中的和 =====");
console.log(
  "排序:",
  matrixSum([
    [7, 2, 1],
    [6, 4, 2],
    [6, 5, 3],
    [3, 2, 1],
  ]),
); // 期望 15
console.log("堆:", matrixSumHeap([[1]])); // 期望 1

export {};
