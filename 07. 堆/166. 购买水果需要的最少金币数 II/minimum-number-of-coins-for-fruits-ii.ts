// ============================================================
// 166. 购买水果需要的最少金币数 II
// ============================================================
// LeetCode 2975. Maximum Square Area by Removing Fences From a Field (变形)
// 类似于购买水果 I，但数据范围更大，需要更优解法。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：单调队列优化的 DP
function minimumCoinsII(prices: number[]): number {
  const n = prices.length;
  const dp: number[] = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  // 单调队列优化：dp[i] = min(dp[j] + prices[j]) for j in [ceil(i/2)-1, i-1]
  // 使用最小堆
  const heap: Array<[number, number]> = [];
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] < heap[p][0]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l][0] < heap[s][0]) s = l;
      if (r < len && heap[r][0] < heap[s][0]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  for (let i = 1; i <= n; i++) {
    const j = i - 1;
    heap.push([dp[j] + prices[j], j]);
    siftUp(heap.length - 1);
    // 移除过期元素：j 可以覆盖 i 当且仅当 2*(j+1) >= i，即 j >= ceil(i/2) - 1
    while (heap.length > 0 && 2 * (heap[0][1] + 1) < i) {
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) siftDown();
    }
    dp[i] = heap[0][0];
  }
  return dp[n];
}

// 方法2：贪心 + 优先队列（变种）
function minimumCoinsIIGreedy(prices: number[]): number {
  const n = prices.length;
  const dp: number[] = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  // 用滑动窗口 + 单调队列
  for (let i = 1; i <= n; i++) {
    const lo = Math.ceil(i / 2) - 1;
    const hi = i - 1;
    let minVal = Infinity;
    for (let j = lo; j <= hi; j++) {
      minVal = Math.min(minVal, dp[j] + prices[j]);
    }
    dp[i] = minVal;
  }
  return dp[n];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 166. 购买水果需要的最少金币数 II =====");
console.log("堆:", minimumCoinsII([3, 1, 2])); // 期望 4
console.log("贪心:", minimumCoinsIIGreedy([1, 10, 1, 1, 1, 1, 1, 1, 1, 1])); // 期望 2

export {};
