// ============================================================
// 059. 我的日程安排表 III
// ============================================================
// LeetCode 732. My Calendar III
// 添加区间后返回最大重叠次数（k 值预订）。

// 方法1：差分数组 + 排序（O(n² log n)）
class MyCalendarThree {
  private diff: Map<number, number>;

  constructor() {
    this.diff = new Map();
  }

  book(start: number, end: number): number {
    this.diff.set(start, (this.diff.get(start) || 0) + 1);
    this.diff.set(end, (this.diff.get(end) || 0) - 1);
    const points = Array.from(this.diff.keys()).sort((a, b) => a - b);
    let active = 0;
    let maxK = 0;
    for (const p of points) {
      active += this.diff.get(p)!;
      maxK = Math.max(maxK, active);
    }
    return maxK;
  }
}

// 方法2：线段树（动态开点，O(n log C)）
class MyCalendarThreeSegTree {
  private root: SegNode;

  constructor() {
    this.root = new SegNode();
  }

  book(start: number, end: number): number {
    this.update(this.root, 0, 1_000_000_000, start, end - 1);
    return this.root.maxVal;
  }

  private update(node: SegNode, lo: number, hi: number, start: number, end: number): void {
    if (lo > end || hi < start) return;
    if (start <= lo && hi <= end) {
      node.lazy++;
      node.maxVal++;
      return;
    }
    const mid = Math.floor((lo + hi) / 2);
    if (!node.left) node.left = new SegNode();
    if (!node.right) node.right = new SegNode();
    if (node.lazy > 0) {
      node.left.maxVal += node.lazy;
      node.left.lazy += node.lazy;
      node.right.maxVal += node.lazy;
      node.right.lazy += node.lazy;
      node.lazy = 0;
    }
    this.update(node.left, lo, mid, start, end);
    this.update(node.right, mid + 1, hi, start, end);
    node.maxVal = Math.max(node.left.maxVal, node.right.maxVal);
  }
}

class SegNode {
  left: SegNode | null = null;
  right: SegNode | null = null;
  maxVal = 0;
  lazy = 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 059. 我的日程安排表 III =====");
const cal3 = new MyCalendarThree();
console.log("book(10,20):", cal3.book(10, 20)); // 1
console.log("book(50,60):", cal3.book(50, 60)); // 1
console.log("book(10,40):", cal3.book(10, 40)); // 2
console.log("book(5,15):", cal3.book(5, 15)); // 3
console.log("book(5,10):", cal3.book(5, 10)); // 3
console.log("book(25,55):", cal3.book(25, 55)); // 3

export {};
