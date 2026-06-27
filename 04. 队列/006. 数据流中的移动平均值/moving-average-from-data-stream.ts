// ============================================================
// 006. 数据流中的移动平均值
// ============================================================
// LeetCode 346. Moving Average from Data Stream
// 给定一个整数数据流和一个窗口大小 size，计算窗口中所有数字的移动平均值。

// ------------------------------------------------------------
// 方法1：循环数组
// ------------------------------------------------------------
// 用定长数组模拟循环队列，维护当前窗口和与已填充个数。
// 时间 O(1) next，空间 O(size)。
class MovingAverage1 {
  private window: number[];
  private size: number;
  private index: number = 0;
  private sum: number = 0;
  private count: number = 0;

  constructor(size: number) {
    this.size = size;
    this.window = new Array(size).fill(0);
  }

  next(val: number): number {
    this.sum += val - this.window[this.index];
    this.window[this.index] = val;
    this.index = (this.index + 1) % this.size;
    this.count++;
    return this.sum / Math.min(this.count, this.size);
  }
}

// ------------------------------------------------------------
// 方法2：队列
// ------------------------------------------------------------
// 用队列维护窗口内元素，超过 size 时队首出队。
// 时间 O(1) next，空间 O(size)。
class MovingAverage2 {
  private queue: number[] = [];
  private size: number;
  private sum: number = 0;

  constructor(size: number) {
    this.size = size;
  }

  next(val: number): number {
    this.queue.push(val);
    this.sum += val;
    if (this.queue.length > this.size) {
      this.sum -= this.queue.shift()!;
    }
    return this.sum / this.queue.length;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const m1 = new MovingAverage1(3);
  console.log("测试1:", m1.next(1), "期望: 1.0");
  console.log("测试2:", m1.next(10), "期望: 5.5");
  console.log("测试3:", m1.next(3), "期望: 4.6667");
  console.log("测试4:", m1.next(5), "期望: 6.0");

  const m2 = new MovingAverage2(3);
  console.log("测试5:", m2.next(1), "期望: 1.0");
  console.log("测试6:", m2.next(10), "期望: 5.5");
  console.log("测试7:", m2.next(3), "期望: 4.6667");
  console.log("测试8:", m2.next(5), "期望: 6.0");
}

test();

export {};
