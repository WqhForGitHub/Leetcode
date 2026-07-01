// ============================================================
// 081. 员工空闲时间
// ============================================================
// LeetCode 759. Employee Free Time
// 给定每个员工的忙碌时间段列表，找出所有员工共同的空闲时间段。

// 时间区间接口
interface Interval {
  start: number;
  end: number;
}

// 方法1：排序所有区间 + 合并 + 找间隙（推荐，O(n log n)）
// 思路：将所有员工的所有忙碌区间展开到一个数组中，按起始时间排序，
//       然后合并重叠区间，合并后的区间之间的间隙就是共同空闲时间。
function employeeFreeTime(schedule: Interval[][]): Interval[] {
  // 1. 展开所有区间
  const intervals: Interval[] = [];
  for (const emp of schedule) {
    for (const iv of emp) {
      intervals.push({ start: iv.start, end: iv.end });
    }
  }

  if (intervals.length === 0) return [];

  // 2. 按起始时间排序
  intervals.sort((a, b) => a.start - b.start);

  // 3. 合并重叠区间
  const merged: Interval[] = [{ ...intervals[0] }];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i].start <= last.end) {
      // 有重叠，合并
      last.end = Math.max(last.end, intervals[i].end);
    } else {
      // 无重叠，新增
      merged.push({ start: intervals[i].start, end: intervals[i].end });
    }
  }

  // 4. 找合并后区间之间的间隙（即共同空闲时间）
  const result: Interval[] = [];
  for (let i = 1; i < merged.length; i++) {
    if (merged[i - 1].end < merged[i].start) {
      result.push({ start: merged[i - 1].end, end: merged[i].start });
    }
  }

  return result;
}

// 方法2：使用优先队列逐个处理（O(n log n)）
// 思路：将所有区间放入最小堆，逐个弹出并合并，同时检测间隙。
function employeeFreeTime2(schedule: Interval[][]): Interval[] {
  const allIntervals: Interval[] = [];
  for (const emp of schedule) {
    for (const iv of emp) {
      allIntervals.push(iv);
    }
  }
  if (allIntervals.length === 0) return [];

  // 最小堆（按 start 排序）
  allIntervals.sort((a, b) => a.start - b.start);

  const result: Interval[] = [];
  let prevEnd = allIntervals[0].end;

  for (let i = 1; i < allIntervals.length; i++) {
    if (allIntervals[i].start > prevEnd) {
      // 发现间隙
      result.push({ start: prevEnd, end: allIntervals[i].start });
    }
    prevEnd = Math.max(prevEnd, allIntervals[i].end);
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 081. 员工空闲时间 =====");

const schedule1: Interval[][] = [
  [{ start: 1, end: 2 }, { start: 5, end: 6 }],
  [{ start: 1, end: 3 }],
  [{ start: 4, end: 10 }]
];
console.log("测试1:", employeeFreeTime(schedule1)); // 期望: [{ start: 3, end: 4 }]

const schedule2: Interval[][] = [
  [{ start: 1, end: 3 }, { start: 6, end: 7 }],
  [{ start: 2, end: 4 }],
  [{ start: 2, end: 5 }, { start: 9, end: 12 }]
];
console.log("测试2:", employeeFreeTime(schedule2)); // 期望: [{ start: 5, end: 6 }, { start: 7, end: 9 }]

const schedule3: Interval[][] = [
  [{ start: 1, end: 2 }],
  [{ start: 2, end: 3 }]
];
console.log("测试3:", employeeFreeTime(schedule3)); // 期望: []

console.log("方法2测试1:", employeeFreeTime2(schedule1)); // 期望: [{ start: 3, end: 4 }]
console.log("方法2测试2:", employeeFreeTime2(schedule2)); // 期望: [{ start: 5, end: 6 }, { start: 7, end: 9 }]

export {};
