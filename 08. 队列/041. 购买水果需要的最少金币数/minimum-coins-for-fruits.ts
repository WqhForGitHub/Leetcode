// ============================================================
// 041. 购买水果需要的最少金币数
// ============================================================
// LeetCode 3226. Minimum Coins for Fruits
// 水果从第 1 个开始编号，第 i 个水果价格 prices[i-1]。
// 购买第 i 个水果后，可以免费获得 [i+1, 2*i] 范围内的水果。
// 求获得所有水果的最少金币。

// ------------------------------------------------------------
// 方法1：单调队列 + 动态规划
// ------------------------------------------------------------
// dp[i] = prices[i-1] + min(dp[i+1..2i])，用单调队列维护区间最小值。
// 时间 O(n)，空间 O(n)。
function minCoins1(prices: number[]): number {
  const n = prices.length;
  const dp: number[] = new Array(n + 2).fill(0);
  const deque: number[] = [n + 1]; // 存下标，dp 单调递增
  for (let i = n; i >= 1; i--) {
    // 窗口 [i+1, 2*i]
    const right = Math.min(2 * i, n + 1);
    while (deque.length > 0 && deque[0] > right) {
      deque.shift();
    }
    // 把 i+1 加入队列
    if (i + 1 <= n + 1) {
      while (deque.length > 0 && dp[deque[deque.length - 1]] >= dp[i + 1]) {
        deque.pop();
      }
      deque.push(i + 1);
    }
    dp[i] = prices[i - 1] + (deque.length > 0 ? dp[deque[0]] : 0);
  }
  return dp[1];
}

// ------------------------------------------------------------
// 方法2：优先队列
// ------------------------------------------------------------
// 从右往左处理，用最小堆维护窗口内 dp 值，惰性删除过期元素。
// 时间 O(n log n)，空间 O(n)。
function minCoins2(prices: number[]): number {
  const n = prices.length;
  const dp: number[] = new Array(n + 2).fill(0);
  const heap: { val: number; index: number }[] = [{ val: 0, index: n + 1 }];

  const push = (node: { val: number; index: number }) => {
    heap.push(node);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p].val <= heap[i].val) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };

  const pop = () => {
    const top = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    let i = 0;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (l < heap.length && heap[l].val < heap[smallest].val) smallest = l;
      if (r < heap.length && heap[r].val < heap[smallest].val) smallest = r;
      if (smallest === i) break;
      [heap[smallest], heap[i]] = [heap[i], heap[smallest]];
      i = smallest;
    }
    return top;
  };

  for (let i = n; i >= 1; i--) {
    const right = Math.min(2 * i, n + 1);
    while (heap.length > 0 && heap[0].index > right) {
      pop();
    }
    dp[i] = prices[i - 1] + (heap.length > 0 ? heap[0].val : 0);
    push({ val: dp[i], index: i });
  }
  return dp[1];
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", minCoins1([3, 1, 2]), "期望: 4");
  console.log("测试2:", minCoins1([1, 10, 1, 1]), "期望: 2");
  console.log("测试3:", minCoins2([3, 1, 2]), "期望: 4");
  console.log("测试4:", minCoins2([1, 10, 1, 1]), "期望: 2");
  console.log("测试5:", minCoins1([1, 37, 19, 38, 11, 42, 18, 33, 37, 15]), "期望: 4");
}

test();

export {};
