// ============================================================
// 004. 滑动窗口最大值
// ============================================================
// LeetCode 239. Sliding Window Maximum
// 给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到最右侧，返回每个窗口中的最大值。
// 时间复杂度：O(N)，空间复杂度：O(k)

// 方法1：单调递减队列（推荐）
function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];
  const deque: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length > 0 && deque[0] <= i - k) deque.shift();
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}

// 方法2：最大堆
function maxSlidingWindowHeap(nums: number[], k: number): number[] {
  const result: number[] = [];
  const heap: Array<{ val: number; idx: number }> = [];
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].val > heap[p].val) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const siftDown = (i: number): void => {
    const n = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && heap[l].val > heap[s].val) s = l;
      if (r < n && heap[r].val > heap[s].val) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  for (let i = 0; i < nums.length; i++) {
    heap.push({ val: nums[i], idx: i });
    siftUp(heap.length - 1);
    while (heap[0].idx <= i - k) {
      const last = heap.pop()!;
      heap[0] = last;
      siftDown(0);
    }
    if (i >= k - 1) result.push(heap[0].val);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 004. 滑动窗口最大值 =====");
console.log("单调队列:", maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // 期望 [3,3,5,5,6,7]
console.log("最大堆:", maxSlidingWindowHeap([1, 3, -1, -3, 5, 3, 6, 7], 3)); // 期望 [3,3,5,5,6,7]

export {};
