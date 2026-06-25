// ============================================================
// 047. 棒球比赛
// ============================================================
// LeetCode 682. Baseball Game
// 给定一个字符串数组 ops，模拟棒球得分：
// 整数 x：本回合得 x 分；"+"：前两回合之和；"D"：前回合的两倍；"C"：使前回合无效。

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 时间 O(n)，空间 O(n)。
function calPoints(ops: string[]): number {
  const stack: number[] = [];
  for (const op of ops) {
    if (op === '+') {
      const n = stack.length;
      stack.push(stack[n - 1] + stack[n - 2]);
    } else if (op === 'D') {
      stack.push(stack[stack.length - 1] * 2);
    } else if (op === 'C') {
      stack.pop();
    } else {
      stack.push(parseInt(op, 10));
    }
  }
  return stack.reduce((a, b) => a + b, 0);
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', calPoints(['5', '2', 'C', 'D', '+']), '期望: 30');
  console.log('测试2:', calPoints(['5', '-2', '4', 'C', 'D', '9', '+', '+']), '期望: 27');
  console.log('测试3:', calPoints(['1']), '期望: 1');
}

test();

export {};
