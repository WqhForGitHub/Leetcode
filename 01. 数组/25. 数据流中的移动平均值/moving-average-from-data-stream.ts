// ============================================================
// 25. 数据流中的移动平均值
// ============================================================
// LeetCode 346. Moving Average from Data Stream
// 给定窗口大小 size，实现 MovingAverage class，每次 next(val) 添加新值并返回窗口内平均值。
// 时间复杂度：O(1) next

// 方法1：队列+维护总和（推荐）
class MovingAverage {
  private size: number;
  private queue: number[];
  private sum: number;

  constructor(size: number) {
    this.size = size;
    this.queue = [];
    this.sum = 0;
  }

  next(val: number): number {
    this.queue.push(val);
    this.sum += val;
    // 超出窗口大小，移除最早的元素
    if (this.queue.length > this.size) {
      this.sum -= this.queue.shift() as number;
    }
    return this.sum / this.queue.length;
  }
}

// 方法2：循环数组
class MovingAverageCircular {
  private size: number;
  private buffer: number[];
  private index: number; // 下一个写入位置
  private count: number; // 已写入元素数量
  private sum: number;

  constructor(size: number) {
    this.size = size;
    this.buffer = new Array(size).fill(0);
    this.index = 0;
    this.count = 0;
    this.sum = 0;
  }

  next(val: number): number {
    // 如果窗口已满，减去被覆盖的旧值
    if (this.count >= this.size) {
      this.sum -= this.buffer[this.index];
    } else {
      this.count++;
    }
    // 写入新值
    this.buffer[this.index] = val;
    this.sum += val;
    this.index = (this.index + 1) % this.size;
    return this.sum / this.count;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 25. 数据流中的移动平均值 =====");
const ma = new MovingAverage(3);
console.log("描述:", ma.next(1)); // 期望结果: 1.0
console.log("描述:", ma.next(10)); // 期望结果: 5.5
console.log("描述:", ma.next(3)); // 期望结果: 4.666666666666667
console.log("描述:", ma.next(5)); // 期望结果: 6.0

const maCircular = new MovingAverageCircular(3);
console.log("描述:", maCircular.next(1)); // 期望结果: 1.0
console.log("描述:", maCircular.next(10)); // 期望结果: 5.5
console.log("描述:", maCircular.next(3)); // 期望结果: 4.666666666666667
console.log("描述:", maCircular.next(5)); // 期望结果: 6.0

export {};
