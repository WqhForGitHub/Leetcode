// ============================================================
// 028. 分数到小数
// ============================================================
// LeetCode 166. Fraction to Recurring Decimal
// 给定分子 numerator 和分母 denominator，以字符串形式返回分数对应的小数。
// 若小数部分有循环，则用括号将循环部分括起来。
// 哈希表存储余数首次出现的位置，以检测循环。
// 时间复杂度：O(n)，n 为小数部分长度；空间复杂度：O(n)

function fractionToDecimal(numerator: number, denominator: number): string {
  // 边界：分母为 0（题目保证不为 0）
  if (denominator === 0) return "";
  if (numerator === 0) return "0";

  const result: string[] = [];

  // 确定符号
  if (numerator < 0 !== denominator < 0) {
    result.push("-");
  }

  // 取绝对值进行运算（注意使用 Math.trunc 避免精度问题，使用 BigInt 兼容大整数）
  // 这里用 Number 实现，适用于题目范围
  const n = Math.abs(numerator);
  const d = Math.abs(denominator);

  // 整数部分
  result.push(Math.floor(n / d).toString());
  let remainder = n % d;

  // 无余数，结果为整数
  if (remainder === 0) {
    return result.join("");
  }

  // 小数部分
  result.push(".");
  // 哈希表：余数 -> 在结果中的位置
  const remainderMap: Map<number, number> = new Map();

  while (remainder !== 0) {
    // 余数重复出现 -> 进入循环
    if (remainderMap.has(remainder)) {
      const pos = remainderMap.get(remainder)!;
      // 在循环起始位置插入 "("
      result.splice(pos, 0, "(");
      result.push(")");
      break;
    }
    // 记录余数对应位置
    remainderMap.set(remainder, result.length);
    // 余数 *10 后继续除
    remainder *= 10;
    result.push(Math.floor(remainder / d).toString());
    remainder = remainder % d;
  }

  return result.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 028. 分数到小数 =====");
console.log(fractionToDecimal(1, 2)); // "0.5"
console.log(fractionToDecimal(2, 1)); // "2"
console.log(fractionToDecimal(4, 333)); // "0.(012)"
console.log(fractionToDecimal(1, 6)); // "0.1(6)"
console.log(fractionToDecimal(-50, 8)); // "-6.25"

export {};
