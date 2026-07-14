// ============================================================
// 057. 我的日程安排表 I
// ============================================================
// LeetCode 729. My Calendar I
// 实现日程安排，能添加不与已有区间重叠的区间。

// 方法1：二分查找维护有序区间
class MyCalendar {
  private intervals: number[][];

  constructor() {
    this.intervals = [];
  }

  book(start: number, end: number): boolean {
    // 二分找插入位置
    let lo = 0;
    let hi = this.intervals.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (this.intervals[mid][0] < start) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    // 检查与前后区间是否重叠
    if (lo > 0 && this.intervals[lo - 1][1] > start) return false;
    if (lo < this.intervals.length && this.intervals[lo][0] < end) return false;
    this.intervals.splice(lo, 0, [start, end]);
    return true;
  }
}

// 方法2：平衡 BST（简化版）
class MyCalendarBST {
  private root: CalendarNode | null = null;

  book(start: number, end: number): boolean {
    if (!this.root) {
      this.root = new CalendarNode(start, end);
      return true;
    }
    return this.insert(this.root, start, end) !== null;
  }

  private insert(node: CalendarNode, start: number, end: number): CalendarNode | null {
    if (end <= node.start) {
      if (!node.left) {
        node.left = new CalendarNode(start, end);
        return node.left;
      }
      return this.insert(node.left, start, end);
    } else if (start >= node.end) {
      if (!node.right) {
        node.right = new CalendarNode(start, end);
        return node.right;
      }
      return this.insert(node.right, start, end);
    }
    return null; // 重叠
  }
}

class CalendarNode {
  start: number;
  end: number;
  left: CalendarNode | null;
  right: CalendarNode | null;
  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
    this.left = null;
    this.right = null;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 057. 我的日程安排表 I =====");
const cal = new MyCalendar();
console.log("book(10,20):", cal.book(10, 20)); // true
console.log("book(15,25):", cal.book(15, 25)); // false
console.log("book(20,30):", cal.book(20, 30)); // true

export {};
