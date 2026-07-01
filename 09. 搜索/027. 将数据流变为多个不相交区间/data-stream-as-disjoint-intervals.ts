// ============================================================
// 027. 将数据流变为多个不相交区间
// ============================================================
// LeetCode 352. Data Stream as Disjoint Intervals
// 设计数据结构，能添加数字并返回当前数字组成的不相交区间列表。

// 方法1：二分查找插入
class SummaryRanges {
  private intervals: number[][];

  constructor() {
    this.intervals = [];
  }

  addNum(value: number): void {
    // 二分查找插入位置
    let left = 0;
    let right = this.intervals.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (value >= this.intervals[mid][0] && value <= this.intervals[mid][1]) {
        return; // 已存在
      }
      if (value < this.intervals[mid][0]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // left 是插入位置
    const newInterval: number[] = [value, value];
    // 检查左边是否可以合并
    if (left > 0 && this.intervals[left - 1][1] + 1 === value) {
      newInterval[0] = this.intervals[left - 1][0];
      this.intervals.splice(left - 1, 1);
      left--;
    }
    // 检查右边是否可以合并
    if (left < this.intervals.length && this.intervals[left][0] - 1 === value) {
      newInterval[1] = this.intervals[left][1];
      this.intervals.splice(left, 1);
    }
    this.intervals.splice(left, 0, newInterval);
  }

  getIntervals(): number[][] {
    return this.intervals;
  }
}

// 方法2：有序集合（用 Set + 排序）
class SummaryRangesSortedSet {
  private nums: Set<number>;

  constructor() {
    this.nums = new Set();
  }

  addNum(value: number): void {
    this.nums.add(value);
  }

  getIntervals(): number[][] {
    const sorted = Array.from(this.nums).sort((a, b) => a - b);
    const result: number[][] = [];
    for (const num of sorted) {
      if (result.length > 0 && result[result.length - 1][1] + 1 === num) {
        result[result.length - 1][1] = num;
      } else {
        result.push([num, num]);
      }
    }
    return result;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 027. 将数据流变为多个不相交区间 =====");
const sr = new SummaryRanges();
sr.addNum(1);
console.log("add 1:", sr.getIntervals()); // [[1,1]]
sr.addNum(3);
console.log("add 3:", sr.getIntervals()); // [[1,1],[3,3]]
sr.addNum(7);
console.log("add 7:", sr.getIntervals()); // [[1,1],[3,3],[7,7]]
sr.addNum(2);
console.log("add 2:", sr.getIntervals()); // [[1,3],[7,7]]
sr.addNum(6);
console.log("add 6:", sr.getIntervals()); // [[1,3],[6,7]]

export {};
