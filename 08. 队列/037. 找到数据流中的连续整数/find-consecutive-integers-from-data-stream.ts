// ============================================================
// 037. 找到数据流中的连续整数
// ============================================================
// LeetCode 2526. Find Consecutive Integers from a Data Stream
// 设计一个数据流检测器，判断最后 k 个整数是否都等于 value。

// ------------------------------------------------------------
// 方法1：计数器（连续计数）
// ------------------------------------------------------------
// 维护一个计数器，当前值等于 value 时递增，否则清零，计数 >= k 即满足。
// 时间 O(1) consec，O(1) add；空间 O(1)。
class DataStream1 {
  private value: number;
  private k: number;
  private count: number = 0;

  constructor(value: number, k: number) {
    this.value = value;
    this.k = k;
  }

  consec(num: number): boolean {
    if (num === this.value) {
      this.count++;
    } else {
      this.count = 0;
    }
    return this.count >= this.k;
  }
}

// ------------------------------------------------------------
// 方法2：队列模拟
// ------------------------------------------------------------
// 用队列保存最近 k 个元素，每次检查是否全部等于 value。
// 时间 O(k) consec，空间 O(k)。
class DataStream2 {
  private value: number;
  private k: number;
  private queue: number[] = [];

  constructor(value: number, k: number) {
    this.value = value;
    this.k = k;
  }

  consec(num: number): boolean {
    this.queue.push(num);
    if (this.queue.length > this.k) {
      this.queue.shift();
    }
    if (this.queue.length < this.k) return false;
    return this.queue.every((n) => n === this.value);
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const ds1 = new DataStream1(4, 3);
  console.log("测试1:", ds1.consec(4), "期望: false");
  console.log("测试2:", ds1.consec(4), "期望: false");
  console.log("测试3:", ds1.consec(4), "期望: true");
  console.log("测试4:", ds1.consec(3), "期望: false");

  const ds2 = new DataStream2(4, 3);
  console.log("测试5:", ds2.consec(4), "期望: false");
  console.log("测试6:", ds2.consec(4), "期望: false");
  console.log("测试7:", ds2.consec(4), "期望: true");
  console.log("测试8:", ds2.consec(3), "期望: false");
}

test();

export {};
