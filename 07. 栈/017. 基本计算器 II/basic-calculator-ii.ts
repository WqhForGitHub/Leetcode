// ============================================================
// 017. 基本计算器 II
// ============================================================
// LeetCode 227. Basic Calculator II
// 给你一个字符串表达式 s，实现含 + - * / 和空格、非负整数的计算器（整数除法向零取整）。

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 先处理 * / （立即计算入栈），+ - 把数字带符号入栈，最后栈中求和。
// 时间 O(n)，空间 O(n)。
function calculate(s: string): number {
  const stack: number[] = [];
  let num = 0;
  let sign = "+";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") {
      num = num * 10 + (ch.charCodeAt(0) - "0".charCodeAt(0));
    }
    if ((ch !== " " && isNaN(Number(ch))) || i === s.length - 1) {
      switch (sign) {
        case "+":
          stack.push(num);
          break;
        case "-":
          stack.push(-num);
          break;
        case "*":
          stack.push(stack.pop()! * num);
          break;
        case "/":
          stack.push(Math.trunc(stack.pop()! / num));
          break;
      }
      sign = ch;
      num = 0;
    }
  }
  return stack.reduce((a, b) => a + b, 0);
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", calculate("3+2*2"), "期望: 7");
  console.log("测试2:", calculate(" 3/2 "), "期望: 1");
  console.log("测试3:", calculate(" 3+5 / 2 "), "期望: 5");
  console.log("测试4:", calculate("14-3/2"), "期望: 13");
}

test();

export {};
