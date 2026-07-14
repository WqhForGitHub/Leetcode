// ============================================================
// 056. 整数拆分
// ============================================================
// LeetCode 343. Integer Break
// 给定一个正整数 n，将其拆分为至少两个正整数的和，并使这些整数的乘积最大化。
// 返回可以获得的最大乘积。
// 时间复杂度 O(n²)，空间复杂度 O(n)

// 方法1：动态规划（推荐）
// dp[i] 表示将整数 i 拆分（至少两个数）后获得的最大乘积
// 状态转移：dp[i] = max(j * max(dp[i - j], i - j))，j 从 1 到 i-1
// 其中 j 是拆出的第一个数，i - j 可以继续拆（dp[i - j]）或不拆（i - j）
// 时间复杂度 O(n²)，空间复杂度 O(n)
function integerBreak(n: number): number {
  const dp: number[] = new Array(n + 1).fill(0);
  // dp[1] = 0（1 无法拆分为至少两个正整数）

  for (let i: number = 2; i <= n; i++) {
    for (let j: number = 1; j < i; j++) {
      // 将 i 拆分为 j 和 i - j
      // i - j 可以继续拆分（取 dp[i - j]）或不拆分（取 i - j 本身）
      dp[i] = Math.max(dp[i], j * Math.max(dp[i - j], i - j));
    }
  }

  return dp[n];
}

// 方法2：数学 / 贪心（可选）
// 数学证明：将 n 尽量拆成 3 的和，余数为 0 时全用 3，余数为 1 时用一对 2 替换一个 3+1
// 时间复杂度 O(1)，空间复杂度 O(1)
function integerBreak2(n: number): number {
  // n <= 3 时必须拆成 1 + (n-1)，乘积为 n - 1
  if (n <= 3) return n - 1;

  const quotient: number = Math.floor(n / 3);
  const remainder: number = n % 3;

  if (remainder === 0) {
    // 全部拆成 3
    return Math.pow(3, quotient);
  } else if (remainder === 1) {
    // 余 1 时，把一个 3 + 1 换成 2 + 2（3*1 < 2*2）
    return Math.pow(3, quotient - 1) * 4;
  } else {
    // 余 2 时，直接乘 2
    return Math.pow(3, quotient) * 2;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 056. 整数拆分 =====");
console.log(integerBreak(2)); // 期望结果: 1 (1+1)
console.log(integerBreak(10)); // 期望结果: 36 (3+3+4)
console.log(integerBreak(8)); // 期望结果: 18 (3+3+2)
console.log(integerBreak(4)); // 期望结果: 4 (2+2)
console.log(integerBreak2(10)); // 期望结果: 36

export {};
