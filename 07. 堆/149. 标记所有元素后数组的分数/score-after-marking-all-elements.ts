// ============================================================
// 149. 标记所有元素后数组的分数
// ============================================================
// LeetCode 2593. Find Score of an Array After Marking All Elements
// 每次选最小未标记元素，加分，标记它和相邻元素。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：最小堆
function findScore(nums: number[]): number {
  const n = nums.length;
  const heap: Array<[number, number]> = nums.map((v, i) => [v, i]);
  const marked: boolean[] = new Array(n).fill(false);
  const siftDown = (i: number, len: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (
        l < len &&
        (heap[l][0] < heap[s][0] || (heap[l][0] === heap[s][0] && heap[l][1] < heap[s][1]))
      )
        s = l;
      if (
        r < len &&
        (heap[r][0] < heap[s][0] || (heap[r][0] === heap[s][0] && heap[r][1] < heap[s][1]))
      )
        s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i, heap.length);
  let score = 0;
  while (heap.length > 0) {
    const [val, idx] = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(0, heap.length);
    if (marked[idx]) continue;
    marked[idx] = true;
    score += val;
    if (idx > 0) marked[idx - 1] = true;
    if (idx < n - 1) marked[idx + 1] = true;
  }
  return score;
}

// 方法2：排序
function findScoreSort(nums: number[]): number {
  const n = nums.length;
  const indexed: Array<[number, number]> = nums.map((v, i) => [v, i]);
  indexed.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const marked: boolean[] = new Array(n).fill(false);
  let score = 0;
  for (const [val, idx] of indexed) {
    if (marked[idx]) continue;
    marked[idx] = true;
    score += val;
    if (idx > 0) marked[idx - 1] = true;
    if (idx < n - 1) marked[idx + 1] = true;
  }
  return score;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 149. 标记所有元素后数组的分数 =====");
console.log("堆:", findScore([2, 1, 3, 4, 5, 2])); // 期望 7
console.log("排序:", findScoreSort([2, 3, 5, 1, 3, 2])); // 期望 5

export {};
