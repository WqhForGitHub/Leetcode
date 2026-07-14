// ============================================================
// 062. 猜数字大小 II
// ============================================================
// LeetCode 375. Guess Number Higher or Lower II
// 猜 1 到 n 的数字，猜错支付猜的金额，求保证赢的最少金额。
// 时间复杂度 O(n^3)，空间复杂度 O(n^2)

// 方法1：区间动态规划（推荐）
// dp[i][j] = 猜 i 到 j 的最少金额
// 状态转移：dp[i][j] = min(k + max(dp[i][k-1], dp[k+1][j])) for k in [i, j]
// 含义：猜 k，最坏情况取左右子区间的较大值，加上 k 本身的代价
// 时间复杂度 O(n^3)，空间复杂度 O(n^2)
function getMoneyAmount(n: number): number {
  // dp[i][j] 表示猜 [i, j] 范围内数字保证赢的最少金额
  const dp: number[][] = new Array(n + 2);
  for (let i: number = 0; i < n + 2; i++) {
    dp[i] = new Array(n + 2).fill(0);
  }

  // 区间长度从小到大枚举
  for (let len: number = 2; len <= n; len++) {
    for (let i: number = 1; i + len - 1 <= n; i++) {
      const j: number = i + len - 1;
      dp[i][j] = Infinity;
      // 枚举第一次猜的数字 k
      for (let k: number = i; k <= j; k++) {
        // 猜 k 后，最坏情况是去左右较大的子区间
        // 左区间 [i, k-1]，右区间 [k+1, j]
        const cost: number = k + Math.max(dp[i][k - 1], dp[k + 1][j]);
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }

  return dp[1][n];
}

// 方法2：递归 + 记忆化
// 同样的状态转移，用递归方式实现
// 时间复杂度 O(n^3)，空间复杂度 O(n^2)
function getMoneyAmount2(n: number): number {
  const memo: Map<string, number> = new Map();

  function solve(start: number, end: number): number {
    if (start >= end) return 0; // 只有一个数或没有数，不用花钱
    const key: string = `${start},${end}`;
    if (memo.has(key)) return memo.get(key)!;

    let result: number = Infinity;
    for (let k: number = start; k <= end; k++) {
      // 猜 k，取左右子问题的较大值（最坏情况）
      const cost: number = k + Math.max(solve(start, k - 1), solve(k + 1, end));
      result = Math.min(result, cost);
    }
    memo.set(key, result);
    return result;
  }

  return solve(1, n);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 062. 猜数字大小 II =====");
console.log(getMoneyAmount(10)); // 期望结果: 16
console.log(getMoneyAmount(1)); // 期望结果: 0
console.log(getMoneyAmount(2)); // 期望结果: 1
console.log(getMoneyAmount(5)); // 期望结果: 6

export {};
