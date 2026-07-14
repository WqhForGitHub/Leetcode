// ============================================================
// 066. 阶乘函数后 K 个零
// ============================================================
// LeetCode 793. Preimage Size of Factorial Zeroes Function
// f(x) 是 x! 末尾零的个数。给定 K，求有多少个 x 使得 f(x) = K。

// 方法1：二分查找（找满足 f(x)=K 的 x 范围）
function preimageSizeFZF(k: number): number {
  // f(x) 单调递增，找 [lo, hi] 使得 f(x)=K
  return rightBound(k) - leftBound(k) + 1;
}

function trailingZeroes(x: number): number {
  let count = 0;
  while (x > 0) {
    x = Math.floor(x / 5);
    count += x;
  }
  return count;
}

function leftBound(k: number): number {
  let lo = 0;
  let hi = 5 * (k + 1);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (trailingZeroes(mid) < k) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

function rightBound(k: number): number {
  let lo = 0;
  let hi = 5 * (k + 1);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (trailingZeroes(mid) <= k) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo - 1;
}

// 方法2：数学推导
function preimageSizeFZFMath(k: number): number {
  // 如果存在 x 使得 f(x)=K，答案为 5（连续5个数），否则为 0
  // 通过二分验证
  let lo = 0;
  let hi = 5 * (k + 1);
  let found = false;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const zeros = trailingZeroes(mid);
    if (zeros === k) {
      found = true;
      break;
    }
    if (zeros < k) lo = mid + 1;
    else hi = mid - 1;
  }
  return found ? 5 : 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 066. 阶乘函数后 K 个零 =====");
console.log("二分 0:", preimageSizeFZF(0)); // 5
console.log("二分 5:", preimageSizeFZF(5)); // 0
console.log("二分 3:", preimageSizeFZF(3)); // 5
console.log("数学 0:", preimageSizeFZFMath(0)); // 5

export {};
