// ============================================================
// 042. 非重叠矩形中的随机点
// ============================================================
// LeetCode 497. Random Point in Non-overlapping Rectangles
// 给定非重叠轴对齐矩形列表，随机均匀地返回其中的一个点。

// 方法1：前缀和 + 二分查找
class Solution497 {
  private rects: number[][];
  private prefix: number[];

  constructor(rects: number[][]) {
    this.rects = rects;
    this.prefix = [0];
    for (const [x1, y1, x2, y2] of rects) {
      const count = (x2 - x1 + 1) * (y2 - y1 + 1);
      this.prefix.push(this.prefix[this.prefix.length - 1] + count);
    }
  }

  pick(): number[] {
    const total = this.prefix[this.prefix.length - 1];
    const r = Math.floor(Math.random() * total);
    // 二分找矩形索引
    let left = 0;
    let right = this.rects.length - 1;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.prefix[mid + 1] > r) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    const rect = this.rects[left];
    const offset = r - this.prefix[left];
    const width = rect[2] - rect[0] + 1;
    const x = rect[0] + (offset % width);
    const y = rect[1] + Math.floor(offset / width);
    return [x, y];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 042. 非重叠矩形中的随机点 =====");
const sol497 = new Solution497([
  [1, 1, 5, 5],
]);
console.log("pick:", sol497.pick()); // 随机点
const sol497b = new Solution497([
  [-2, -2, -1, -1],
  [1, 0, 3, 0],
]);
console.log("pick:", sol497b.pick()); // 随机点

export {};
