// ============================================================
// 022. 去除重复字母
// ============================================================
// LeetCode 316. Remove Duplicate Letters
// 给你一个字符串 s，去掉其中重复字母，使每个字母只出现一次，
// 且结果字典序最小，并保持原相对顺序。

// ------------------------------------------------------------
// 方法1：单调栈 + 贪心
// ------------------------------------------------------------
// 维护单调递增栈，当栈顶字符大于当前字符、且栈顶字符后面还会出现时，弹出。
// 用 visited 集合避免重复入栈。时间 O(n)，空间 O(1)（字母表固定）。
function removeDuplicateLetters(s: string): string {
  const count: Record<string, number> = {};
  for (const ch of s) count[ch] = (count[ch] || 0) + 1;
  const stack: string[] = [];
  const inStack: Record<string, boolean> = {};
  for (const ch of s) {
    count[ch]--;
    if (inStack[ch]) continue;
    while (stack.length > 0 && stack[stack.length - 1] > ch && count[stack[stack.length - 1]] > 0) {
      inStack[stack.pop()!] = false;
    }
    stack.push(ch);
    inStack[ch] = true;
  }
  return stack.join("");
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", removeDuplicateLetters("bcabc"), "期望: abc");
  console.log("测试2:", removeDuplicateLetters("cbacdcbc"), "期望: acdb");
}

test();

export {};
