// ============================================================
// 157. 感染 K 种病毒所需的最短时间
// ============================================================
// LeetCode 1956. Minimum Time For K Virus Variants to Spread
// 求感染 K 种病毒所需的最短时间。

// 方法1：二分查找 + BFS
function minTimeToInfect(variants: number[][], k: number): number {
  // 二分查找时间
  let left = 0;
  let right = 100000;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canInfectK(variants, mid, k)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

function canInfectK(variants: number[][], time: number, k: number): boolean {
  // 在 time 时刻，检查有多少种病毒被感染
  const infected = new Set<string>();
  for (const [x, y] of variants) {
    for (let dx = -time; dx <= time; dx++) {
      const remaining = time - Math.abs(dx);
      for (let dy = -remaining; dy <= remaining; dy++) {
        infected.add(`${x + dx},${y + dy}`);
      }
    }
    if (infected.size >= k) return true;
  }
  return infected.size >= k;
}

// 方法2：二分 + 曼哈顿距离
function minTimeToInfectManhattan(variants: number[][], k: number): number {
  let lo = 0;
  let hi = 200000;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let count = 0;
    // 统计曼哈顿距离 <= mid 的点数
    const points = new Set<string>();
    for (const [x, y] of variants) {
      for (let t = 0; t <= mid; t++) {
        for (let dx = -t; dx <= t; dx++) {
          const dy = t - Math.abs(dx);
          points.add(`${x + dx},${y + dy}`);
          points.add(`${x + dx},${y - dy}`);
        }
      }
    }
    if (points.size >= k) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 157. 感染 K 种病毒所需的最短时间 =====");
console.log("二分:", minTimeToInfect([[1, 1]], 4)); // 1

export {};
