// ============================================================
// 045. 最近时刻
// ============================================================
// LeetCode 681. Next Closest Time
// 给定一个 "HH:MM" 格式的时间字符串，使用给定时间中的数字组合出下一个最近的合法时间。
// 可以跨天，结果中也只能使用给定时间中出现过的数字。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：回溯(枚举所有有效时间) (推荐)
// 用给定数字枚举所有可能的合法 HH:MM 组合，找出距离原时间最近且比原时间大的时间。
// 时间复杂度 O(4^4) = O(256), 空间复杂度 O(4)
function nextClosestTime(time: string): string {
  const digits: number[] = [];
  for (const ch of time) {
    if (ch !== ":") digits.push(parseInt(ch, 10));
  }
  const uniqueDigits = Array.from(new Set(digits));

  // 解析原时间分钟数
  const originMinutes =
    parseInt(time.substring(0, 2), 10) * 60 + parseInt(time.substring(3, 5), 10);

  let best: string | null = null;
  let bestDiff = Infinity;

  const current: number[] = [];

  const isValid = (arr: number[]): boolean => {
    const hh = arr[0] * 10 + arr[1];
    const mm = arr[2] * 10 + arr[3];
    return hh < 24 && mm < 60;
  };

  const backtrack = (idx: number): void => {
    if (idx === 4) {
      if (!isValid(current)) return;
      const hh = current[0] * 10 + current[1];
      const mm = current[2] * 10 + current[3];
      const curMinutes = hh * 60 + mm;
      // 计算与原时间的差，如果当前比原时间晚则差为正，否则跨天+1440
      let diff = curMinutes - originMinutes;
      if (diff <= 0) diff += 24 * 60;
      if (diff > 0 && diff < bestDiff) {
        bestDiff = diff;
        best = `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
      }
      return;
    }
    for (const d of uniqueDigits) {
      current.push(d);
      backtrack(idx + 1);
      current.pop();
    }
  };

  backtrack(0);
  return best!;
}

// 方法2：枚举每个分钟判断
// 从给定时间分钟数+1 开始枚举后续每一分钟，直到找到一个所有数字都在原时间中出现的时间。
// 时间复杂度 O(1440), 空间复杂度 O(1)
function nextClosestTimeEnumerate(time: string): string {
  const allowed = new Set<number>();
  for (const ch of time) {
    if (ch !== ":") allowed.add(parseInt(ch, 10));
  }

  const originMinutes =
    parseInt(time.substring(0, 2), 10) * 60 + parseInt(time.substring(3, 5), 10);

  for (let delta = 1; delta <= 24 * 60; delta++) {
    const m = (originMinutes + delta) % (24 * 60);
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    const d1 = Math.floor(hh / 10);
    const d2 = hh % 10;
    const d3 = Math.floor(mm / 10);
    const d4 = mm % 10;
    if (allowed.has(d1) && allowed.has(d2) && allowed.has(d3) && allowed.has(d4)) {
      return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
    }
  }
  return time;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 045. 最近时刻 =====");
console.log(nextClosestTime("19:34")); // 期望结果: "19:39"
console.log(nextClosestTime("23:59")); // 期望结果: "22:22"
console.log(nextClosestTimeEnumerate("19:34")); // 期望结果: "19:39"
console.log(nextClosestTimeEnumerate("23:59")); // 期望结果: "22:22"

export {};
