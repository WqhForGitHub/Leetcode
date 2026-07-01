// ============================================================
// 072. 第 N 个神奇数字
// ============================================================
// LeetCode 878. Nth Magical Number
// 能被 a 或 b 整除的正整数中第 n 个。结果对 10^9+7 取模。

// 方法1：二分查找 + 数学
function nthMagicalNumber(n: number, a: number, b: number): number {
  const mod = 1_000_000_007;
  const lcm = (a * b) / gcd(a, b);
  let left = Math.min(a, b);
  let right = left * n;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    // 小于等于 mid 的神奇数字个数
    const count = Math.floor(mid / a) + Math.floor(mid / b) - Math.floor(mid / lcm);
    if (count < n) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left % mod;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// 方法2：使用 BigInt 避免溢出
function nthMagicalNumberBig(n: number, a: number, b: number): number {
  const mod = 1000000007n;
  const aBig = BigInt(a);
  const bBig = BigInt(b);
  const lcmBig = (aBig * bBig) / BigInt(gcd(a, b));
  let left = BigInt(Math.min(a, b));
  let right = left * BigInt(n);
  while (left < right) {
    const mid = (left + right) / 2n;
    const count = mid / aBig + mid / bBig - mid / lcmBig;
    if (count < BigInt(n)) {
      left = mid + 1n;
    } else {
      right = mid;
    }
  }
  return Number(left % mod);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 072. 第 N 个神奇数字 =====");
console.log("二分 1,2,3:", nthMagicalNumber(1, 2, 3)); // 2
console.log("二分 4,2,3:", nthMagicalNumber(4, 2, 3)); // 6
console.log("二分 5,2,4:", nthMagicalNumber(5, 2, 4)); // 10
console.log("二分 3,6,4:", nthMagicalNumber(3, 6, 4)); // 8

export {};
