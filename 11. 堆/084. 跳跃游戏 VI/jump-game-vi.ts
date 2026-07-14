// ============================================================
// 084. 跳跃游戏 VI
// ============================================================
// LeetCode 1696. Jump Game VI
// 每次最多跳 k 步，求从起点到终点的最大得分。
// 时间复杂度：O(N)，空间复杂度：O(N)

// 方法1：单调递减队列（推荐）
function maxResult(nums: number[], k: number): number {
  const n = nums.length;
  const dp: number[] = new Array(n).fill(0);
  dp[0] = nums[0];
  const deque: number[] = [0];
  for (let i = 1; i < n; i++) {
    while (deque.length > 0 && deque[0] < i - k) deque.shift();
    dp[i] = dp[deque[0]] + nums[i];
    while (deque.length > 0 && dp[deque[deque.length - 1]] <= dp[i]) deque.pop();
    deque.push(i);
  }
  return dp[n - 1];
}

// 方法2：最大堆 + 延迟删除
function maxResultHeap(nums: number[], k: number): number {
  const n = nums.length;
  const dp: number[] = new Array(n).fill(0);
  dp[0] = nums[0];
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
  pushMax({ val: dp[0], idx: 0 });
  for (let i = 1; i < n; i++) {
    while (heap[0].idx < i - k) popMax();
    dp[i] = heap[0].val + nums[i];
    pushMax({ val: dp[i], idx: i });
  }
  return dp[n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 084. 跳跃游戏 VI =====");
console.log("单调队列:", maxResult([1, -1, -2, 4, -7, 3], 2)); // 期望 7
console.log("堆:", maxResultHeap([10, -5, -2, 4, 0, 3], 3)); // 期望 17

export {};
