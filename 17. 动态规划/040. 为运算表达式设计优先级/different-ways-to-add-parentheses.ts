// ============================================================
// 040. 为运算表达式设计优先级
// ============================================================
// LeetCode 241. Different Ways to Add Parentheses
// 给定含数字和运算符的表达式，返回所有可能加括号方式的结果
// 时间复杂度 O(2^n)

// 方法1：分治递归（推荐）
// 遇到运算符就分左右递归，再根据运算符合并结果
// 对每个运算符，将其作为最后一步计算的运算符
// 时间复杂度 O(2^n)，空间复杂度 O(2^n)
function diffWaysToCompute(expression: string): number[] {
  const result: number[] = [];

  for (let i: number = 0; i < expression.length; i++) {
    const ch: string = expression[i];
    if (ch === "+" || ch === "-" || ch === "*") {
      // 以当前运算符为分界点，分左右递归
      const leftResults: number[] = diffWaysToCompute(expression.substring(0, i));
      const rightResults: number[] = diffWaysToCompute(expression.substring(i + 1));
      // 合并左右结果：笛卡尔积
      for (const left of leftResults) {
        for (const right of rightResults) {
          if (ch === "+") result.push(left + right);
          else if (ch === "-") result.push(left - right);
          else if (ch === "*") result.push(left * right);
        }
      }
    }
  }

  // 如果没有运算符，说明是纯数字
  if (result.length === 0) {
    result.push(parseInt(expression));
  }
  return result;
}

// 方法2：记忆化递归
// 使用Map缓存中间结果，避免对相同子表达式重复计算
// 时间复杂度 O(n³ * Catalan数)，空间复杂度 O(n²)
function diffWaysToComputeMemo(expression: string): number[] {
  const memo: Map<string, number[]> = new Map<string, number[]>();

  function compute(expr: string): number[] {
    // 如果已缓存，直接返回
    if (memo.has(expr)) return memo.get(expr)!;

    const result: number[] = [];
    for (let i: number = 0; i < expr.length; i++) {
      const ch: string = expr[i];
      if (ch === "+" || ch === "-" || ch === "*") {
        // 分左右递归
        const leftResults: number[] = compute(expr.substring(0, i));
        const rightResults: number[] = compute(expr.substring(i + 1));
        // 合并结果
        for (const left of leftResults) {
          for (const right of rightResults) {
            if (ch === "+") result.push(left + right);
            else if (ch === "-") result.push(left - right);
            else if (ch === "*") result.push(left * right);
          }
        }
      }
    }

    // 纯数字
    if (result.length === 0) {
      result.push(parseInt(expr));
    }

    // 缓存结果
    memo.set(expr, result);
    return result;
  }

  return compute(expression);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 040. 为运算表达式设计优先级 =====");
console.log(diffWaysToCompute("2-1-1")); // 期望结果: [0, 2]
console.log(diffWaysToCompute("2*3-4*5")); // 期望结果: [-34, -14, -10, -10, 10]
console.log(diffWaysToComputeMemo("2-1-1")); // 期望结果: [0, 2]
console.log(diffWaysToComputeMemo("2*3-4*5")); // 期望结果: [-34, -14, -10, -10, 10]
console.log(diffWaysToCompute("3")); // 期望结果: [3]

export {};
