// ============================================================
// 004. 最长有效括号
// ============================================================
// LeetCode 32. Longest Valid Parentheses
// 给定只含 '(' 和 ')' 的字符串，找出最长有效括号子串的长度
// 时间复杂度 O(n)

// 方法1：动态规划（推荐）
// dp[i] 表示以 i 结尾的最长有效括号长度
// 状态转移：
//   s[i]=='(' -> dp[i]=0
//   s[i]==')' 且 s[i-1]=='(' -> dp[i]=dp[i-2]+2 （形如 ...()）
//   s[i]==')' 且 s[i-1]==')' 且 s[i-dp[i-1]-1]=='(' ->
//     dp[i]=dp[i-1]+2+dp[i-dp[i-1]-2] （形如 ...((...))）
// 时间复杂度 O(n)，空间复杂度 O(n)
function longestValidParentheses(s: string): number {
  const n: number = s.length;
  if (n < 2) return 0;
  // dp[i] 表示以 i 结尾的最长有效括号长度
  const dp: number[] = new Array<number>(n).fill(0);
  let maxLen: number = 0;
  for (let i: number = 1; i < n; i++) {
    if (s[i] === ")") {
      if (s[i - 1] === "(") {
        // ...() 形式，与前面的有效段拼接
        dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
      } else {
        // ...)) 形式，需检查与 dp[i-1] 对应的前一个字符是否为 '('
        const prev: number = i - dp[i - 1] - 1;
        if (prev >= 0 && s[prev] === "(") {
          dp[i] = dp[i - 1] + 2 + (prev >= 1 ? dp[prev - 1] : 0);
        }
      }
      if (dp[i] > maxLen) maxLen = dp[i];
    }
  }
  return maxLen;
}

// 方法2：栈（可选第二种解法）
// 栈底保存最后一个未匹配 ')' 的位置，遇到 '(' 入栈，遇到 ')' 弹栈计算长度
// 时间复杂度 O(n)，空间复杂度 O(n)
function longestValidParentheses2(s: string): number {
  const stack: number[] = [];
  stack.push(-1); // 哨兵，用于计算长度
  let maxLen: number = 0;
  for (let i: number = 0; i < s.length; i++) {
    if (s[i] === "(") {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length === 0) {
        // 无 '(' 可匹配，记录新的哨兵位置
        stack.push(i);
      } else {
        const len: number = i - stack[stack.length - 1];
        if (len > maxLen) maxLen = len;
      }
    }
  }
  return maxLen;
}

// 方法3：双指针/左右遍历（可选第三种解法）
// 从左向右扫一遍再从右向左扫一遍，用 left/right 计数
// 时间复杂度 O(n)，空间复杂度 O(1)
function longestValidParentheses3(s: string): number {
  let left: number = 0;
  let right: number = 0;
  let maxLen: number = 0;
  // 从左到右扫描
  for (let i: number = 0; i < s.length; i++) {
    if (s[i] === "(") left++;
    else right++;
    if (left === right) {
      maxLen = Math.max(maxLen, 2 * right);
    } else if (right > left) {
      // 右括号多于左括号，重置
      left = 0;
      right = 0;
    }
  }
  left = 0;
  right = 0;
  // 从右到左扫描，处理左括号多于右括号的情况
  for (let i: number = s.length - 1; i >= 0; i--) {
    if (s[i] === "(") left++;
    else right++;
    if (left === right) {
      maxLen = Math.max(maxLen, 2 * left);
    } else if (left > right) {
      left = 0;
      right = 0;
    }
  }
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 004. 最长有效括号 =====");
console.log(longestValidParentheses("(()")); // 期望结果: 2
console.log(longestValidParentheses(")()())")); // 期望结果: 4
console.log(longestValidParentheses("")); // 期望结果: 0
console.log(longestValidParentheses2(")()())")); // 期望结果: 4
console.log(longestValidParentheses3("(()())")); // 期望结果: 6

export {};
