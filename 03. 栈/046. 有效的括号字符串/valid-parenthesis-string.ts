// ============================================================
// 046. 有效的括号字符串
// ============================================================
// LeetCode 678. Valid Parenthesis String
// 给定一个只包含 '(' ')' '*' 的字符串，'*' 可作为 '(' 或 ')' 或空，判断是否合法。

// ------------------------------------------------------------
// 方法1：双栈（贪心）
// ------------------------------------------------------------
// 一个栈存左括号下标，一个栈存星号下标。遇 ')' 优先匹配左括号，再匹配星号。
// 最后用剩余星号匹配左括号（星号下标必须大于左括号下标）。
// 时间 O(n)，空间 O(n)。
function checkValidString(s: string): boolean {
  const leftStack: number[] = [];
  const starStack: number[] = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      leftStack.push(i);
    } else if (s[i] === '*') {
      starStack.push(i);
    } else {
      // ')'
      if (leftStack.length > 0) leftStack.pop();
      else if (starStack.length > 0) starStack.pop();
      else return false;
    }
  }
  // 剩余左括号需用右侧星号匹配
  while (leftStack.length > 0) {
    if (starStack.length === 0) return false;
    if (leftStack.pop()! > starStack.pop()!) return false;
  }
  return true;
}

// ------------------------------------------------------------
// 方法2：贪心计数（O(1) 空间）
// ------------------------------------------------------------
// 维护可能的最少/最多左括号数 [lo, hi]。
function checkValidStringGreedy(s: string): boolean {
  let lo = 0,
    hi = 0;
  for (const ch of s) {
    if (ch === '(') {
      lo++;
      hi++;
    } else if (ch === ')') {
      lo = Math.max(lo - 1, 0);
      hi--;
      if (hi < 0) return false;
    } else {
      // '*'
      lo = Math.max(lo - 1, 0);
      hi++;
    }
  }
  return lo === 0;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1 - 双栈:', checkValidString('()'), '期望: true');
  console.log('测试2 - 双栈:', checkValidString('(*)'), '期望: true');
  console.log('测试3 - 双栈:', checkValidString('(*))'), '期望: true');
  console.log('测试4 - 贪心:', checkValidStringGreedy('(*))'), '期望: true');
  console.log('测试5 - 贪心:', checkValidStringGreedy('(((******))'), '期望: true');
}

test();

export {};
