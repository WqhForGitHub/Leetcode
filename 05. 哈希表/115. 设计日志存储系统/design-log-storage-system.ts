// ============================================================
// 115. 设计日志存储系统
// ============================================================
// LeetCode 635. Design Log Storage System
// 存储带时间戳的日志，支持按粒度（Year/Month/Day/Hour/Minute/Second）检索区间内的日志 id。
// 时间复杂度：put O(1)，retrieve O(n)；空间复杂度：O(n)

class LogSystem {
  // 日志：(id, 时间戳字符串)
  private logs: [number, string][] = [];
  // 粒度 -> 对应时间戳前缀长度
  private granMap = new Map<string, number>([
    ["Year", 4],
    ["Month", 7],
    ["Day", 10],
    ["Hour", 13],
    ["Minute", 16],
    ["Second", 19],
  ]);

  put(id: number, timestamp: string): void {
    this.logs.push([id, timestamp]);
  }

  // 检索时间戳在 [start, end] 范围（按粒度截断）内的日志 id
  retrieve(start: string, end: string, granularity: string): number[] {
    const len = this.granMap.get(granularity)!;
    const s = start.slice(0, len);
    const e = end.slice(0, len);
    const result: number[] = [];
    for (const [id, ts] of this.logs) {
      const prefix = ts.slice(0, len);
      // 字符串字典序比较与时间序一致（ISO 格式）
      if (s <= prefix && prefix <= e) {
        result.push(id);
      }
    }
    return result;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 115. 设计日志存储系统 =====");
const logSys = new LogSystem();
logSys.put(1, "2017:01:01:23:59:59");
logSys.put(2, "2017:01:01:22:59:59");
logSys.put(3, "2016:01:01:00:00:00");
// 按 Year 检索
console.log(logSys.retrieve("2016:01:01:01:01:01", "2017:01:01:23:00:00", "Year")); // 期望: [1, 2, 3]
// 按 Hour 检索
console.log(logSys.retrieve("2016:01:01:01:01:01", "2017:01:01:23:00:00", "Hour")); // 期望: [1, 2]

export {};
