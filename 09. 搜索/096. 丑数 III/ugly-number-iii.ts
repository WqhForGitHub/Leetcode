// ============================================================
// 096. 丑数 III
// ============================================================
// LeetCode 1201. Ugly Number III
// 能被 a、b、c 至少一个整除的第 n 个正整数。

// 方法1：二分查找 + 容斥原理
function nthUglyNumber(n: number, a: number, b: number, c: number): number {
  const ab = lcm(a, b);
  const ac = lcm(a, c);
  const bc = lcm(b, c);
  const abc = lcm(ab, c);

  let left = 1;
  let right = 2 * 10 ** 9;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    // 容斥原理计算 <= mid 的丑数个数
    const count =
      Math.floor(mid / a) +
      Math.floor(mid / b) +
      Math.floor(mid / c) -
      Math.floor(mid / ab) -
      Math.floor(mid / ac) -
      Math.floor(mid / bc) +
      Math.floor(mid / abc);
    if (count < n) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

// 方法2：使用 BigInt 避免溢出
function nthUglyNumberBig(n: number, a: number, b: number, c: number): number {
  const ab = lcm(a, b);
  const ac = lcm(a, c);
  const bc = lcm(b, c);
  const abc = lcm(ab, c);
  let lo = 1n;
  let hi = BigInt(2 * 10 ** 9);
  while (lo < hi) {
    const mid = (lo + hi) / 2n;
    const count =
      mid / BigInt(a) +
      mid / BigInt(b) +
      mid / BigInt(c) -
      mid / BigInt(ab) -
      mid / BigInt(ac) -
      mid / BigInt(bc) +
      mid / BigInt(abc);
    if (count < BigInt(n)) lo = mid + 1n;
    else hi = mid;
  }
  return Number(lo);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 096. 丑数 III =====");
console.log("二分 3,2,3,5:", nthUglyNumber(3, 2, 3, 5)); // 4
console.log("二分 4,2,3,4:", nthUglyNumber(4, 2, 3, 4)); // 6
console.log("二分 5,2,11,13:", nthUglyNumber(5, 2, 11, 13)); // 10
console.log("二分 1000000000,2,217983653,336916467:", nthUglyNumber(1000000000, 2, 217983653, 336916467)); // 1999999984

export {};
