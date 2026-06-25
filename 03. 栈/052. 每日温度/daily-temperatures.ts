// ============================================================
// 052. 每日温度
// ============================================================
// LeetCode 739. Daily Temperatures
// 给定每日温度数组，返回一个数组，其中第 i 个元素是第 i 天后第一个更高温度距离的天数。

// ------------------------------------------------------------
// 方法1：单调栈
// ------------------------------------------------------------
// 单调递减栈存下标，遇到更高温度时弹出栈顶并计算天数差。
// 时间 O(n)，空间 O(n)。
function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const result = new Array(n).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const idx = stack.pop()!;
      result[idx] = i - idx;
    }
    stack.push(i);
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]), '期望: [1,1,4,2,1,1,0,0]');
  console.log('测试2:', dailyTemperatures([30, 40, 50, 60]), '期望: [1,1,1,0]');
  console.log('测试3:', dailyTemperatures([30, 60, 90]), '期望: [1,1,0]');
}

test();

export {};
