// ============================================================
// 145. 最大子序列的分数
// ============================================================
// LeetCode 2542. Maximum Subsequence Score
// 从 nums1 和 nums2 各选 k 个下标，使 sum(nums1[选中的]) * min(nums2[选中的]) 最大。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：排序 + 最小堆
function maxScore(nums1: number[], nums2: number[], k: number): number {
  const n = nums1.length;
  const pairs: Array<[number, number]> = nums2.map((v, i) => [v, nums1[i]]);
  // 按 nums2 降序排序
  pairs.sort((a, b) => b[0] - a[0]);
  const minHeap: number[] = [];
  let sum = 0;
  let result = 0;
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (minHeap[i] < minHeap[p]) { [minHeap[i], minHeap[p]] = [minHeap[p], minHeap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = minHeap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && minHeap[l] < minHeap[s]) s = l;
      if (r < len && minHeap[r] < minHeap[s]) s = r;
      if (s !== i) { [minHeap[i], minHeap[s]] = [minHeap[s], minHeap[i]]; i = s; }
      else break;
    }
  };
  for (let i = 0; i < n; i++) {
    const [n2, n1] = pairs[i];
    minHeap.push(n1);
    sum += n1;
    siftUp(minHeap.length - 1);
    if (minHeap.length > k) {
      sum -= minHeap[0];
      minHeap[0] = minHeap[minHeap.length - 1];
      minHeap.pop();
      if (minHeap.length > 0) siftDown();
    }
    if (minHeap.length === k) {
      result = Math.max(result, sum * n2);
    }
  }
  return result;
}

// 方法2：排序 + 快速选择（当 k 较小时退化）
function maxScoreSort(nums1: number[], nums2: number[], k: number): number {
  const n = nums1.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => nums2[b] - nums2[a]);
  let sum = 0;
  const minHeap: number[] = [];
  let result = 0;
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (minHeap[i] < minHeap[p]) { [minHeap[i], minHeap[p]] = [minHeap[p], minHeap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = minHeap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && minHeap[l] < minHeap[s]) s = l;
      if (r < len && minHeap[r] < minHeap[s]) s = r;
      if (s !== i) { [minHeap[i], minHeap[s]] = [minHeap[s], minHeap[i]]; i = s; }
      else break;
    }
  };
  for (const idx of indices) {
    minHeap.push(nums1[idx]);
    sum += nums1[idx];
    siftUp(minHeap.length - 1);
    if (minHeap.length > k) {
      sum -= minHeap[0];
      minHeap[0] = minHeap[minHeap.length - 1];
      minHeap.pop();
      if (minHeap.length > 0) siftDown();
    }
    if (minHeap.length === k) {
      result = Math.max(result, sum * nums2[idx]);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 145. 最大子序列的分数 =====");
console.log("堆:", maxScore([1, 3, 3, 2], [2, 1, 3, 4], 3)); // 期望 12
console.log("堆:", maxScore([4, 2, 3, 1, 1], [7, 5, 10, 9, 6], 1)); // 期望 30

export {};
