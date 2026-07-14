// ============================================================
// 069. 带限制的子序列和
// ============================================================
// LeetCode 1425. Constrained Subsequence Sum
// 求子序列最大和，子序列中相邻元素下标差不超过 k。
// 时间复杂度：O(N)，空间复杂度：O(k)

// 方法1：单调递减队列
function constrainedSubsetSum(nums: number[], k: number): number {
  const n = nums.length;
  const dp: number[] = new Array(n).fill(0);
  const deque: number[] = [];
  let result = -Infinity;
  for (let i = 0; i < n; i++) {
    while (deque.length > 0 && deque[0] < i - k) deque.shift();
    dp[i] = nums[i] + (deque.length > 0 ? Math.max(0, dp[deque[0]]) : 0);
    while (deque.length > 0 && dp[deque[deque.length - 1]] <= dp[i]) deque.pop();
    deque.push(i);
    result = Math.max(result, dp[i]);
  }
  return result;
}

// 方法2：最大堆 + 延迟删除
function constrainedSubsetSumHeap(nums: number[], k: number): number {
  const n = nums.length;
  const heap: Array<{ val: number; idx: number }> = [];
  const pushMax = (v: { val: number; idx: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].val > heap[p].val) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const popMax = (): { val: number; idx: number } => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].val > heap[s].val) s = l;
        if (r < heap.length && heap[r].val > heap[s].val) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  let result = -Infinity;
  const dp: number[] = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    while (heap.length > 0 && heap[0].idx < i - k) popMax();
    dp[i] = nums[i] + (heap.length > 0 && heap[0].val > 0 ? heap[0].val : 0);
    pushMax({ val: dp[i], idx: i });
    result = Math.max(result, dp[i]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 069. 带限制的子序列和 =====");
console.log("单调队列:", constrainedSubsetSum([10, 2, -10, 5, 20], 2)); // 期望 37
console.log("堆:", constrainedSubsetSumHeap([-1, -2, -3], 1)); // 期望 -1

export {};
