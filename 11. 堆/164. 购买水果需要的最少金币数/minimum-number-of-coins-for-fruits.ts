// ============================================================
// 164. 购买水果需要的最少金币数
// ============================================================
// LeetCode 2969. Minimum Number of Coins to be Spent on Fruits
// 第 i 个水果价格 prices[i]，买一个水果可以免费获得后面两个水果，求买所有水果的最小花费。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：最小堆（贪心）
function minimumCoins(prices: number[]): number {
  const n = prices.length;
  // dp[i] = 买前 i 个水果的最小花费
  // dp[i] = min(dp[j] + prices[j]) for j in [ceil(i/2)-1, i-1]
  const dp: number[] = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  // 最小堆维护 [dp[j] + prices[j], j]
  const heap: Array<[number, number]> = [];
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] < heap[p][0]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < len && heap[l][0] < heap[s][0]) s = l;
      if (r < len && heap[r][0] < heap[s][0]) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  for (let i = 1; i <= n; i++) {
    // j = i - 1, 买了 j 号水果(1-indexed)可以覆盖到 2j+1
    const j = i - 1; // 0-indexed
    const val = dp[j] + prices[j];
    heap.push([val, j]);
    siftUp(heap.length - 1);
    // 移除过期的：买 j 号水果只能覆盖 2*j+2 (0-indexed: j -> 2j+1, 2j+2)
    // 如果 i > 2*j + 2，则 j 不能覆盖 i
    while (heap.length > 0 && 2 * (heap[0][1] + 1) < i) {
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) siftDown();
    }
    dp[i] = heap[0][0];
  }
  return dp[n];
}

// 方法2：动态规划
function minimumCoinsDP(prices: number[]): number {
  const n = prices.length;
  const dp: number[] = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    // 买第 i 个水果（1-indexed），覆盖 2i 个
    for (let j = Math.ceil(i / 2); j <= i; j++) {
      dp[Math.min(2 * i, n)] = Math.min(dp[Math.min(2 * i, n)], dp[j - 1] + prices[j - 1]);
    }
  }
  return dp[n];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 164. 购买水果需要的最少金币数 =====");
console.log("堆:", minimumCoins([3, 1, 2])); // 期望 4
console.log("DP:", minimumCoinsDP([1, 10, 1, 1])); // 期望 2

export {};
