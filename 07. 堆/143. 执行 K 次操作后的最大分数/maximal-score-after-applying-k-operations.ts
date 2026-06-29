// ============================================================
// 143. 执行 K 次操作后的最大分数
// ============================================================
// LeetCode 2530. Maximal Score After Applying K Operations
// 每次选最大元素加到分数中，然后将其替换为 ceil(nums[i] / 3)。
// 时间复杂度：O(n + k log n)，空间复杂度：O(n)

// 方法1：最大堆
function maxKelements(nums: number[], k: number): number {
  const heap: number[] = [...nums];
  // 建最大堆
  const siftDown = (i: number, len: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l] > heap[s]) s = l;
      if (r < len && heap[r] > heap[s]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i, heap.length);
  let result = 0;
  for (let i = 0; i < k; i++) {
    result += heap[0];
    heap[0] = Math.ceil(heap[0] / 3);
    siftDown(0, heap.length);
  }
  return result;
}

// 方法2：最大堆（BigInt 防溢出）
function maxKelementsBig(nums: number[], k: number): number {
  const heap: number[] = [...nums];
  const siftDown = (i: number, len: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l] > heap[s]) s = l;
      if (r < len && heap[r] > heap[s]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i, heap.length);
  let result = 0n;
  for (let i = 0; i < k; i++) {
    result += BigInt(heap[0]);
    heap[0] = Math.ceil(heap[0] / 3);
    siftDown(0, heap.length);
  }
  return Number(result);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 143. 执行 K 次操作后的最大分数 =====");
console.log("堆:", maxKelements([10, 10, 10, 10, 10], 5)); // 期望 50
console.log("堆:", maxKelements([1, 10, 3, 3, 3], 3)); // 期望 17

export {};
