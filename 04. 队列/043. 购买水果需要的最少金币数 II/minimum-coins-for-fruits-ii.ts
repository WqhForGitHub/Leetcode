// ============================================================
// 043. 购买水果需要的最少金币数 II
// ============================================================
// LeetCode 3452. Minimum Coins for Fruits II
// 与 041 类似，但水果数量更大，需要更优的解法。
// 第 i 个水果价格 prices[i-1]，购买后免费获得 [i+1, 2*i] 范围内水果。

// ------------------------------------------------------------
// 方法1：单调队列优化 DP
// ------------------------------------------------------------
// 从右往左，dp[i] = prices[i-1] + min(dp[i+1..2i])。
// 时间 O(n)，空间 O(n)。
function minCoinsII1(prices: number[]): number {
  const n = prices.length;
  const dp: number[] = new Array(n + 2).fill(0);
  const deque: number[] = [n + 1];
  for (let i = n; i >= 1; i--) {
    const right = Math.min(2 * i, n + 1);
    while (deque.length > 0 && deque[0] > right) {
      deque.shift();
    }
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
// 方法2：线段树优化 DP
// ------------------------------------------------------------
// 用线段树维护 dp 的区间最小值，每次查询 [i+1, 2*i]。
// 时间 O(n log n)，空间 O(n)。
function minCoinsII2(prices: number[]): number {
  const n = prices.length;
  let m = 1;
  while (m < n + 2) m <<= 1;
  const tree: number[] = new Array(2 * m).fill(0);

  const update = (index: number, val: number): void => {
    index += m;
    tree[index] = val;
    index >>= 1;
    while (index > 0) {
      tree[index] = Math.min(tree[2 * index], tree[2 * index + 1]);
      index >>= 1;
    }
  };

  const query = (l: number, r: number): number => {
    l += m;
    r += m + 1;
    let result = Infinity;
    while (l < r) {
      if (l & 1) result = Math.min(result, tree[l++]);
      if (r & 1) result = Math.min(result, tree[--r]);
      l >>= 1;
      r >>= 1;
    }
    return result;
  };

  const dp: number[] = new Array(n + 2).fill(0);
  update(n + 1, 0);
  for (let i = n; i >= 1; i--) {
    const right = Math.min(2 * i, n + 1);
    const best = query(i + 1, right);
    dp[i] = prices[i - 1] + best;
    update(i, dp[i]);
  }
  return dp[1];
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", minCoinsII1([3, 1, 2]), "期望: 4");
  console.log("测试2:", minCoinsII1([1, 10, 1, 1]), "期望: 2");
  console.log("测试3:", minCoinsII2([3, 1, 2]), "期望: 4");
  console.log("测试4:", minCoinsII2([1, 10, 1, 1]), "期望: 2");
}

test();

export {};
