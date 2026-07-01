// ============================================================
// 005. x 的平方根
// ============================================================
// LeetCode 69. Sqrt(x)
// 给定非负整数 x，计算并返回 x 的算术平方根的整数部分。

// 方法1：二分查找
function mySqrt(x: number): number {
  if (x < 2) return x;
  let left = 1;
  let right = Math.floor(x / 2);
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const sq = mid * mid;
    if (sq === x) return mid;
    if (sq < x) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return right;
}

// 方法2：牛顿迭代法
function mySqrtNewton(x: number): number {
  if (x < 2) return x;
  let r = x;
  while (r * r > x) {
    r = Math.floor((r + Math.floor(x / r)) / 2);
  }
  return r;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 005. x 的平方根 =====");
console.log("二分 4:", mySqrt(4)); // 2
console.log("二分 8:", mySqrt(8)); // 2
console.log("牛顿 4:", mySqrtNewton(4)); // 2
console.log("牛顿 8:", mySqrtNewton(8)); // 2
console.log("牛顿 2147395599:", mySqrtNewton(2147395599)); // 46339

export {};
