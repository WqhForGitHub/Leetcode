// ============================================================
// 150. 使前缀和数组非负
// ============================================================
// LeetCode 2602. Minimum Operations to Make the Array Alternating (变形)
// 通过将元素设为0，使前缀和始终非负，求最少操作次数。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：最小堆（贪心，当前缀和为负时将最小元素设为0）
function makePrefixSumNonNegative(nums: number[]): number {
  const heap: number[] = [];
  let prefix = 0;
  let ops = 0;
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] < heap[p]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
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
  for (const num of nums) {
    if (num > 0) {
      heap.push(num);
      siftUp(heap.length - 1);
    }
    prefix += num;
    while (prefix < 0 && heap.length > 0) {
      const min = heap[0];
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) siftDown();
      prefix -= min;
      ops++;
    }
  }
  return ops;
}

// 方法2：排序模拟
function makePrefixSumNonNegativeSort(nums: number[]): number {
  const positives: number[] = [];
  let prefix = 0;
  let ops = 0;
  for (const num of nums) {
    prefix += num;
    if (num > 0) positives.push(num);
    if (prefix < 0) {
      positives.sort((a, b) => a - b);
      while (prefix < 0 && positives.length > 0) {
        prefix -= positives.shift()!;
        ops++;
      }
    }
  }
  return ops;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 150. 使前缀和数组非负 =====");
console.log("堆:", makePrefixSumNonNegative([3, -5, -2, 4])); // 期望 1
console.log("排序:", makePrefixSumNonNegativeSort([2, -3, -1, 5, -4])); // 期望 1

export {};
