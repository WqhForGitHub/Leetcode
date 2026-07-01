// ============================================================
// 029. 敲击计数器
// ============================================================
// LeetCode 362. Design Hit Counter
// 设计敲击计数器，记录敲击时间戳，能返回过去5分钟内的敲击次数。

// 方法1：双端队列（记录每次敲击的时间戳）
class HitCounter {
  private times: number[];

  constructor() {
    this.times = [];
  }

  hit(timestamp: number): void {
    this.times.push(timestamp);
  }

  getHits(timestamp: number): number {
    // 移除5分钟（300秒）前的记录
    while (this.times.length > 0 && this.times[0] <= timestamp - 300) {
      this.times.shift();
    }
    return this.times.length;
  }
}

// 方法2：固定大小数组（优化空间，支持同一秒多次敲击）
class HitCounterFixed {
  private times: number[];
  private hits: number[];

  constructor() {
    this.times = new Array(300).fill(0);
    this.hits = new Array(300).fill(0);
  }

  hit(timestamp: number): void {
    const idx = timestamp % 300;
    if (this.times[idx] !== timestamp) {
      this.times[idx] = timestamp;
      this.hits[idx] = 1;
    } else {
      this.hits[idx]++;
    }
  }

  getHits(timestamp: number): number {
    let total = 0;
    for (let i = 0; i < 300; i++) {
      if (this.times[i] > timestamp - 300) {
        total += this.hits[i];
      }
    }
    return total;
  }
}

// 方法3：二分查找
class HitCounterBinary {
  private times: number[];

  constructor() {
    this.times = [];
  }

  hit(timestamp: number): void {
    this.times.push(timestamp);
  }

  getHits(timestamp: number): number {
    const target = timestamp - 300;
    // 二分找第一个大于 target 的位置
    let left = 0;
    let right = this.times.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.times[mid] <= target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return this.times.length - left;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 029. 敲击计数器 =====");
const hc = new HitCounter();
hc.hit(1);
hc.hit(2);
hc.hit(3);
console.log("getHits(4):", hc.getHits(4)); // 3
hc.hit(300);
console.log("getHits(300):", hc.getHits(300)); // 4
console.log("getHits(301):", hc.getHits(301)); // 3

export {};
