// ============================================================
// 032. 快乐数
// ============================================================
// LeetCode 202. Happy Number
// 判断一个数是否是快乐数。哈希集合检测循环。
// 时间复杂度：O(log n)，空间复杂度：O(log n)

/**
 * 计算一个数各位数字的平方和
 */
function digitSquareSum(n: number): number {
  let sum = 0;
  while (n > 0) {
    const digit = n % 10;
    sum += digit * digit;
    n = Math.floor(n / 10);
  }
  return sum;
}

/**
 * 使用哈希集合检测循环
 * 不断计算数字平方和，若变为 1 则是快乐数
 * 若进入循环（出现重复数字）则不是快乐数
 */
function isHappy(n: number): boolean {
  const seen = new Set<number>();
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    n = digitSquareSum(n);
  }
  return n === 1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 032. 快乐数 =====");
// 测试 1: 19 是快乐数
// 1^2 + 9^2 = 82
// 8^2 + 2^2 = 68
// 6^2 + 8^2 = 100
// 1^2 + 0^2 + 0^2 = 1
console.log(isHappy(19)); // 期望输出: true

// 测试 2: 2 不是快乐数（会进入循环）
console.log(isHappy(2)); // 期望输出: false

// 测试 3: 1 是快乐数
console.log(isHappy(1)); // 期望输出: true

// 测试 4: 7 是快乐数
console.log(isHappy(7)); // 期望输出: true

export {};
