// ============================================================
// 123. 括号生成
// ============================================================
// 面试金典 08.09 / LeetCode 22. Generate Parentheses
// 生成 n 对括号的所有合法组合。

// 时间复杂度：O(4^n / sqrt(n))（卡特兰数）
// 空间复杂度：O(n) 递归栈

// 方法1：回溯（左右计数）
// 维护已用左括号数 left 和右括号数 right，
// 当 left < n 可加左括号；当 right < left 可加右括号。
// 时间复杂度 O(4^n / sqrt(n)), 空间复杂度 O(n)
function generateParenthesis(n: number): string[] {
  const result: string[] = [];
  const path: string[] = [];

  function backtrack(left: number, right: number): void {
    if (path.length === 2 * n) {
      result.push(path.join(""));
      return;
    }
    if (left < n) {
      path.push("(");
      backtrack(left + 1, right);
      path.pop();
    }
    if (right < left) {
      path.push(")");
      backtrack(left, right + 1);
      path.pop();
    }
  }

  backtrack(0, 0);
  return result;
}

// 方法2：递归分治
// 任意合法括号串可写成 (A)B，其中 A、B 都是合法括号串（可能为空）。
// 枚举 A 用 i 对、B 用 n-1-i 对即可。
// 时间复杂度 O(4^n / sqrt(n)), 空间复杂度 O(n)
function generateParenthesis2(n: number): string[] {
  if (n === 0) return [""];
  const result: Set<string> = new Set();
  for (let i: number = 0; i < n; i++) {
    const leftList: string[] = generateParenthesis2(i);
    const rightList: string[] = generateParenthesis2(n - 1 - i);
    for (const a of leftList) {
      for (const b of rightList) {
        result.add("(" + a + ")" + b);
      }
    }
  }
  return Array.from(result);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 123. 括号生成 =====");
console.log(generateParenthesis(3));
// 期望: ["((()))","(()())","(())()","()(())","()()()"]
console.log(generateParenthesis2(3));
console.log(generateParenthesis(1)); // 期望: ["()"]

export {};
