// ============================================================
// 150. 割绳子
// ============================================================
// LeetCode 1891. Cutting Ribbons
// 给定绳子长度数组，切成 k 段等长绳子，求最大长度。

// 方法1：二分查找
function maxLength(ribbons: number[], k: number): number {
  let left = 1;
  let right = Math.max(...ribbons);
  let result = 0;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    let count = 0;
    for (const r of ribbons) {
      count += Math.floor(r / mid);
    }
    if (count >= k) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return result;
}

// 方法2：二分查找（左闭右开）
function maxLengthAlt(ribbons: number[], k: number): number {
  let lo = 1;
  let hi = Math.max(...ribbons) + 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let count = 0;
    for (const r of ribbons) {
      count += Math.floor(r / mid);
    }
    if (count >= k) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo - 1;
}

// 方法3：暴力枚举
function maxLengthBrute(ribbons: number[], k: number): number {
  const maxRibbon = Math.max(...ribbons);
  for (let len = maxRibbon; len >= 1; len--) {
    let count = 0;
    for (const r of ribbons) {
      count += Math.floor(r / len);
    }
    if (count >= k) return len;
  }
  return 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 150. 割绳子 =====");
console.log("二分 [7,5,9],4:", maxLength([7, 5, 9], 4)); // 4
console.log("二分 [5,7,9],22:", maxLength([5, 7, 9], 22)); // 0
console.log("二分 [9,7,5],3:", maxLength([9, 7, 5], 3)); // 5
console.log("变体 [7,5,9],4:", maxLengthAlt([7, 5, 9], 4)); // 4

export {};
