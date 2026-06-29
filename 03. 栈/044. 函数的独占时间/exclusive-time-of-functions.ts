// ============================================================
// 044. 函数的独占时间
// ============================================================
// LeetCode 636. Exclusive Time of Functions
// 给定单线程 CPU 上运行的函数日志（start/end），返回每个函数的独占时间。

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 栈保存正在运行的函数 id。start 入栈；end 出栈并累加独占时间，
// 同时给栈顶（被中断的函数）补上被占用的时间。
// 时间 O(n)，空间 O(n)。
function exclusiveTime(n: number, logs: string[]): number[] {
  const result = new Array(n).fill(0);
  const stack: number[] = []; // 函数 id
  let prevTime = 0;
  for (const log of logs) {
    const parts = log.split(":");
    const id = parseInt(parts[0], 10);
    const type = parts[1];
    const time = parseInt(parts[2], 10);
    if (type === "start") {
      if (stack.length > 0) {
        result[stack[stack.length - 1]] += time - prevTime;
      }
      stack.push(id);
      prevTime = time;
    } else {
      // end
      result[stack.pop()!] += time - prevTime + 1;
      prevTime = time + 1;
    }
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    exclusiveTime(2, ["0:start:0", "1:start:2", "1:end:5", "0:end:6"]),
    "期望: [3,4]",
  );
  console.log(
    "测试2:",
    exclusiveTime(1, ["0:start:0", "0:start:2", "0:end:5", "0:start:6", "0:end:6", "0:end:7"]),
    "期望: [8]",
  );
}

test();

export {};
