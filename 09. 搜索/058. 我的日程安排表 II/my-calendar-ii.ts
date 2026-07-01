// ============================================================
// 058. 我的日程安排表 II
// ============================================================
// LeetCode 731. My Calendar II
// 允许双重预订但不允许三重预订。

// 方法1：两个列表（记录所有区间和重叠区间）
class MyCalendarTwo {
  private events: number[][]; // 所有事件
  private overlaps: number[][]; // 二重预订区间

  constructor() {
    this.events = [];
    this.overlaps = [];
  }

  book(start: number, end: number): boolean {
    // 检查是否与已有二重预订区间重叠（会导致三重预订）
    for (const [s, e] of this.overlaps) {
      if (start < e && end > s) return false;
    }
    // 更新二重预订区间
    for (const [s, e] of this.events) {
      const os = Math.max(start, s);
      const oe = Math.min(end, e);
      if (os < oe) {
        this.overlaps.push([os, oe]);
      }
    }
    this.events.push([start, end]);
    return true;
  }
}

// 方法2：差分数组 / 线段计数
class MyCalendarTwoCount {
  private timeline: Map<number, number>;

  constructor() {
    this.timeline = new Map();
  }

  book(start: number, end: number): boolean {
    const delta = new Map(this.timeline);
    delta.set(start, (delta.get(start) || 0) + 1);
    delta.set(end, (delta.get(end) || 0) - 1);
    const points = Array.from(delta.keys()).sort((a, b) => a - b);
    let active = 0;
    for (const p of points) {
      active += delta.get(p)!;
      if (active >= 3) return false; // 三重预订
    }
    this.timeline = delta;
    return true;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 058. 我的日程安排表 II =====");
const cal2 = new MyCalendarTwo();
console.log("book(10,20):", cal2.book(10, 20)); // true
console.log("book(50,60):", cal2.book(50, 60)); // true
console.log("book(10,40):", cal2.book(10, 40)); // true
console.log("book(5,15):", cal2.book(5, 15)); // false
console.log("book(5,10):", cal2.book(5, 10)); // true
console.log("book(25,55):", cal2.book(25, 55)); // true

export {};
