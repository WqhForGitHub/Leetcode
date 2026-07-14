// ============================================================
// 059. 括号的分数
// ============================================================
// LeetCode 856. Score of Parentheses
// 给定一个平衡括号字符串，按规则计算分数：
// () 得 1 分；AB 得 A+B；(A) 得 2*A。

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 遇 '(' 压 0 作为标记；遇 ')' 弹出栈顶，若为 0 则得 1 分，否则翻倍，
// 加到新栈顶上。时间 O(n)，空间 O(n)。
function scoreOfParentheses(s: string): number {
  const stack: number[] = [0]; // 栈底累加结果
  for (const ch of s) {
    if (ch === "(") {
      stack.push(0);
    } else {
      const v = stack.pop()!;
      const score = v === 0 ? 1 : 2 * v;
      stack[stack.length - 1] += score;
    }
  }
  return stack[0];
}

// ------------------------------------------------------------
// 方法2：计数法（O(1) 空间）
// ------------------------------------------------------------
// 只有「()」这种深度贡献分数，分数 = 2^depth。
function scoreOfParenthesesCount(s: string): number {
  let depth = 0;
  let result = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else {
      depth--;
      if (s[i - 1] === "(") result += 1 << depth; // 2^depth
    }
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1 - 栈法:", scoreOfParentheses("()"), "期望: 1");
  console.log("测试2 - 栈法:", scoreOfParentheses("(())"), "期望: 2");
  console.log("测试3 - 栈法:", scoreOfParentheses("()()"), "期望: 2");
  console.log("测试4 - 计数:", scoreOfParenthesesCount("(()(()))"), "期望: 6");
}

test();

export {};
