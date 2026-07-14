// ============================================================
// 002. 括号生成
// ============================================================
// LeetCode 22. Generate Parentheses
// 给定数字 n，生成所有包含 n 对括号的合法组合。
// 时间复杂度：O(4^n / sqrt(n))（卡特兰数），空间复杂度：O(n)

// 方法1：回溯（跟踪左右括号数量）（推荐）
// 维护已使用的左括号数 left 和右括号数 right
// 只要 left < n 就可以加左括号；只要 right < left 就可以加右括号
// 时间复杂度 O(4^n / sqrt(n))，空间复杂度 O(n)
function generateParenthesis(n: number): string[] {
  const result: string[] = [];

  const backtrack = (left: number, right: number, path: string): void => {
    // 当左右括号都用完时收集结果
    if (left === n && right === n) {
      result.push(path);
      return;
    }
    // 还可以加左括号
    if (left < n) {
      backtrack(left + 1, right, path + "(");
    }
    // 右括号数量必须小于左括号数量才能加右括号，保证合法性
    if (right < left) {
      backtrack(left, right + 1, path + ")");
    }
  };

  backtrack(0, 0, "");
  return result;
}

// 方法2：动态规划
// f(i) = "(" + f(j) + ")" + f(i-1-j)，其中 j 从 0 到 i-1
// 即第一组括号内部包含 j 对，外面剩余 i-1-j 对放在后面
// 时间复杂度 O(4^n / sqrt(n))，空间复杂度 O(4^n / sqrt(n))
function generateParenthesisDP(n: number): string[] {
  // dp[i] 表示 i 对括号的所有合法组合
  const dp: string[][] = [[]];
  dp[0] = [""];
  for (let i = 1; i <= n; i++) {
    const cur: string[] = [];
    for (let j = 0; j < i; j++) {
      // 内部 j 对，外部 i-1-j 对
      for (const inside of dp[j]) {
        for (const outside of dp[i - 1 - j]) {
          cur.push("(" + inside + ")" + outside);
        }
      }
    }
    dp[i] = cur;
  }
  return dp[n];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 002. 括号生成 =====");
console.log(generateParenthesis(3)); // 期望结果: ["((()))","(()())","(())()","()(())","()()()"]
console.log(generateParenthesis(1)); // 期望结果: ["()"]
console.log(generateParenthesisDP(3)); // 期望结果: ["((()))","(()())","(())()","()(())","()()()"]
console.log(generateParenthesisDP(1)); // 期望结果: ["()"]
console.log(generateParenthesis(2)); // 期望结果: ["(())","()()"]

export {};
