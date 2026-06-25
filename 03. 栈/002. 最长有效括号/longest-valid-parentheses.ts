// ============================================================
// 002. 最长有效括号
// ============================================================
// LeetCode 32. Longest Valid Parentheses
// 给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 栈底始终保存「最后一个未被匹配的右括号下标」，栈中其余元素为左括号下标。
// 遇到 '(' 入栈；遇到 ')' 时先弹栈，若栈空则把当前下标入栈（作为新的分隔），
// 否则当前有效长度 = 当前下标 - 栈顶下标。
// 时间 O(n)，空间 O(n)。
function longestValidParentheses(s: string): number {
  const stack: number[] = [-1];
  let maxLen = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length === 0) {
        stack.push(i);
      } else {
        maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
      }
    }
  }
  return maxLen;
}

// ------------------------------------------------------------
// 方法2：双指针计数（不用额外空间）
// ------------------------------------------------------------
// 从左到右扫描记录 left/right 计数，当 right>left 重置；当相等时更新答案。
// 再从右到左扫描一次（处理左括号多余的情况）。
// 时间 O(n)，空间 O(1)。
function longestValidParenthesesTwoPass(s: string): number {
  let left = 0,
    right = 0,
    maxLen = 0;
  // 从左到右
  for (const ch of s) {
    if (ch === '(') left++;
    else right++;
    if (right > left) {
      left = right = 0;
    } else if (right === left) {
      maxLen = Math.max(maxLen, 2 * right);
    }
  }
  left = right = 0;
  // 从右到左
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === '(') left++;
    else right++;
    if (left > right) {
      left = right = 0;
    } else if (right === left) {
      maxLen = Math.max(maxLen, 2 * left);
    }
  }
  return maxLen;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1 - 栈法:', longestValidParentheses('(()'), '期望: 2');
  console.log('测试2 - 栈法:', longestValidParentheses(')()())'), '期望: 4');
  console.log('测试3 - 栈法:', longestValidParentheses(''), '期望: 0');
  console.log('测试4 - 双指针:', longestValidParenthesesTwoPass('(()())'), '期望: 6');
  console.log('测试5 - 双指针:', longestValidParenthesesTwoPass('()(()'), '期望: 2');
}

test();

export {};
