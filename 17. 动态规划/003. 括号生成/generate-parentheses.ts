// ============================================================
// 003. 括号生成
// ============================================================
// LeetCode 22. Generate Parentheses
// 生成 n 对括号的所有合法组合
// 时间复杂度 O(4^n/sqrt(n))

// 方法1：动态规划（推荐）
// dp[i] 表示 i 对括号的所有合法组合
// 构造：dp[i] = "(" + dp[j] + ")" + dp[i-1-j]，j 从 0 到 i-1
// 即第一对括号内放 j 对，括号后接 i-1-j 对
// 时间复杂度 O(4^n/sqrt(n))，空间复杂度 O(4^n/sqrt(n))
function generateParenthesis(n: number): string[] {
  // dp[i] 存储 i 对括号的所有合法组合
  const dp: string[][] = Array.from({ length: n + 1 }, () => []);
  dp[0] = [""];
  for (let i: number = 1; i <= n; i++) {
    // j 表示括在第一对括号内的对数
    for (let j: number = 0; j < i; j++) {
      // 内部用 j 对，外部 "(...)" 后接 i-1-j 对
      for (const inner of dp[j]) {
        for (const outer of dp[i - 1 - j]) {
          dp[i].push("(" + inner + ")" + outer);
        }
      }
    }
  }
  return dp[n];
}

// 方法2：回溯（可选第二种解法）
// 跟踪左右括号已使用数量，保证任意前缀左括号数>=右括号数
// 时间复杂度 O(4^n/sqrt(n))，空间复杂度 O(n) 递归栈
function generateParenthesis2(n: number): string[] {
  const result: string[] = [];
  const backtrack: (cur: string, left: number, right: number) => void = (
    cur: string,
    left: number,
    right: number,
  ): void => {
    if (cur.length === n * 2) {
      result.push(cur);
      return;
    }
    // 左括号未用完可以加左括号
    if (left < n) {
      backtrack(cur + "(", left + 1, right);
    }
    // 右括号少于左括号才能加右括号，保证合法性
    if (right < left) {
      backtrack(cur + ")", left, right + 1);
    }
  };
  backtrack("", 0, 0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 003. 括号生成 =====");
console.log(generateParenthesis(3)); // 期望结果: ["((()))","(()())","(())()","()(())","()()()"]
console.log(generateParenthesis(1)); // 期望结果: ["()"]
console.log(generateParenthesis2(3)); // 期望结果: ["((()))","(()())","(())()","()(())","()()()"]
console.log(generateParenthesis2(1)); // 期望结果: ["()"]

export {};
