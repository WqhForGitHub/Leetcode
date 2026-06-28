// ============================================================
// 059. 将数据流变为多个不相交区间
// ============================================================
// LeetCode 352. Data Stream as Disjoint Intervals
// 给定一个数据流，动态添加数字并能返回所有不相交的区间。
// 时间复杂度：addNum 为 O(n)（保持有序），getIntervals 为 O(1)
// 空间复杂度：O(n)

// 哈希集合记录已添加的数字 + 有序数组维护区间
// 使用哈希集合快速判断数字是否已存在
class SummaryRanges {
  // 哈希集合：记录所有已添加的数字（快速去重）
  private numSet: Set<number>;
  // 有序区间列表：每个元素为 [start, end]
  private intervals: number[][];

  constructor() {
    this.numSet = new Set<number>();
    this.intervals = [];
  }

  // 添加数字到数据流
  addNum(value: number): void {
    // 若数字已存在，直接返回
    if (this.numSet.has(value)) return;
    this.numSet.add(value);

    // 找到第一个结束位置 >= value - 1 的区间索引
    let i = 0;
    while (i < this.intervals.length && this.intervals[i][1] < value - 1) {
      i++;
    }

    // 检查是否可以合并
    if (i < this.intervals.length && this.intervals[i][0] <= value + 1) {
      // value 与第 i 个区间相邻，合并
      const newStart = Math.min(this.intervals[i][0], value);
      const newEnd = Math.max(this.intervals[i][1], value);

      // 检查是否需要与下一个区间合并
      if (
        i + 1 < this.intervals.length &&
        this.intervals[i + 1][0] <= newEnd + 1
      ) {
        // 合并第 i 和 i+1 个区间
        this.intervals[i] = [
          newStart,
          Math.max(newEnd, this.intervals[i + 1][1]),
        ];
        this.intervals.splice(i + 1, 1);
      } else {
        this.intervals[i] = [newStart, newEnd];
      }
    } else if (
      i < this.intervals.length &&
      this.intervals[i][0] === value + 1
    ) {
      // value 正好在前一个区间的左侧边界外
      this.intervals[i][0] = value;
    } else {
      // 无法合并，插入新区间
      this.intervals.splice(i, 0, [value, value]);
    }
  }

  // 返回当前所有不相交区间
  getIntervals(): number[][] {
    return this.intervals;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 059. 将数据流变为多个不相交区间 =====");

// 测试 1
const sr1 = new SummaryRanges();
sr1.addNum(1);
console.log(sr1.getIntervals()); // 期望: [[1, 1]]
sr1.addNum(3);
console.log(sr1.getIntervals()); // 期望: [[1, 1], [3, 3]]
sr1.addNum(7);
console.log(sr1.getIntervals()); // 期望: [[1, 1], [3, 3], [7, 7]]
sr1.addNum(2);
console.log(sr1.getIntervals()); // 期望: [[1, 3], [7, 7]]
sr1.addNum(6);
console.log(sr1.getIntervals()); // 期望: [[1, 3], [6, 7]]

// 测试 2: 连续添加形成大区间
const sr2 = new SummaryRanges();
sr2.addNum(5);
sr2.addNum(6);
sr2.addNum(7);
sr2.addNum(8);
console.log(sr2.getIntervals()); // 期望: [[5, 8]]

// 测试 3: 重复添加
const sr3 = new SummaryRanges();
sr3.addNum(1);
sr3.addNum(1);
sr3.addNum(1);
console.log(sr3.getIntervals()); // 期望: [[1, 1]]

export {};
