// ============================================================
// 115. 制作 m 束花所需的最少天数
// ============================================================
// LeetCode 1482. Minimum Number of Days to Make m Bouquets
// 花在第 bloomDay[i] 天开放，需要连续 k 朵制作一束花，求制作 m 束最少等几天。

// 方法1：二分查找
function minDays(bloomDay: number[], m: number, k: number): number {
  if (m * k > bloomDay.length) return -1;
  let left = Math.min(...bloomDay);
  let right = Math.max(...bloomDay);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canMake(bloomDay, m, k, mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

function canMake(
  bloomDay: number[],
  m: number,
  k: number,
  day: number
): boolean {
  let bouquets = 0;
  let flowers = 0;
  for (const d of bloomDay) {
    if (d <= day) {
      flowers++;
      if (flowers === k) {
        bouquets++;
        flowers = 0;
        if (bouquets >= m) return true;
      }
    } else {
      flowers = 0;
    }
  }
  return bouquets >= m;
}

// 方法2：二分查找（优化计数）
function minDaysOpt(bloomDay: number[], m: number, k: number): number {
  if (m * k > bloomDay.length) return -1;
  let lo = 1;
  let hi = Math.max(...bloomDay);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let count = 0;
    let consecutive = 0;
    for (const d of bloomDay) {
      if (d <= mid) {
        consecutive++;
        if (consecutive === k) {
          count++;
          consecutive = 0;
        }
      } else {
        consecutive = 0;
      }
    }
    if (count >= m) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 115. 制作 m 束花所需的最少天数 =====");
console.log("二分 [1,10,3,10,2],3,1:", minDays([1, 10, 3, 10, 2], 3, 1)); // 3
console.log("二分 [1,10,3,10,2],3,2:", minDays([1, 10, 3, 10, 2], 3, 2)); // -1
console.log("二分 [7,7,7,7,12,7,7],2,3:", minDays([7, 7, 7, 7, 12, 7, 7], 2, 3)); // 12
console.log("优化 [1000000000,1000000000],1,1:", minDaysOpt([1000000000, 1000000000], 1, 1)); // 1000000000

export {};
