// ============================================================
// 032. 三元表达式解析器
// ============================================================
// LeetCode 439. Ternary Expression Parser
// 给定一个三元表达式字符串（如 "T?2:3"），返回其解析结果。

// ------------------------------------------------------------
// 方法1：从右向左栈
// ------------------------------------------------------------
// 从右往左扫描，遇到 '?' 时弹出栈顶两个元素，根据条件选择一个再入栈。
// 时间 O(n)，空间 O(n)。
function parseTernary(expression: string): string {
  const stack: string[] = [];
  for (let i = expression.length - 1; i >= 0; i--) {
    const ch = expression[i];
    if (ch === ":") continue;
    if (ch === "?") {
      const condition = expression[i - 1];
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push(condition === "T" ? a : b);
      i--; // 跳过条件字符
    } else {
      stack.push(ch);
    }
  }
  return stack[0];
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", parseTernary("T?2:3"), "期望: 2");
  console.log("测试2:", parseTernary("F?1:T?4:5"), "期望: 4");
  console.log("测试3:", parseTernary("T?T?F:7:T?1:5"), "期望: F");
}

test();

export {};
