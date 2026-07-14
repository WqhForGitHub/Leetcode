// ============================================================
// 065. 给定范围内 K 位数字之和
// ============================================================
// LeetCode（竞赛题）. Sum of K-Digits in Range
// 给定整数 l, r, k，求 [l, r] 范围内所有 k 位数字之和。
// k 位数字定义：恰好有 k 位的数字。k=1 时范围 [0, 9]（含 0，唯一以 0 开头的 1 位数）；
// k>=2 时范围 [10^(k-1), 10^k - 1]。
// 时间复杂度：O(1) / O(k), 空间复杂度：O(1) / O(k)

// k 位数字的下界
function kDigitLow(k: number): number {
  if (k === 1) return 0; // 1 位数含 0
  return Math.pow(10, k - 1);
}

// k 位数字的上界
function kDigitHigh(k: number): number {
  if (k === 1) return 9;
  return Math.pow(10, k) - 1;
}

// 方法1：等差数列求和（推荐）
// 取交集 [max(l, lo), min(r, hi)]，若非空用等差数列求和公式 (首项+末项)*项数/2
// 时间复杂度 O(1)，空间复杂度 O(1)
function sumOfKDigitsInRange(l: number, r: number, k: number): number {
  if (l > r || k < 1) return 0;
  const lo: number = kDigitLow(k);
  const hi: number = kDigitHigh(k);
  const a: number = Math.max(l, lo);
  const b: number = Math.min(r, hi);
  if (a > b) return 0;
  return ((a + b) * (b - a + 1)) / 2;
}

// 方法2：数位 DP 求和
// sumLeq(X, k) = 所有 <= X 的 k 位数字之和，答案 = sumLeq(r, k) - sumLeq(l-1, k)
// 逐位枚举（首位下界 k>=2 时为 1，k=1 时为 0），记忆化 tight=false 的状态。
// 时间复杂度 O(k)，空间复杂度 O(k)
function sumOfKDigitsInRangeDP(l: number, r: number, k: number): number {
  if (l > r || k < 1) return 0;

  function sumLeq(X: number, kk: number): number {
    if (X < 0) return 0;
    const lo: number = kDigitLow(kk);
    const hi: number = kDigitHigh(kk);
    if (X < lo) return 0;
    const limit: number = Math.min(X, hi);
    const s: string = limit.toString();
    const n: number = s.length; // == kk

    // 记忆化: memo[pos] = [count, sum]（仅 tight=false 时缓存）
    const memo: Array<[number, number] | null> = new Array<[number, number] | null>(n).fill(null);

    function dfs(pos: number, tight: boolean): [number, number] {
      if (pos === n) return [1, 0]; // count=1, sum=0（空后缀）
      if (!tight) {
        const cached: [number, number] | null = memo[pos];
        if (cached !== null) return cached;
      }
      const limitDigit: number = tight ? Number(s[pos]) : 9;
      const startDigit: number = pos === 0 && kk >= 2 ? 1 : 0; // 首位不能为 0（k>=2）
      let totalCount: number = 0;
      let totalSum: number = 0;
      for (let d: number = startDigit; d <= limitDigit; d++) {
        const sub: [number, number] = dfs(pos + 1, tight && d === limitDigit);
        const cnt: number = sub[0];
        const sum: number = sub[1];
        totalCount += cnt;
        totalSum += sum + d * cnt * Math.pow(10, n - 1 - pos);
      }
      const result: [number, number] = [totalCount, totalSum];
      if (!tight) memo[pos] = result;
      return result;
    }

    return dfs(0, true)[1];
  }

  return sumLeq(r, k) - sumLeq(l - 1, k);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 065. 给定范围内 K 位数字之和 =====");
console.log("方法1:");
console.log(sumOfKDigitsInRange(5, 15, 1)); // 期望结果: 35 (5+6+7+8+9)
console.log(sumOfKDigitsInRange(10, 99, 2)); // 期望结果: 4905 (10+11+...+99)
console.log(sumOfKDigitsInRange(50, 60, 2)); // 期望结果: 605 (50+51+...+60)
console.log(sumOfKDigitsInRange(5, 15, 2)); // 期望结果: 75 (10+11+12+13+14+15)
console.log(sumOfKDigitsInRange(1, 5, 2)); // 期望结果: 0 (无 2 位数)
console.log(sumOfKDigitsInRange(100, 100, 3)); // 期望结果: 100
console.log("方法2:");
console.log(sumOfKDigitsInRangeDP(5, 15, 1)); // 期望结果: 35
console.log(sumOfKDigitsInRangeDP(10, 99, 2)); // 期望结果: 4905
console.log(sumOfKDigitsInRangeDP(50, 60, 2)); // 期望结果: 605
console.log(sumOfKDigitsInRangeDP(5, 15, 2)); // 期望结果: 75
console.log(sumOfKDigitsInRangeDP(1, 5, 2)); // 期望结果: 0
console.log(sumOfKDigitsInRangeDP(100, 100, 3)); // 期望结果: 100

export {};
