// ============================================================
// 031. 有效的完全平方数
// ============================================================
// LeetCode 367. Valid Perfect Square
// 给定正整数 num，判断是否是完全平方数。不能使用内置库函数。

// 方法1：二分查找
function isPerfectSquare(num: number): boolean {
  if (num < 2) return true;
  let left = 2;
  let right = Math.floor(num / 2);
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const sq = mid * mid;
    if (sq === num) return true;
    if (sq < num) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return false;
}

// 方法2：牛顿迭代法
function isPerfectSquareNewton(num: number): boolean {
  if (num < 2) return true;
  let x = num / 2;
  while (x * x > num) {
    x = Math.floor((x + Math.floor(num / x)) / 2);
  }
  return x * x === num;
}

// 方法3：等差数列性质（1+3+5+7+... 完全平方数）
function isPerfectSquareOdd(num: number): boolean {
  let i = 1;
  while (num > 0) {
    num -= i;
    i += 2;
  }
  return num === 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 031. 有效的完全平方数 =====");
console.log("二分 16:", isPerfectSquare(16)); // true
console.log("二分 14:", isPerfectSquare(14)); // false
console.log("牛顿 16:", isPerfectSquareNewton(16)); // true
console.log("等差 16:", isPerfectSquareOdd(16)); // true
console.log("等差 14:", isPerfectSquareOdd(14)); // false

export {};
