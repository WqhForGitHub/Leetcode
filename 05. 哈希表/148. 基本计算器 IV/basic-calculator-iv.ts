// ============================================================
// 148. 基本计算器 IV
// ============================================================
// LeetCode 770. Basic Calculator IV
// 给定表达式 expression、evalvars（变量名）、evalints（对应值），
// 求表达式的多项式表示。结果按字典序排列，合并同类项。
// 时间复杂度：依表达式长度；空间复杂度：依表达式长度

// 思路：用 Map<项字符串, 系数> 表示多项式
// 项的字符串形式：变量按字典序拼接，如 "a*b*c"
type Poly = Map<string, number>; // 项 -> 系数

function basicCalculatorIV(
  expression: string,
  evalvars: string[],
  evalints: number[],
): string[] {
  // 变量赋值
  const evalMap = new Map<string, number>();
  for (let i = 0; i < evalvars.length; i++) {
    evalMap.set(evalvars[i], evalints[i]);
  }

  // 解析为 token
  const tokens = tokenize(expression);

  // 调度场算法转逆波兰
  const rpn = toRPN(tokens);

  // 计算逆波兰
  const result = evalRPN(rpn, evalMap);

  // 格式化输出
  return formatPoly(result);
}

// 分词
function tokenize(s: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === " ") {
      i++;
    } else if (/[+\-*/()]/.test(s[i])) {
      tokens.push(s[i]);
      i++;
    } else {
      let j = i;
      while (j < s.length && !/[\s+\-*/()]/.test(s[j])) j++;
      tokens.push(s.slice(i, j));
      i = j;
    }
  }
  return tokens;
}

// 转 RPN
function toRPN(tokens: string[]): string[] {
  const output: string[] = [];
  const ops: string[] = [];
  const prec: Record<string, number> = { "+": 1, "-": 1, "*": 2 };

  for (const t of tokens) {
    if (t === "(") {
      ops.push(t);
    } else if (t === ")") {
      while (ops[ops.length - 1] !== "(") {
        output.push(ops.pop()!);
      }
      ops.pop(); // 弹出 "("
    } else if (t === "+" || t === "-" || t === "*") {
      while (
        ops.length > 0 &&
        ops[ops.length - 1] !== "(" &&
        prec[ops[ops.length - 1]] >= prec[t]
      ) {
        output.push(ops.pop()!);
      }
      ops.push(t);
    } else {
      output.push(t);
    }
  }
  while (ops.length > 0) output.push(ops.pop()!);
  return output;
}

// 评估 RPN，返回多项式
function evalRPN(rpn: string[], evalMap: Map<string, number>): Poly {
  const stack: Poly[] = [];
  for (const t of rpn) {
    if (t === "+" || t === "-" || t === "*") {
      const b = stack.pop()!;
      const a = stack.pop()!;
      stack.push(combine(a, b, t));
    } else {
      // 数字或变量
      if (/^-?\d+$/.test(t)) {
        const n = parseInt(t);
        if (n !== 0) {
          const p = new Map<string, number>();
          p.set("", n);
          stack.push(p);
        } else {
          stack.push(new Map());
        }
      } else if (evalMap.has(t)) {
        const n = evalMap.get(t)!;
        if (n !== 0) {
          const p = new Map<string, number>();
          p.set("", n);
          stack.push(p);
        } else {
          stack.push(new Map());
        }
      } else {
        const p = new Map<string, number>();
        p.set(t, 1);
        stack.push(p);
      }
    }
  }
  return stack.length > 0 ? stack[0] : new Map();
}

// 合并两个多项式
function combine(a: Poly, b: Poly, op: string): Poly {
  const result = new Map<string, number>();
  if (op === "+") {
    addInto(result, a, 1);
    addInto(result, b, 1);
  } else if (op === "-") {
    addInto(result, a, 1);
    addInto(result, b, -1);
  } else {
    // 乘法：每项相乘
    for (const [ka, va] of a) {
      for (const [kb, vb] of b) {
        // 合并项：变量列表
        const varsA = ka ? ka.split("*") : [];
        const varsB = kb ? kb.split("*") : [];
        const merged = [...varsA, ...varsB].sort();
        const key = merged.join("*");
        result.set(key, (result.get(key) || 0) + va * vb);
      }
    }
  }
  // 移除系数 0 项
  for (const [k, v] of result) {
    if (v === 0) result.delete(k);
  }
  return result;
}

function addInto(target: Poly, src: Poly, sign: number): void {
  for (const [k, v] of src) {
    target.set(k, (target.get(k) || 0) + sign * v);
    if (target.get(k) === 0) target.delete(k);
  }
}

// 格式化输出
function formatPoly(poly: Poly): string[] {
  // 项排序：先按变量数降序，再按字典序
  const terms = Array.from(poly.entries());
  terms.sort((a, b) => {
    const ka = a[0] ? a[0].split("*") : [];
    const kb = b[0] ? b[0].split("*") : [];
    if (ka.length !== kb.length) return kb.length - ka.length;
    return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
  });

  return terms.map(([k, v]) => {
    if (!k) return v.toString(); // 常数项
    // 系数为 1 时省略系数，其他情况保留（含 -1）
    if (v === 1) return k;
    return v + "*" + k;
  });
}

// ============================================================
// 测试
// ============================================================
console.log("===== 148. 基本计算器 IV =====");
console.log(basicCalculatorIV("e + 8 - a + 5", ["e"], [1]));
// 期望: ["-1*a","14"]
console.log(basicCalculatorIV("e - 8 + temperature - pressure", ["e", "temperature"], [1, 12]));
// 期望: ["-1*pressure","5"]
console.log(basicCalculatorIV("(a + b) * (b + c)", [], []));
// 期望: ["a*b","a*c","b*b","b*c"]

export {};
