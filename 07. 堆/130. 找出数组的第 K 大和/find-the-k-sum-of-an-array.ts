// ============================================================
// 130. 找出数组的第 K 大和
// ============================================================
// LeetCode 2386. Find the K-Sum of an Array
// 找出数组的所有子序列和的第 k 大。
// 时间复杂度：O(n log n + k log k)，空间复杂度：O(n + k)

// 方法1：最小堆
function kSum(nums: number[], k: number): number {
  let total = 0;
  const abs: number[] = [];
  for (const num of nums) {
    if (num >= 0) total += num;
    abs.push(Math.abs(num));
  }
  abs.sort((a, b) => a - b);
  // 最小堆，存储 [当前和, 下一个要减的索引]
  const heap: Array<[number, number]> = [[0, 0]];
  let result = total;
  for (let i = 0; i < k; i++) {
    const [sum, idx] = heap[0];
    result = total - sum;
    // 替换堆顶
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(heap, 0);
    if (idx < abs.length) {
      // 加下一个元素
      heap.push([sum + abs[idx], idx + 1]);
      siftUp(heap, heap.length - 1);
      if (idx > 0) {
        // 替换前一个
        heap.push([sum + abs[idx] - abs[idx - 1], idx + 1]);
        siftUp(heap, heap.length - 1);
      }
    }
  }
  return result;

  function siftUp(h: Array<[number, number]>, i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[i][0] < h[p][0]) { [h[i], h[p]] = [h[p], h[i]]; i = p; }
      else break;
    }
  }
  function siftDown(h: Array<[number, number]>, i: number): void {
    const n = h.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && h[l][0] < h[s][0]) s = l;
      if (r < n && h[r][0] < h[s][0]) s = r;
      if (s !== i) { [h[i], h[s]] = [h[s], h[i]]; i = s; }
      else break;
    }
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 130. 找出数组的第 K 大和 =====");
console.log("堆:", kSum([2, 4, -2], 5)); // 期望 2
console.log("堆:", kSum([1, -2, 3, 4, -10, 12], 5)); // 期望 5

export {};
