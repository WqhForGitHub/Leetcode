// ============================================================
// 060. 最近的请求次数
// ============================================================
// LeetCode 933. Number of Recent Calls
// 计算在过去 3000 毫秒内发生的请求数。每次 ping 时间 t 严格递增。

// ------------------------------------------------------------
// 方法1：队列
// ------------------------------------------------------------
// 用队列保存请求时间，每次 ping 时清除队首超过 t-3000 的请求。
// 时间 O(1) 均摊，空间 O(w)。
class RecentCounterA {
  private queue: number[] = [];

  ping(t: number): number {
    this.queue.push(t);
    while (this.queue[0] < t - 3000) {
      this.queue.shift();
    }
    return this.queue.length;
  }
}

// ------------------------------------------------------------
// 方法2：循环数组
// ------------------------------------------------------------
// 预分配固定大小数组模拟队列，用头尾指针操作。
// 时间 O(1) 均摊，空间 O(w)。
class RecentCounterB {
  private data: number[] = new Array(10000).fill(0);
  private front: number = 0;
  private rear: number = 0;

  ping(t: number): number {
    this.data[this.rear] = t;
    this.rear++;
    while (this.data[this.front] < t - 3000) {
      this.front++;
    }
    return this.rear - this.front;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const r1 = new RecentCounterA();
  console.log("测试1:", r1.ping(1), "期望: 1");
  console.log("测试2:", r1.ping(100), "期望: 2");
  console.log("测试3:", r1.ping(3001), "期望: 3");
  console.log("测试4:", r1.ping(3002), "期望: 3");

  const r2 = new RecentCounterB();
  console.log("测试5:", r2.ping(1), "期望: 1");
  console.log("测试6:", r2.ping(100), "期望: 2");
  console.log("测试7:", r2.ping(3001), "期望: 3");
  console.log("测试8:", r2.ping(3002), "期望: 3");
}

test();

export {};
