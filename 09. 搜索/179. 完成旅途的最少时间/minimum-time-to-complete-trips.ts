// ============================================================
// 179. 完成旅途的最少时间
// ============================================================
// LeetCode 2187. Minimum Time to Complete Trips
// time[i] 表示第 i 趟巴士完成一趟所需时间，每趟巴士可无限次运行。
// 求完成 totalTrips 趟所需的最少时间。

// 方法1：二分答案
function minimumTime(time: number[], totalTrips: number): number {
  function canComplete(t: number): boolean {
    let trips = 0;
    for (const ti of time) {
      trips += Math.floor(t / ti);
      if (trips >= totalTrips) return true;
    }
    return trips >= totalTrips;
  }

  let left = 1;
  let right = Math.min(...time) * totalTrips;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canComplete(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

// 方法2：二分答案（优化上界）
function minimumTimeOpt(time: number[], totalTrips: number): number {
  function canComplete(t: number): boolean {
    let trips = 0;
    for (const ti of time) {
      trips += Math.floor(t / ti);
      if (trips >= totalTrips) return true;
    }
    return false;
  }

  let left = 1;
  // 使用 BigInt 防止溢出，上界取 min * totalTrips
  let right = Math.min(...time) * totalTrips;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (canComplete(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 179. 完成旅途的最少时间 =====");
console.log("二分 [1,2,3],5:", minimumTime([1, 2, 3], 5)); // 3
console.log("二分 [2],1:", minimumTime([2], 1)); // 2
console.log("二分 [5,10,10],9:", minimumTime([5, 10, 10], 9)); // 25
console.log("优化 [1,2,3],5:", minimumTimeOpt([1, 2, 3], 5)); // 3

export {};
