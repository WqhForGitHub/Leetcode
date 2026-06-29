// ============================================================
// 126. 使数组可以被整除的最少删除次数
// ============================================================
// LeetCode 2344. Minimum Deletions to Make Array Divisible
// 删除 nums 中最少的元素，使 numsDivide 的所有元素都能被 nums 的最小元素整除。
// 时间复杂度：O(n + m log m)，空间复杂度：O(1)

// 方法1：求所有 numsDivide 的 GCD + 排序
function minOperations(nums: number[], numsDivide: number[]): number {
  const gcd = (a: number, b: number): number => {
    while (b !== 0) { [a, b] = [b, a % b]; }
    return a;
  };
  let g = numsDivide[0];
  for (let i = 1; i < numsDivide.length; i++) {
    g = gcd(g, numsDivide[i]);
  }
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > g) return -1;
    if (g % nums[i] === 0) return i;
  }
  return -1;
}

// 方法2：最小堆
function minOperationsHeap(nums: number[], numsDivide: number[]): number {
  const gcd = (a: number, b: number): number => {
    while (b !== 0) { [a, b] = [b, a % b]; }
    return a;
  };
  let g = numsDivide[0];
  for (let i = 1; i < numsDivide.length; i++) {
    g = gcd(g, numsDivide[i]);
  }
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
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i, heap.length);
  let deletions = 0;
  while (heap.length > 0) {
    const min = heap[0];
    if (min > g) return -1;
    if (g % min === 0) return deletions;
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(0, heap.length);
    deletions++;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 126. 使数组可以被整除的最少删除次数 =====");
console.log("排序:", minOperations([2, 3, 2, 4, 3], [9, 6, 9, 3, 15])); // 期望 2
console.log("堆:", minOperationsHeap([4, 3, 6], [8, 9, 12])); // 期望 -1

export {};
