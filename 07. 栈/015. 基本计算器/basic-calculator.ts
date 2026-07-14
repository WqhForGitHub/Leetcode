// ============================================================
// 015. 基本计算器
// ============================================================
// LeetCode 224. Basic Calculator
// 给你一个字符串表达式 s，实现基本计算器（含 + - ( ) 和空格、非负整数）。

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 用 sign 记录当前符号，遇到数字累加，遇到 '(' 保存结果和符号入栈，
// 遇到 ')' 弹栈合并。时间 O(n)，空间 O(n)。
function calculate(s: string): number {
  let result = 0;
  let num = 0;
  let sign = 1;
  const stack: number[] = [];
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      num = num * 10 + (ch.charCodeAt(0) - "0".charCodeAt(0));
    } else if (ch === "+") {
      result += sign * num;
      num = 0;
      sign = 1;
    } else if (ch === "-") {
      result += sign * num;
      num = 0;
      sign = -1;
    } else if (ch === "(") {
      stack.push(result);
      stack.push(sign);
      result = 0;
      sign = 1;
    } else if (ch === ")") {
      result += sign * num;
      num = 0;
      result *= stack.pop()!; // sign
      result += stack.pop()!; // previous result
    }
  }
  result += sign * num;
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", calculate("1 + 1"), "期望: 2");
  console.log("测试2:", calculate(" 2-1 + 2 "), "期望: 3");
  console.log("测试3:", calculate("(1+(4+5+2)-3)+(6+8)"), "期望: 23");
  console.log("测试4:", calculate("1-(     -2)"), "期望: 3");
}

test();

export {};
