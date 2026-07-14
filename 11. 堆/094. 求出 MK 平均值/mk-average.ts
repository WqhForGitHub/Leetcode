// ============================================================
// 094. 求出 MK 平均值
// ============================================================
// LeetCode 1825. Finding MK Average
// 维护一个流，保留最后 m 个数，去掉最大 k 个和最小 k 个，求剩余平均。
// 时间复杂度：addElement O(log m)，calculateAverage O(1)

// 方法1：三个有序集合
class MKAverage {
  private m: number;
  private k: number;
  private queue: number[] = [];
  private lower: number[] = []; // 最小 k 个
  private middle: number[] = []; // 中间
  private upper: number[] = []; // 最大 k 个
  private sum = 0;
  constructor(m: number, k: number) {
    this.m = m;
    this.k = k;
  }
  addElement(num: number): void {
    this.queue.push(num);
    if (this.queue.length > this.m) {
      const out = this.queue.shift()!;
      // 从对应集合移除
      if (out <= (this.lower[this.lower.length - 1] ?? Infinity)) {
        const idx = this.lower.indexOf(out);
        this.lower.splice(idx, 1);
        // 从 middle 补一个
        if (this.middle.length > 0) {
          this.lower.push(this.middle.shift()!);
          this.lower.sort((a, b) => a - b);
        }
      } else if (out >= (this.upper[0] ?? -Infinity)) {
        const idx = this.upper.indexOf(out);
        this.upper.splice(idx, 1);
        if (this.middle.length > 0) {
          this.upper.push(this.middle.pop()!);
          this.upper.sort((a, b) => a - b);
        }
      } else {
        const idx = this.middle.indexOf(out);
        this.middle.splice(idx, 1);
        this.sum -= out;
      }
    }
    // 插入新元素
    const all = [...this.lower, ...this.middle, ...this.upper, num].sort((a, b) => a - b);
    this.lower = all.slice(0, this.k);
    this.middle = all.slice(this.k, this.m - this.k);
    this.upper = all.slice(this.m - this.k, this.m);
    this.sum = this.middle.reduce((a, b) => a + b, 0);
  }
  calculateMKAverage(): number {
    if (this.queue.length < this.m) return -1;
    return Math.floor(this.sum / (this.m - 2 * this.k));
  }
}

// 方法2：三个堆（最大/最小堆 + 中间堆）
class MKAverageHeap {
  private m: number;
  private k: number;
  private queue: number[] = [];
  private sum = 0;
  private sorted: number[] = [];
  constructor(m: number, k: number) {
    this.m = m;
    this.k = k;
  }
  addElement(num: number): void {
    this.queue.push(num);
    // 插入排序
    let lo = 0;
    let hi = this.sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.sorted[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    this.sorted.splice(lo, 0, num);
    if (this.queue.length > this.m) {
      const out = this.queue.shift()!;
      const idx = this.sorted.indexOf(out);
      this.sorted.splice(idx, 1);
    }
  }
  calculateMKAverage(): number {
    if (this.queue.length < this.m) return -1;
    let s = 0;
    for (let i = this.k; i < this.m - this.k; i++) s += this.sorted[i];
    return Math.floor(s / (this.m - 2 * this.k));
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 094. 求出 MK 平均值 =====");
const mk = new MKAverageHeap(3, 1);
mk.addElement(3);
mk.addElement(1);
console.log("平均:", mk.calculateMKAverage()); // 期望 -1
mk.addElement(10);
console.log("平均:", mk.calculateMKAverage()); // 期望 3

export {};
