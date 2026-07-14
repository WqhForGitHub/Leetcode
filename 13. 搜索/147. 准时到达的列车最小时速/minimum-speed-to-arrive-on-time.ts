// ============================================================
// 147. 准时到达的列车最小时速
// ============================================================
// LeetCode 1870. Minimum Speed to Arrive on Time
// 列车通过每段距离所需时间为 dist[i]/speed（向上取整），求准时到达的最小时速。

// 方法1：二分查找
function minSpeedOnTime(dist: number[], hour: number): number {
  if (hour <= dist.length - 1) return -1;
  let left = 1;
  let right = 10 ** 7;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canArrive(dist, hour, mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

function canArrive(dist: number[], hour: number, speed: number): boolean {
  let totalTime = 0;
  for (let i = 0; i < dist.length; i++) {
    if (i < dist.length - 1) {
      totalTime += Math.ceil(dist[i] / speed);
    } else {
      totalTime += dist[i] / speed;
    }
    if (totalTime > hour) return false;
  }
  return totalTime <= hour;
}

// 方法2：浮点二分
function minSpeedOnTimeFloat(dist: number[], hour: number): number {
  if (hour <= dist.length - 1) return -1;
  let lo = 1;
  let hi = 1e7;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let time = 0;
    for (let i = 0; i < dist.length - 1; i++) {
      time += Math.ceil(dist[i] / mid);
    }
    time += dist[dist.length - 1] / mid;
    if (time <= hour) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 147. 准时到达的列车最小时速 =====");
console.log("二分 [1,3,2],6:", minSpeedOnTime([1, 3, 2], 6)); // 1
console.log("二分 [1,3,2],2.7:", minSpeedOnTime([1, 3, 2], 2.7)); // 3
console.log("二分 [1,3,2],1.9:", minSpeedOnTime([1, 3, 2], 1.9)); // -1

export {};
