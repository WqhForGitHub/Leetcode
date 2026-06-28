// ============================================================
// 123. 最近时刻
// ============================================================
// LeetCode 681. Next Closest Time
// 给定形如 "HH:MM" 的时间，使用其中出现的数字重新组合，
// 返回下一个最近的时间（次日可循环）。
// 时间复杂度：O(1)（最多 4^4 种组合）；空间复杂度：O(1)

function nextClosestTime(time: string): string {
  // 提取四个数字
  const digits = [
    parseInt(time[0]),
    parseInt(time[1]),
    parseInt(time[3]),
    parseInt(time[4]),
  ];
  const digitSet = new Set(digits);
  // 当前分钟数
  const curMin = digits[0] * 10 * 60 + digits[1] * 60 + digits[3] * 10 + digits[4];

  let best: string | null = null;
  let bestDiff = Infinity;

  // 枚举所有可能的有效时间组合
  const tryTime = (h1: number, h2: number, m1: number, m2: number): void => {
    if (!digitSet.has(h1) || !digitSet.has(h2) || !digitSet.has(m1) || !digitSet.has(m2)) {
      return;
    }
    const hour = h1 * 10 + h2;
    const minute = m1 * 10 + m2;
    if (hour > 23 || minute > 59) return;
    const total = hour * 60 + minute;
    // 计算与当前时间差（考虑跨天）
    let diff = total - curMin;
    if (diff <= 0) diff += 24 * 60; // 次日
    if (diff > 0 && diff < bestDiff) {
      bestDiff = diff;
      best = `${h1}${h2}:${m1}${m2}`;
    }
  };

  for (const h1 of digitSet) {
    for (const h2 of digitSet) {
      for (const m1 of digitSet) {
        for (const m2 of digitSet) {
          tryTime(h1, h2, m1, m2);
        }
      }
    }
  }

  return best!;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 123. 最近时刻 =====");
console.log(nextClosestTime("19:34")); // 期望: "19:39"
console.log(nextClosestTime("23:59")); // 期望: "22:22"

export {};
