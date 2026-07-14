// ============================================================
// 135. 括号
// ============================================================
// 面试金典 CCI 08.09. 括号
// 给定 n 对括号，返回所有合法的括号组合。
// 时间复杂度：O(4^n / sqrt(n)) (卡特兰数), 空间复杂度：O(n)

// 方法1：回溯(左右计数) (推荐)
// 维护已使用的左括号数 left 和右括号数 right。
// 当 left < n 时可加左括号；当 right < left 时可加右括号。
// 时间复杂度 O(4^n / sqrt(n)), 空间复杂度 O(n)
function generateParens(n: number): string[] {
  const result: string[] = [];
  const path: string[] = [];

  const backtrack = (left: number, right: number): void => {
    // 左右括号均用完，记录结果
    if (left === n && right === n) {
      result.push(path.join(""));
      return;
    }
    // 加左括号
    if (left < n) {
      path.push("(");
      backtrack(left + 1, right);
      path.pop();
    }
    // 加右括号（右括号数不能超过左括号数，否则非法）
    if (right < left) {
      path.push(")");
      backtrack(left, right + 1);
      path.pop();
    }
  };

  backtrack(0, 0);
  return result;
}

// 方法2：递归分治
// 对每个位置尝试放左括号或右括号（需满足合法性），递归构造。
// 使用剩余可用左括号数 left 和右括号数 right 表达。
// 时间复杂度 O(4^n / sqrt(n)), 空间复杂度 O(n)
function generateParensRecur(n: number): string[] {
  const result: string[] = [];
  // left: 剩余可用左括号, right: 剩余可用右括号, cur: 当前串
  const build = (left: number, right: number, cur: string): void => {
    if (left === 0 && right === 0) {
      result.push(cur);
      return;
    }
    // 还可放左括号
    if (left > 0) {
      build(left - 1, right, cur + "(");
    }
    // 右括号剩余数必须大于左括号剩余数，才能保证合法
    if (right > left) {
      build(left, right - 1, cur + ")");
    }
  };

  build(n, n, "");
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 135. 括号 =====");
console.log(generateParens(3));
// 期望结果: ["((()))","(()())","(())()","()(())","()()()"]
console.log(generateParensRecur(3));
console.log(generateParens(1)); // 期望结果: ["()"]
console.log(generateParensRecur(1));
console.log(generateParens(2)); // 期望结果: ["(())","()()"]

export {};
