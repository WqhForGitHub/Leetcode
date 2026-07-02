// ============================================================
// 057. 最小时间差
// ============================================================
// LeetCode 539. Minimum Time Difference
// 给定 "HH:MM" 格式的时间点列表，求任意两个时间点之间的最小分钟差。
// 时间是循环的（23:59 与 00:00 相差 1 分钟）。

// 方法1：排序 + 环形比较（推荐，O(n log n) 时间，O(n) 空间）
// 将时间转为分钟数后排序，相邻元素差值取最小；
// 另外比较首尾元素在环形意义上的差值（首 + 1440 - 尾）。
function findMinDifference(timePoints: string[]): number {
  const n = timePoints.length;
  // 优化：时间点数量超过 1440 必有重复，最小差为 0
  if (n > 1440) return 0;

  const minutes: number[] = timePoints.map((t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  });
  minutes.sort((a, b) => a - b);

  let minDiff = Infinity;
  for (let i = 1; i < n; i++) {
    minDiff = Math.min(minDiff, minutes[i] - minutes[i - 1]);
  }
  // 环形比较：首尾
  minDiff = Math.min(minDiff, minutes[0] + 1440 - minutes[n - 1]);
  return minDiff;
}

// 方法2：桶排序 / 布尔数组（O(n) 时间，O(1440)=O(1) 空间）
// 用长度为 1440 的布尔数组标记出现过的分钟，再线性扫描相邻 true 元素。
function findMinDifferenceBucket(timePoints: string[]): number {
  const n = timePoints.length;
  if (n > 1440) return 0;

  const slot = new Array<boolean>(1440).fill(false);
  for (const t of timePoints) {
    const [h, m] = t.split(":").map(Number);
    const min = h * 60 + m;
    if (slot[min]) return 0; // 重复时间，差为 0
    slot[min] = true;
  }

  let minDiff = Infinity;
  let prev = -1;
  let first = -1;
  let last = -1;
  for (let i = 0; i < 1440; i++) {
    if (slot[i]) {
      if (prev !== -1) {
        minDiff = Math.min(minDiff, i - prev);
      } else {
        first = i;
      }
      prev = i;
      last = i;
    }
  }
  // 环形比较首尾
  minDiff = Math.min(minDiff, first + 1440 - last);
  return minDiff;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 057. 最小时间差 =====");
console.log("排序法 ['23:59','00:00']:", findMinDifference(["23:59", "00:00"])); // 期望 1
console.log("排序法 ['00:00','23:59','00:00']:", findMinDifference(["00:00", "23:59", "00:00"])); // 期望 0
console.log("排序法 ['12:12','00:13','00:12']:", findMinDifference(["12:12", "00:13", "00:12"])); // 期望 1
console.log("桶排序法 ['23:59','00:00']:", findMinDifferenceBucket(["23:59", "00:00"])); // 期望 1
console.log(
  "桶排序法 ['00:00','23:59','00:00']:",
  findMinDifferenceBucket(["00:00", "23:59", "00:00"]),
); // 期望 0
console.log(
  "桶排序法 ['12:12','00:13','00:12']:",
  findMinDifferenceBucket(["12:12", "00:13", "00:12"]),
); // 期望 1

export {};
