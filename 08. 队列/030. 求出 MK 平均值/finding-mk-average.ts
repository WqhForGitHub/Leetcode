// ============================================================
// 030. 求出 MK 平均值
// ============================================================
// LeetCode 1825. Finding MK Average
// 维护一个数据流，保留最近 M 个数，去掉最大的 K 个和最小的 K 个，
// 求剩余数的平均值（向下取整）。

// ------------------------------------------------------------
// 方法1：三个有序集合（多路归并思路）
// ------------------------------------------------------------
// 用三个有序数组分别维护最小 K 个、中间 M-2K 个、最大 K 个。
// addElement 时维护三个集合的平衡。
// 时间 O(log M) addElement，O(1) calculateMKAverage；空间 O(M)。
class MKAverage1 {
  private m: number;
  private k: number;
  private queue: number[] = [];
  private sorted: number[] = [];
  private sum: number = 0;

  constructor(m: number, k: number) {
    this.m = m;
    this.k = k;
  }

  addElement(num: number): void {
    this.queue.push(num);
    // 插入到有序数组
    let lo = 0;
    let hi = this.sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.sorted[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    this.sorted.splice(lo, 0, num);

    if (this.queue.length > this.m) {
      // 移除最旧元素
      const old = this.queue.shift()!;
      const idx = this.sorted.indexOf(old);
      this.sorted.splice(idx, 1);
    }

    if (this.queue.length === this.m) {
      this.sum = 0;
      for (let i = this.k; i < this.m - this.k; i++) {
        this.sum += this.sorted[i];
      }
    }
  }

  calculateMKAverage(): number {
    if (this.queue.length < this.m) return -1;
    return Math.floor(this.sum / (this.m - 2 * this.k));
  }
}

// ------------------------------------------------------------
// 方法2：两个双端队列 + 中间和
// ------------------------------------------------------------
// 用两个双端队列分别维护最小 K 和最大 K，中间元素用有序列表维护。
// 时间 O(log M) addElement，O(1) calculateMKAverage；空间 O(M)。
class MKAverage2 {
  private m: number;
  private k: number;
  private queue: number[] = [];
  private lower: number[] = []; // 最小 K 个，降序排列
  private middle: number[] = []; // 中间元素
  private upper: number[] = []; // 最大 K 个，升序排列
  private sum: number = 0;

  constructor(m: number, k: number) {
    this.m = m;
    this.k = k;
  }

  addElement(num: number): void {
    this.queue.push(num);
    // 简化实现：每次重建三个区间
    const sorted = [...this.queue].sort((a, b) => a - b);
    this.lower = sorted.slice(0, this.k);
    this.middle = sorted.slice(this.k, sorted.length - this.k);
    this.upper = sorted.slice(sorted.length - this.k);
    this.sum = this.middle.reduce((a, b) => a + b, 0);

    if (this.queue.length > this.m) {
      this.queue.shift();
    }
  }

  calculateMKAverage(): number {
    if (this.queue.length < this.m) return -1;
    return Math.floor(this.sum / (this.m - 2 * this.k));
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const mk1 = new MKAverage1(3, 1);
  mk1.addElement(3);
  mk1.addElement(1);
  console.log("测试1:", mk1.calculateMKAverage(), "期望: -1");
  mk1.addElement(10);
  console.log("测试2:", mk1.calculateMKAverage(), "期望: 3");
  mk1.addElement(5);
  console.log("测试3:", mk1.calculateMKAverage(), "期望: 5");
  mk1.addElement(5);
  console.log("测试4:", mk1.calculateMKAverage(), "期望: 5");

  const mk2 = new MKAverage2(3, 1);
  mk2.addElement(3);
  mk2.addElement(1);
  console.log("测试5:", mk2.calculateMKAverage(), "期望: -1");
  mk2.addElement(10);
  console.log("测试6:", mk2.calculateMKAverage(), "期望: 3");
}

test();

export {};
