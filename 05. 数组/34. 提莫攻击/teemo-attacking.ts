// ============================================================
// 34. 提莫攻击
// ============================================================
// LeetCode 495. Teemo Attacking
// 给定非递减整数数组 timeSeries 表示提莫攻击时间，duration 表示中毒持续时间。求总中毒时间。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：遍历计算每段实际中毒时间（推荐）
function findPoisonedDuration(timeSeries: number[], duration: number): number {
  if (timeSeries.length === 0) return 0;

  let total = 0;

  for (let i = 0; i < timeSeries.length - 1; i++) {
    // 当前攻击与下一次攻击的时间间隔
    const gap = timeSeries[i + 1] - timeSeries[i];
    // 实际中毒时间为 min(duration, gap)
    // 若间隔大于等于 duration，则完整中毒 duration 秒
    // 否则只能中毒 gap 秒（被下一次攻击提前覆盖）
    total += Math.min(duration, gap);
  }

  // 最后一次攻击完整中毒 duration 秒
  total += duration;

  return total;
}

// 方法2：差分思想-合并重叠区间
function findPoisonedDurationMerge(timeSeries: number[], duration: number): number {
  if (timeSeries.length === 0) return 0;

  let total = 0;
  // 当前中毒区间的结束时间
  let end = timeSeries[0] + duration;

  for (let i = 1; i < timeSeries.length; i++) {
    if (timeSeries[i] >= end) {
      // 不重叠，整段加入
      total += duration;
    } else {
      // 重叠，只加入差值部分
      total += timeSeries[i] - timeSeries[i - 1];
    }
    end = timeSeries[i] + duration;
  }

  // 加入最后一次完整中毒
  total += duration;

  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 34. 提莫攻击 =====");
console.log("描述:", findPoisonedDuration([1, 4], 2)); // 期望结果: 4
console.log("描述:", findPoisonedDuration([1, 2], 2)); // 期望结果: 3
console.log("描述:", findPoisonedDuration([], 2)); // 期望结果: 0
console.log("描述:", findPoisonedDurationMerge([1, 4], 2)); // 期望结果: 4

export {};
