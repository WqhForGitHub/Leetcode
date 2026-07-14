// ============================================================
// 177. 同时运行 N 台电脑的最长时间
// ============================================================
// LeetCode 2141. Maximum Running Time of N Computers
// 有 n 台电脑和 m 个电池，battery[i] 为第 i 个电池的电量。
// 每台电脑同时只能用一个电池，电池可随时切换，求 n 台电脑同时运行的最长时间。

// 方法1：二分答案
function maxRunTime(n: number, batteries: number[]): number {
  function canRun(time: number): boolean {
    let total = 0;
    for (const b of batteries) {
      total += Math.min(b, time);
      if (total >= n * time) return true;
    }
    return total >= n * time;
  }

  let left = 1;
  // 上界：总电量 / 电脑数
  let right = Math.floor(batteries.reduce((a, b) => a + b, 0) / n);
  while (left < right) {
    const mid = Math.ceil((left + right) / 2);
    if (canRun(mid)) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

// 方法2：排序 + 贪心
function maxRunTimeGreedy(n: number, batteries: number[]): number {
  batteries.sort((a, b) => a - b);
  let extra = 0;
  // 从最小的电池开始，如果电池电量足够支撑 n 台电脑运行到下一级
  for (let i = 0; i < batteries.length - 1; i++) {
    extra += batteries[i];
    const need = (batteries[i + 1] - batteries[i]) * (i + 1);
    if (extra < need) {
      // 无法撑到下一级
      return batteries[i] + Math.floor(extra / (i + 1));
    }
    extra -= need;
  }
  // 剩余电池加上额外电量平均分配
  extra += batteries[batteries.length - 1];
  return batteries[batteries.length - 1] + Math.floor(extra / n);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 177. 同时运行 N 台电脑的最长时间 =====");
console.log("二分 2,[3,3,3]:", maxRunTime(2, [3, 3, 3])); // 4
console.log("二分 2,[1,1,1,1]:", maxRunTime(2, [1, 1, 1, 1])); // 2
console.log("贪心 2,[3,3,3]:", maxRunTimeGreedy(2, [3, 3, 3])); // 4
console.log("贪心 2,[1,1,1,1]:", maxRunTimeGreedy(2, [1, 1, 1, 1])); // 2

export {};
