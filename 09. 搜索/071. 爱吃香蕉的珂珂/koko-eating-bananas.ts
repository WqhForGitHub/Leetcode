// ============================================================
// 071. 爱吃香蕉的珂珂
// ============================================================
// LeetCode 875. Koko Eating Bananas
// 每堆香蕉，珂珂每小时吃 k 根，H 小时内吃完最少吃多少根每小时。

// 方法1：二分查找
function minEatingSpeed(piles: number[], h: number): number {
  let left = 1;
  let right = Math.max(...piles);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canFinish(piles, mid, h)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

function canFinish(piles: number[], k: number, h: number): boolean {
  let hours = 0;
  for (const pile of piles) {
    hours += Math.ceil(pile / k);
  }
  return hours <= h;
}

// 方法2：二分查找（优化计算）
function minEatingSpeedOpt(piles: number[], h: number): number {
  let lo = 1;
  let hi = Math.max(...piles);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let time = 0;
    for (const p of piles) {
      time += Math.ceil(p / mid);
      if (time > h) break; // 提前终止
    }
    if (time <= h) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 071. 爱吃香蕉的珂珂 =====");
console.log("二分 [3,6,7,11],8:", minEatingSpeed([3, 6, 7, 11], 8)); // 4
console.log("二分 [30,11,23,4,20],5:", minEatingSpeed([30, 11, 23, 4, 20], 5)); // 30
console.log("二分 [30,11,23,4,20],6:", minEatingSpeed([30, 11, 23, 4, 20], 6)); // 23
console.log("优化 [3,6,7,11],8:", minEatingSpeedOpt([3, 6, 7, 11], 8)); // 4

export {};
