// ============================================================
// 51. 棒球比赛
// ============================================================
// LeetCode 682. Baseball Game
// 给定字符串数组 ops 表示棒球比赛操作：整数直接得分，"+"为前两轮得分之和，
// "D"为前一轮得分两倍，"C"使前一轮得分无效。返回所有轮次得分总和。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：栈模拟（推荐）
// 整数入栈；"+"取栈顶两项之和入栈；"D"取栈顶两倍入栈；"C"弹出栈顶
function calPoints(ops: string[]): number {
  const stack: number[] = [];

  for (const op of ops) {
    if (op === "+") {
      const n = stack.length;
      stack.push(stack[n - 1] + stack[n - 2]);
    } else if (op === "D") {
      stack.push(stack[stack.length - 1] * 2);
    } else if (op === "C") {
      stack.pop();
    } else {
      stack.push(parseInt(op, 10));
    }
  }

  return stack.reduce((sum, v) => sum + v, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 51. 棒球比赛 =====");
console.log("描述:", calPoints(["5", "2", "C", "D", "+"])); // 期望结果: 30
console.log("描述:", calPoints(["5", "-2", "4", "C", "D", "9", "+", "+"])); // 期望结果: 27
console.log("描述:", calPoints(["1"])); // 期望结果: 1

export {};
