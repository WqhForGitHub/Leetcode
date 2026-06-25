// ============================================================
// 012. 逆波兰表达式求值
// ============================================================
// LeetCode 150. Evaluate Reverse Polish Notation
// 根据 逆波兰表示法，求表达式的值。有效运算符 + - * /。

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 遇到数字入栈，遇到运算符弹出两个操作数计算后入栈。
// 注意除法向零取整（truncate toward zero）。
// 时间 O(n)，空间 O(n)。
function evalRPN(tokens: string[]): number {
  const stack: number[] = [];
  for (const t of tokens) {
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      const b = stack.pop()!;
      const a = stack.pop()!;
      let r: number;
      switch (t) {
        case '+':
          r = a + b;
          break;
        case '-':
          r = a - b;
          break;
        case '*':
          r = a * b;
          break;
        default:
          r = Math.trunc(a / b);
          break;
      }
      stack.push(r);
    } else {
      stack.push(parseInt(t, 10));
    }
  }
  return stack[0];
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', evalRPN(['2', '1', '+', '3', '*']), '期望: 9');
  console.log('测试2:', evalRPN(['4', '13', '5', '/', '+']), '期望: 6');
  console.log('测试3:', evalRPN(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']), '期望: 22');
}

test();

export {};
