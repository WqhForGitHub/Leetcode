// ============================================================
// 21. 会议室
// ============================================================
// LeetCode 252. Meeting Rooms
// 给定会议时间区间数组 intervals，判断一个人是否能参加所有会议（是否有重叠）。
// 时间复杂度：O(n log n)，空间复杂度：O(1)

// 方法1：排序后比较相邻区间（推荐）
function canAttendMeetings(intervals: number[][]): boolean {
  // 按会议开始时间排序
  intervals.sort((a, b) => a[0] - b[0]);

  // 比较相邻会议：前一个的结束时间不能大于后一个的开始时间
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) {
      return false;
    }
  }
  return true;
}

// 方法2：暴力两两比较
function canAttendMeetingsBruteForce(intervals: number[][]): boolean {
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      // 两个区间重叠：a.start < b.end 且 b.start < a.end
      if (intervals[i][0] < intervals[j][1] && intervals[j][0] < intervals[i][1]) {
        return false;
      }
    }
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 21. 会议室 =====");
console.log(
  "描述:",
  canAttendMeetings([
    [0, 30],
    [5, 10],
    [15, 20],
  ]),
); // 期望结果: false
console.log(
  "描述:",
  canAttendMeetings([
    [7, 10],
    [2, 4],
  ]),
); // 期望结果: true
console.log(
  "描述:",
  canAttendMeetingsBruteForce([
    [0, 30],
    [5, 10],
    [15, 20],
  ]),
); // 期望结果: false

export {};
