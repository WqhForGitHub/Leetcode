// ============================================================
// 147. 安排会议日程
// ============================================================
// LeetCode 1229. Meeting Scheduler
// 给定两人的空闲时间区间列表 slot1、slot2 和会议时长 duration，
// 返回最早的一个两人都空闲且时长 >= duration 的时间段 [start, start+duration]。
// 若不存在返回 []。区间列表均已按 start 升序排列且区间互不重叠。

// 方法1：双指针扫描空闲区间（推荐，O(n + m)）
// 同时遍历两人的空闲区间，取两者的交集，若交集长度 >= duration 即返回。
// 移动结束时间较小的指针（因为该区间已无法与对方后续区间产生更大交集）。
function minAvailableDuration(slot1: number[][], slot2: number[][], duration: number): number[] {
  let i: number = 0;
  let j: number = 0;
  while (i < slot1.length && j < slot2.length) {
    const start: number = Math.max(slot1[i][0], slot2[j][0]);
    const end: number = Math.min(slot1[i][1], slot2[j][1]);
    if (end - start >= duration) {
      return [start, start + duration];
    }
    // 结束时间早的指针前进
    if (slot1[i][1] < slot2[j][1]) {
      i++;
    } else {
      j++;
    }
  }
  return [];
}

// 方法2：事件扫描线（O((n + m) log (n + m))）
// 将两人的区间转为事件（进入 +1 / 离开 -1），按时间排序，
// 当两人同时处于空闲（count1 > 0 且 count2 > 0）时记录窗口，窗口足够长即返回。
interface ScheduleEvent {
  time: number;
  person: number; // 1 或 2
  delta: number; // +1 进入, -1 离开
}

function minAvailableDuration2(slot1: number[][], slot2: number[][], duration: number): number[] {
  const events: ScheduleEvent[] = [];
  for (const [s, e] of slot1) {
    events.push({ time: s, person: 1, delta: 1 });
    events.push({ time: e, person: 1, delta: -1 });
  }
  for (const [s, e] of slot2) {
    events.push({ time: s, person: 2, delta: 1 });
    events.push({ time: e, person: 2, delta: -1 });
  }
  // 同一时间先处理离开（delta 小的在前），保证半开区间语义正确
  events.sort((a, b) => a.time - b.time || a.delta - b.delta);

  let count1: number = 0;
  let count2: number = 0;
  let windowStart: number = 0;
  let inWindow: boolean = false;

  for (const ev of events) {
    const prevBoth: boolean = count1 > 0 && count2 > 0;
    if (ev.person === 1) count1 += ev.delta;
    else count2 += ev.delta;
    const nowBoth: boolean = count1 > 0 && count2 > 0;

    if (nowBoth && !prevBoth) {
      windowStart = ev.time;
      inWindow = true;
    } else if (!nowBoth && prevBoth && inWindow) {
      if (ev.time - windowStart >= duration) {
        return [windowStart, windowStart + duration];
      }
      inWindow = false;
    }
  }
  return [];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 147. 安排会议日程 =====");
console.log(
  "方法1:",
  JSON.stringify(
    minAvailableDuration(
      [
        [10, 50],
        [60, 120],
        [140, 210],
      ],
      [
        [0, 15],
        [60, 70],
      ],
      8,
    ),
  ),
); // 期望: [60,68]
console.log(
  "方法1:",
  JSON.stringify(
    minAvailableDuration(
      [
        [10, 50],
        [60, 120],
        [140, 210],
      ],
      [
        [0, 15],
        [60, 70],
      ],
      12,
    ),
  ),
); // 期望: []
console.log(
  "方法2:",
  JSON.stringify(
    minAvailableDuration2(
      [
        [10, 50],
        [60, 120],
        [140, 210],
      ],
      [
        [0, 15],
        [60, 70],
      ],
      8,
    ),
  ),
); // 期望: [60,68]

export {};
