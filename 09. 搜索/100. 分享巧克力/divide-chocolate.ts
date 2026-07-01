// ============================================================
// 100. 分享巧克力
// ============================================================
// LeetCode 1231. Divide Chocolate
// 将巧克力切成 K+1 块，最小化最大化每块的甜度之和。

// 方法1：二分查找
function maximizeSweetness(sweetness: number[], k: number): number {
  // 切成 k+1 块，最小甜度最大化
  let left = Math.min(...sweetness);
  let right = sweetness.reduce((a, b) => a + b, 0);
  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    // 检查能否切成 k+1 块，每块甜度 >= mid
    let pieces = 0;
    let current = 0;
    for (const s of sweetness) {
      current += s;
      if (current >= mid) {
        pieces++;
        current = 0;
      }
    }
    if (pieces >= k + 1) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

// 方法2：二分查找（左闭右开）
function maximizeSweetnessAlt(sweetness: number[], k: number): number {
  let lo = 1;
  let hi = Math.floor(sweetness.reduce((a, b) => a + b, 0) / (k + 1));
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    let count = 0;
    let sum = 0;
    for (const s of sweetness) {
      sum += s;
      if (sum >= mid) {
        count++;
        sum = 0;
      }
    }
    if (count >= k + 1) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 100. 分享巧克力 =====");
console.log("二分 [1,2,3,4,5,6,7,8,9],5:", maximizeSweetness([1, 2, 3, 4, 5, 6, 7, 8, 9], 5)); // 6
console.log("二分 [5,6,7,8,9,1,2,3,4],8:", maximizeSweetness([5, 6, 7, 8, 9, 1, 2, 3, 4], 8)); // 1
console.log("二分 [1,2,2,1,2,2,1,2,2],2:", maximizeSweetness([1, 2, 2, 1, 2, 2, 1, 2, 2], 2)); // 5

export {};
