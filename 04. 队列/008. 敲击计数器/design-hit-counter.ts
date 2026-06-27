// ============================================================
// 008. 敲击计数器
// ============================================================
// LeetCode 362. Design Hit Counter
// 设计一个敲击计数器，记录最近 5 分钟（300 秒）内的敲击次数。

// ------------------------------------------------------------
// 方法1：队列
// ------------------------------------------------------------
// 用队列存储每次敲击的时间戳，hit 时入队，getHits 时清除超过 300 秒的旧时间戳。
// 时间 O(1) hit 均摊，O(n) getHits 最坏；空间 O(n)。
class HitCounter1 {
  private queue: number[] = [];

  hit(timestamp: number): void {
    this.queue.push(timestamp);
  }

  getHits(timestamp: number): number {
    while (this.queue.length > 0 && this.queue[0] <= timestamp - 300) {
      this.queue.shift();
    }
    return this.queue.length;
  }
}

// ------------------------------------------------------------
// 方法2：双队列（时间戳 + 计数，压缩相同时间戳）
// ------------------------------------------------------------
// 当同一秒多次 hit 时合并计数，减少队列长度。
// 时间 O(1) hit，O(m) getHits（m 为不同时间戳数）；空间 O(m)。
class HitCounter2 {
  private times: number[] = [];
  private counts: number[] = [];

  hit(timestamp: number): void {
    if (
      this.times.length > 0 &&
      this.times[this.times.length - 1] === timestamp
    ) {
      this.counts[this.counts.length - 1]++;
    } else {
      this.times.push(timestamp);
      this.counts.push(1);
    }
  }

  getHits(timestamp: number): number {
    while (this.times.length > 0 && this.times[0] <= timestamp - 300) {
      this.times.shift();
      this.counts.shift();
    }
    return this.counts.reduce((a, b) => a + b, 0);
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const c1 = new HitCounter1();
  c1.hit(1);
  c1.hit(2);
  c1.hit(3);
  console.log("测试1:", c1.getHits(4), "期望: 3");
  c1.hit(300);
  console.log("测试2:", c1.getHits(300), "期望: 4");
  console.log("测试3:", c1.getHits(301), "期望: 3");

  const c2 = new HitCounter2();
  c2.hit(1);
  c2.hit(1);
  c2.hit(2);
  c2.hit(3);
  console.log("测试4:", c2.getHits(4), "期望: 4");
  c2.hit(300);
  console.log("测试5:", c2.getHits(300), "期望: 5");
  console.log("测试6:", c2.getHits(301), "期望: 3");
}

test();

export {};
