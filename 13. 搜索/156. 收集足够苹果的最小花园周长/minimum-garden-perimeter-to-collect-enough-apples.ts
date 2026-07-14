// ============================================================
// 156. 收集足够苹果的最小花园周长
// ============================================================
// LeetCode 1954. Minimum Garden Perimeter to Collect Enough Apples
// 正方形花园中心在原点，边长 2n，求收集至少 neededApples 个苹果的最小周长。

// 方法1：二分查找
function minimumPerimeter(neededApples: number): number {
  let left = 1;
  let right = 100000;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    // 边长为 2*mid 的正方形，苹果数 = 2n(n+1)(2n+1)
    const apples = 2n * BigInt(mid) * BigInt(mid + 1) * BigInt(2 * mid + 1);
    if (apples >= BigInt(neededApples)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left * 8; // 周长 = 8n
}

// 方法2：数学公式 + 二分
function minimumPerimeterMath(neededApples: number): number {
  // 苹果数 = 2n(n+1)(2n+1) ≈ 4n³
  // n ≈ (neededApples/4)^(1/3)
  let lo = 0n;
  let hi = BigInt(Math.ceil(Math.cbrt(neededApples / 4))) + 1n;
  while (lo < hi) {
    const mid = (lo + hi) / 2n;
    const apples = 2n * mid * (mid + 1n) * (2n * mid + 1n);
    if (apples >= BigInt(neededApples)) {
      hi = mid;
    } else {
      lo = mid + 1n;
    }
  }
  return Number(lo * 8n);
}

// 方法3：迭代
function minimumPerimeterIter(neededApples: number): number {
  let n = 0;
  let apples = 0;
  while (apples < neededApples) {
    n++;
    apples = 2 * n * (n + 1) * (2 * n + 1);
  }
  return n * 8;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 156. 收集足够苹果的最小花园周长 =====");
console.log("二分 1:", minimumPerimeter(1)); // 8
console.log("二分 13:", minimumPerimeter(13)); // 16
console.log("二分 1000000000:", minimumPerimeter(1000000000)); // 5040
console.log("迭代 13:", minimumPerimeterIter(13)); // 16

export {};
