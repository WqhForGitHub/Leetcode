// ============================================================
// 059. 统计各位数字都不同的数字个数
// ============================================================
// LeetCode 357. Count Numbers with Unique Digits
// 给定一个非负整数 n，返回 [0, 10^n) 中各位数字都不同的数字个数。
// 时间复杂度 O(n)，空间复杂度 O(1)

// 方法1：动态规划（推荐）
// dp[i] 表示 [0, 10^i) 中各位数字都不同的数字个数
// 对于 i 位数：第一位有 9 种选择（1-9），第二位有 9 种（0-9 去掉第一位），
// 第三位有 8 种，... 第 i 位有 (10 - i + 1) 种
// 状态转移：dp[i] = dp[i-1] + 9 * 9 * 8 * ... * (10 - i + 1)
// 时间复杂度 O(n)，空间复杂度 O(1)
function countNumbersWithUniqueDigits(n: number): number {
  // n = 0 时只有数字 0，返回 1
  if (n === 0) return 1;

  // n >= 10 时，10^10 > 10位数，必然有重复数字，结果与 n = 10 相同
  n = Math.min(n, 10);

  // result 初始为 n=1 的结果（0-9 共 10 个数）
  let result: number = 10;
  // unique 表示 i 位数的各位不同的数字个数
  let unique: number = 9;
  // available 表示可选的数字个数
  let available: number = 9;

  for (let i: number = 2; i <= n; i++) {
    // i 位数各位不同的个数 = 9 * 9 * 8 * ... * (10 - i + 1)
    unique *= available;
    result += unique;
    available--;
  }

  return result;
}

// 方法2：组合数学（可选）
// 直接计算每一位的选择数并累加
// 1 位数：10 个（0-9）
// 2 位数：9 * 9 = 81 个
// 3 位数：9 * 9 * 8 = 648 个
// ...
// 时间复杂度 O(n)，空间复杂度 O(1)
function countNumbersWithUniqueDigits2(n: number): number {
  if (n === 0) return 1;

  let result: number = 1; // 数字 0

  for (let i: number = 1; i <= n && i <= 10; i++) {
    // i 位数各位都不同的个数
    let count: number = 9; // 第一位：1-9 共 9 种
    for (let j: number = 1; j < i; j++) {
      count *= 10 - j; // 后续位：依次少一个选择
    }
    result += count;
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 059. 统计各位数字都不同的数字个数 =====");
console.log(countNumbersWithUniqueDigits(2)); // 期望结果: 91
console.log(countNumbersWithUniqueDigits(0)); // 期望结果: 1
console.log(countNumbersWithUniqueDigits(3)); // 期望结果: 739
console.log(countNumbersWithUniqueDigits(1)); // 期望结果: 10
console.log(countNumbersWithUniqueDigits2(2)); // 期望结果: 91

export {};
