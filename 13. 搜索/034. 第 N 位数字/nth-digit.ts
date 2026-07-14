// ============================================================
// 034. 第 N 位数字
// ============================================================
// LeetCode 400. Nth Digit
// 无限整数序列 1,2,3,4,5,6,7,8,9,10,11,... 中返回第 n 位数字。

// 方法1：数学 + 二分
function findNthDigit(n: number): number {
  // 1-9: 9个1位数 = 9位
  // 10-99: 90个2位数 = 180位
  // 100-999: 900个3位数 = 2700位
  let digitLen = 1; // 数字位数
  let count = 9; // 该位数范围内的数字个数
  let start = 1; // 起始数字
  while (n > digitLen * count) {
    n -= digitLen * count;
    digitLen++;
    count *= 10;
    start *= 10;
  }
  // 确定是第几个数字
  const num = start + Math.floor((n - 1) / digitLen);
  // 确定是该数字的第几位
  const digitIdx = (n - 1) % digitLen;
  return Number(String(num)[digitIdx]);
}

// 方法2：直接计算（与方法1类似，更简洁）
function findNthDigitAlt(n: number): number {
  let len = 1;
  let base = 9;
  let start = 1;
  while (n > len * base) {
    n -= len * base;
    len++;
    base *= 10;
    start *= 10;
  }
  start += Math.floor((n - 1) / len);
  const s = String(start);
  return parseInt(s[(n - 1) % len]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 034. 第 N 位数字 =====");
console.log("方法1 3:", findNthDigit(3)); // 3
console.log("方法1 11:", findNthDigit(11)); // 0
console.log("方法2 3:", findNthDigitAlt(3)); // 3
console.log("方法2 11:", findNthDigitAlt(11)); // 0

export {};
