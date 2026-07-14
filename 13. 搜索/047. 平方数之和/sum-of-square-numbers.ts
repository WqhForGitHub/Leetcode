// ============================================================
// 047. 平方数之和
// ============================================================
// LeetCode 633. Sum of Square Numbers
// 判断非负整数 c 是否能表示为两个整数的平方和。

// 方法1：双指针
function judgeSquareSum(c: number): boolean {
  let left = 0;
  let right = Math.floor(Math.sqrt(c));
  while (left <= right) {
    const sum = left * left + right * right;
    if (sum === c) return true;
    if (sum < c) {
      left++;
    } else {
      right--;
    }
  }
  return false;
}

// 方法2：二分查找
function judgeSquareSumBinary(c: number): boolean {
  for (let a = 0; a * a <= c; a++) {
    const b2 = c - a * a;
    let lo = 0;
    let hi = Math.floor(Math.sqrt(b2)) + 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const sq = mid * mid;
      if (sq === b2) return true;
      if (sq < b2) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}

// 方法3：费马定理（数学）
function judgeSquareSumFermat(c: number): boolean {
  // 费马定理：c 能表示为两平方和当且仅当 c 的每个 4k+3 型质因子的指数为偶数
  for (let i = 2; i * i <= c; i++) {
    if (c % i === 0) {
      let count = 0;
      while (c % i === 0) {
        count++;
        c /= i;
      }
      if (i % 4 === 3 && count % 2 !== 0) return false;
    }
  }
  return c % 4 !== 3;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 047. 平方数之和 =====");
console.log("双指针 5:", judgeSquareSum(5)); // true
console.log("双指针 3:", judgeSquareSum(3)); // false
console.log("二分 5:", judgeSquareSumBinary(5)); // true
console.log("费马 5:", judgeSquareSumFermat(5)); // true

export {};
