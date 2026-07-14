// ============================================================
// 064. 日志速率限制器
// ============================================================
// LeetCode 359. Logger Rate Limiter
// 设计一个日志限流器：相同消息在 10 秒内不得再次打印。
// 时间复杂度：shouldPrintMessage O(1)
// 空间复杂度：O(M)，M 为不同消息数量

class Logger {
  // 消息 -> 上次打印的时间戳
  private lastPrinted: Map<string, number>;
  private readonly INTERVAL = 10; // 10 秒冷却

  constructor() {
    this.lastPrinted = new Map();
  }

  shouldPrintMessage(timestamp: number, message: string): boolean {
    const last = this.lastPrinted.get(message);
    // 未见过的消息，或距上次打印已超过 10 秒 -> 可打印
    if (last === undefined || timestamp - last >= this.INTERVAL) {
      this.lastPrinted.set(message, timestamp);
      return true;
    }
    return false;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 064. 日志速率限制器 =====");

// 测试 1：基本流程
const logger1 = new Logger();
// 时刻 1 打印 "foo" -> true
console.log("test1 t=1 foo:", logger1.shouldPrintMessage(1, "foo")); // true
// 时刻 2 再次打印 "foo" -> false（10 秒内）
console.log("test1 t=2 foo:", logger1.shouldPrintMessage(2, "foo")); // false
// 时刻 11 再次打印 "foo" -> true（已过 10 秒）
console.log("test1 t=11 foo:", logger1.shouldPrintMessage(11, "foo")); // true

// 测试 2：不同消息互不影响
const logger2 = new Logger();
console.log("test2 t=1 bar:", logger2.shouldPrintMessage(1, "bar")); // true
console.log("test2 t=2 baz:", logger2.shouldPrintMessage(2, "baz")); // true
console.log("test2 t=3 bar:", logger2.shouldPrintMessage(3, "bar")); // false
console.log("test2 t=3 baz:", logger2.shouldPrintMessage(3, "baz")); // false

// 测试 3：恰好 10 秒边界
const logger3 = new Logger();
console.log("test3 t=0 msg:", logger3.shouldPrintMessage(0, "msg")); // true
console.log("test3 t=9 msg:", logger3.shouldPrintMessage(9, "msg")); // false
console.log("test3 t=10 msg:", logger3.shouldPrintMessage(10, "msg")); // true（间隔正好 10）

export {};
