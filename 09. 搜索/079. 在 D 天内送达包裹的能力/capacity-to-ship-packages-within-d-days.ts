// ============================================================
// 079. 在 D 天内送达包裹的能力
// ============================================================
// LeetCode 1011. Capacity To Ship Packages Within D Days
// 传送带上包裹重量，D 天内运完，每天按顺序运，求最低运力。

// 方法1：二分查找
function shipWithinDays(weights: number[], days: number): number {
  let left = Math.max(...weights);
  let right = weights.reduce((a, b) => a + b, 0);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canShip(weights, mid, days)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

function canShip(weights: number[], capacity: number, days: number): boolean {
  let count = 1;
  let current = 0;
  for (const w of weights) {
    if (current + w > capacity) {
      count++;
      current = w;
    } else {
      current += w;
    }
  }
  return count <= days;
}

// 方法2：二分查找（优化提前终止）
function shipWithinDaysOpt(weights: number[], days: number): number {
  let lo = Math.max(...weights);
  let hi = weights.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let need = 1;
    let cur = 0;
    for (const w of weights) {
      if (cur + w > mid) {
        need++;
        cur = 0;
      }
      cur += w;
      if (need > days) break;
    }
    if (need <= days) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 079. 在 D 天内送达包裹的能力 =====");
console.log("二分 [1,2,3,4,5,6,7,8,9,10],5:", shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5)); // 15
console.log("二分 [3,2,2,4,1,4],3:", shipWithinDays([3, 2, 2, 4, 1, 4], 3)); // 6
console.log("二分 [1,2,3,1,1],4:", shipWithinDays([1, 2, 3, 1, 1], 4)); // 3

export {};
