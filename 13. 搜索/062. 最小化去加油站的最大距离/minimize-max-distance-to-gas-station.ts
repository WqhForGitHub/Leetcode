// ============================================================
// 062. 最小化去加油站的最大距离
// ============================================================
// LeetCode 774. Minimize Max Distance to Gas Station
// 在数轴上的加油站之间添加 k 个新站，使相邻加油站最大距离最小。

// 方法1：二分查找（浮点数二分）
function minmaxGasDist(stations: number[], k: number): number {
  stations.sort((a, b) => a - b);
  const gaps: number[] = [];
  for (let i = 1; i < stations.length; i++) {
    gaps.push(stations[i] - stations[i - 1]);
  }
  let left = 0;
  let right = Math.max(...gaps);
  const eps = 1e-6;
  while (right - left > eps) {
    const mid = (left + right) / 2;
    let need = 0;
    for (const gap of gaps) {
      need += Math.floor(gap / mid);
    }
    if (need <= k) {
      right = mid;
    } else {
      left = mid;
    }
  }
  return right;
}

// 方法2：二分查找 + 计数优化
function minmaxGasDistOpt(stations: number[], k: number): number {
  stations.sort((a, b) => a - b);
  let lo = 0;
  let hi = 0;
  for (let i = 1; i < stations.length; i++) {
    hi = Math.max(hi, stations[i] - stations[i - 1]);
  }
  let ans = hi;
  while (lo <= hi) {
    const mid = (lo + hi) / 2;
    let count = 0;
    for (let i = 1; i < stations.length; i++) {
      count += Math.floor((stations[i] - stations[i - 1]) / mid);
    }
    if (count <= k) {
      ans = mid;
      hi = mid - 1e-6;
    } else {
      lo = mid + 1e-6;
    }
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 062. 最小化去加油站的最大距离 =====");
console.log(
  "二分 [1,2,3,4,5,6,7,8,9,10],9:",
  minmaxGasDist([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 9).toFixed(6),
); // 0.5
console.log(
  "二分 [3,6,12,19,33,44,67,72,89,95],2:",
  minmaxGasDist([3, 6, 12, 19, 33, 44, 67, 72, 89, 95], 2).toFixed(6),
); // 14

export {};
