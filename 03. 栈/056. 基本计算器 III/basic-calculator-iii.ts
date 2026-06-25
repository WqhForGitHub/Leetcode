// ============================================================
// 056. 基本计算器 III
// ============================================================
// LeetCode 772. Basic Calculator III
// 实现含 + - * / ^ ( ) 和非负整数、变量的计算器。

// ------------------------------------------------------------
// 方法1：栈 + 递归（处理括号）
// ------------------------------------------------------------
// 遇 '(' 递归求子表达式值，遇 ')' 返回。用栈处理 + -，* / 立即计算。
// 时间 O(n)，空间 O(n)。
function calculate(s: string): number {
  let i = 0;

  function calc(): number {
    const stack: number[] = [];
    let num = 0;
    let sign = '+';
    while (i < s.length) {
      const ch = s[i++];
      if (ch >= '0' && ch <= '9') {
        num = num * 10 + (ch.charCodeAt(0) - '0'.charCodeAt(0));
      }
      if (ch === '(') {
        num = calc(); // 递归
      }
      if (i >= s.length || ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === ')' || ch === '^') {
        if (sign === '+') stack.push(num);
        else if (sign === '-') stack.push(-num);
        else if (sign === '*') stack.push(stack.pop()! * num);
        else if (sign === '/') stack.push(Math.trunc(stack.pop()! / num));
        else if (sign === '^') stack.push(Math.pow(stack.pop()!, num));
        sign = ch;
        num = 0;
        if (ch === ')') break;
      }
    }
    return stack.reduce((a, b) => a + b, 0);
  }

  return calc();
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', calculate('1 + 1'), '期望: 2');
  console.log('测试2:', calculate('6-4 / 2'), '期望: 4');
  console.log('测试3:', calculate('2*(5+5*2)/3+(6/2+8)'), '期望: 21');
  console.log('测试4:', calculate('(2+6* 3+5- (3*14/7+2)*5)+3'), '期望: -12');
}

test();

export {};
