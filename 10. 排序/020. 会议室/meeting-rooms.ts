// ============================================================
// 020. 会议室
// ============================================================
// LeetCode 252. Meeting Rooms
// 给定一个会议时间区间数组 intervals，判断一个人是否能参加所有会议
// （即会议之间不存在重叠）。

interface Interval {
  start: number;
  end: number;
}

// 方法1：按开始时间排序，检查相邻会议是否重叠（O(n log n)，O(1)）
function canAttendMeetings(intervals: Interval[]): boolean {
  if (intervals.length <= 1) return true;
  // 复制一份避免修改原数组
  const arr: Interval[] = [...intervals].sort((a, b) => a.start - b.start);
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].start < arr[i - 1].end) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 020. 会议室 =====");
console.log(
  "方法1:",
  canAttendMeetings([
    { start: 0, end: 30 },
    { start: 5, end: 10 },
    { start: 15, end: 20 },
  ]),
); // 期望 false
console.log(
  "方法1:",
  canAttendMeetings([
    { start: 7, end: 10 },
    { start: 2, end: 4 },
  ]),
); // 期望 true

export {};
