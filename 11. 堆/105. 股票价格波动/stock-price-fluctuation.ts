// ============================================================
// 105. 股票价格波动
// ============================================================
// LeetCode 2034. Stock Price Fluctuation
// 支持更新某时间点价格，查询最新、最大、最小价格。
// 时间复杂度：update O(log N)，current O(1)

// 方法1：最大堆 + 最小堆 + 延迟删除
class StockPrice {
  private latest: number = 0;
  private latestTime: number = 0;
  private prices: Map<number, number> = new Map();
  private maxHeap: Array<{ time: number; price: number }> = [];
  private minHeap: Array<{ time: number; price: number }> = [];
  private maxDeleted: Map<number, number> = new Map();
  private minDeleted: Map<number, number> = new Map();

  update(timestamp: number, price: number): void {
    if (timestamp >= this.latestTime) {
      this.latestTime = timestamp;
      this.latest = price;
    }
    const old = this.prices.get(timestamp);
    if (old !== undefined) {
      this.maxDeleted.set(timestamp, (this.maxDeleted.get(timestamp) ?? 0) + 1);
      this.minDeleted.set(timestamp, (this.minDeleted.get(timestamp) ?? 0) + 1);
    }
    this.prices.set(timestamp, price);
    this.pushMax({ time: timestamp, price });
    this.pushMin({ time: timestamp, price });
  }
  current(): number {
    return this.latest;
  }
  maximum(): number {
    while (this.maxHeap.length > 0) {
      const top = this.maxHeap[0];
      const cnt = this.maxDeleted.get(top.time) ?? 0;
      if (cnt > 0) {
        this.maxDeleted.set(top.time, cnt - 1);
        this.popMax();
      } else if (this.prices.get(top.time) !== top.price) {
        this.popMax();
      } else break;
    }
    return this.maxHeap[0].price;
  }
  minimum(): number {
    while (this.minHeap.length > 0) {
      const top = this.minHeap[0];
      const cnt = this.minDeleted.get(top.time) ?? 0;
      if (cnt > 0) {
        this.minDeleted.set(top.time, cnt - 1);
        this.popMin();
      } else if (this.prices.get(top.time) !== top.price) {
        this.popMin();
      } else break;
    }
    return this.minHeap[0].price;
  }
  private pushMax(v: { time: number; price: number }): void {
    this.maxHeap.push(v);
    let i = this.maxHeap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.maxHeap[i].price > this.maxHeap[p].price) {
        [this.maxHeap[i], this.maxHeap[p]] = [this.maxHeap[p], this.maxHeap[i]];
        i = p;
      } else break;
    }
  }
  private popMax(): void {
    const last = this.maxHeap.pop()!;
    if (this.maxHeap.length > 0) {
      this.maxHeap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < this.maxHeap.length && this.maxHeap[l].price > this.maxHeap[s].price) s = l;
        if (r < this.maxHeap.length && this.maxHeap[r].price > this.maxHeap[s].price) s = r;
        if (s !== i) {
          [this.maxHeap[i], this.maxHeap[s]] = [this.maxHeap[s], this.maxHeap[i]];
          i = s;
        } else break;
      }
    }
  }
  private pushMin(v: { time: number; price: number }): void {
    this.minHeap.push(v);
    let i = this.minHeap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.minHeap[i].price < this.minHeap[p].price) {
        [this.minHeap[i], this.minHeap[p]] = [this.minHeap[p], this.minHeap[i]];
        i = p;
      } else break;
    }
  }
  private popMin(): void {
    const last = this.minHeap.pop()!;
    if (this.minHeap.length > 0) {
      this.minHeap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < this.minHeap.length && this.minHeap[l].price < this.minHeap[s].price) s = l;
        if (r < this.minHeap.length && this.minHeap[r].price < this.minHeap[s].price) s = r;
        if (s !== i) {
          [this.minHeap[i], this.minHeap[s]] = [this.minHeap[s], this.minHeap[i]];
          i = s;
        } else break;
      }
    }
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 105. 股票价格波动 =====");
const sp = new StockPrice();
sp.update(1, 10);
sp.update(2, 5);
console.log("current:", sp.current()); // 5
console.log("max:", sp.maximum()); // 10
sp.update(1, 3);
console.log("max:", sp.maximum()); // 5
console.log("min:", sp.minimum()); // 3

export {};
