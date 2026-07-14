// ============================================================
// 172. 执行操作标记数组中的元素
// ============================================================
// LeetCode 3080. Mark Elements on Array by Performing Queries
// 每次查询：标记 index=queries[i][0] 的元素，并标记未标记元素中最小的 queries[i][1] 个。
// 返回未标记元素之和。
// 时间复杂度：O(n log n + q * k log n)，空间复杂度：O(n)

// 方法1：最小堆 + 标记数组
function unmarkedSumArray(nums: number[], queries: number[][]): number[] {
  const n = nums.length;
  const marked: boolean[] = new Array(n).fill(false);
  let totalSum = 0;
  for (const num of nums) totalSum += num;
  // 最小堆 [value, index]
  const heap: Array<[number, number]> = nums.map((v, i) => [v, i]);
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
  const result: number[] = [];
  for (const [index, k] of queries) {
    // 标记指定下标
    if (!marked[index]) {
      marked[index] = true;
      totalSum -= nums[index];
    }
    // 标记最小的 k 个未标记元素
    let count = 0;
    while (count < k && heap.length > 0) {
      const [val, idx] = heap[0];
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) siftDown(0, heap.length);
      if (marked[idx]) continue;
      marked[idx] = true;
      totalSum -= val;
      count++;
    }
    result.push(totalSum);
  }
  return result;
}

// 方法2：排序 + 指针
function unmarkedSumArraySort(nums: number[], queries: number[][]): number[] {
  const n = nums.length;
  const marked: boolean[] = new Array(n).fill(false);
  let totalSum = 0;
  for (const num of nums) totalSum += num;
  const indexed: Array<{ val: number; idx: number }> = nums.map((v, i) => ({ val: v, idx: i }));
  indexed.sort((a, b) => a.val - b.val || a.idx - b.idx);
  let ptr = 0;
  const result: number[] = [];
  for (const [index, k] of queries) {
    if (!marked[index]) {
      marked[index] = true;
      totalSum -= nums[index];
    }
    let count = 0;
    while (count < k && ptr < n) {
      const { val, idx } = indexed[ptr++];
      if (marked[idx]) continue;
      marked[idx] = true;
      totalSum -= val;
      count++;
    }
    result.push(totalSum);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 172. 执行操作标记数组中的元素 =====");
console.log(
  "堆:",
  unmarkedSumArray(
    [1, 2, 4, 5, 6],
    [
      [0, 2],
      [2, 1],
    ],
  ),
); // 期望 [10, 5]
console.log(
  "排序:",
  unmarkedSumArraySort(
    [1, 2, 3],
    [
      [0, 1],
      [1, 1],
    ],
  ),
); // 期望 [5, 3]

export {};
