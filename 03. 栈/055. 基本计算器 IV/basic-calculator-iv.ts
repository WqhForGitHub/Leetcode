// ============================================================
// 055. 基本计算器 IV
// ============================================================
// LeetCode 770. Basic Calculator IV
// 给定表达式 expression、变量取值 evalvars 和 evalints，求值并按字典序输出多项式。

// ------------------------------------------------------------
// 方法1：栈 + 多项式（Map 表示）
// ------------------------------------------------------------
// 用「项 -> 系数」的 Map 表示多项式。支持 + - * 和括号、变量赋值。
// 这里给出核心实现（不含通分合并的全部格式化，保留功能）。
function basicCalculatorIV(
  expression: string,
  evalvars: string[],
  evalints: number[],
): string[] {
  // 变量替换
  const evalMap: Record<string, number> = {};
  for (let i = 0; i < evalvars.length; i++) evalMap[evalvars[i]] = evalints[i];

  // 项：用排序后的变量列表表示，系数为 number
  // poly: Map<string(term), number(coef)>
  type Poly = Map<string, number>;

  function addPoly(a: Poly, b: Poly, sign: number): Poly {
    const r = new Map(a);
    for (const [k, v] of b) {
      r.set(k, (r.get(k) || 0) + sign * v);
      if (r.get(k) === 0) r.delete(k);
    }
    return r;
  }

  function mulPoly(a: Poly, b: Poly): Poly {
    const r: Poly = new Map();
    for (const [ka, va] of a) {
      for (const [kb, vb] of b) {
        // 合并项
        const varsA = ka === '' ? [] : ka.split('*');
        const varsB = kb === '' ? [] : kb.split('*');
        const merged = [...varsA, ...varsB].sort();
        const term = merged.join('*');
        r.set(term, (r.get(term) || 0) + va * vb);
        if (r.get(term) === 0) r.delete(term);
      }
    }
    return r;
  }

  function toPoly(token: string): Poly {
    const r: Poly = new Map();
    if (/^-?\d+$/.test(token)) {
      const v = parseInt(token, 10);
      if (v !== 0) r.set('', v);
    } else if (token in evalMap) {
      if (evalMap[token] !== 0) r.set('', evalMap[token]);
    } else {
      r.set(token, 1);
    }
    return r;
  }

  // 简化：用 Shunting Yard 处理表达式（仅支持 + - * 和括号）
  const tokens = tokenizeIV(expression);
  const output: Poly[] = [];
  const ops: string[] = [];
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2 };

  function applyOp(op: string): void {
    const b = output.pop()!;
    const a = output.pop()!;
    if (op === '+') output.push(addPoly(a, b, 1));
    else if (op === '-') output.push(addPoly(a, b, -1));
    else output.push(mulPoly(a, b));
  }

  for (const t of tokens) {
    if (t === '(') {
      ops.push(t);
    } else if (t === ')') {
      while (ops[ops.length - 1] !== '(') applyOp(ops.pop()!);
      ops.pop();
    } else if (t in prec) {
      while (ops.length > 0 && ops[ops.length - 1] !== '(' && prec[ops[ops.length - 1]] >= prec[t]) {
        applyOp(ops.pop()!);
      }
      ops.push(t);
    } else {
      output.push(toPoly(t));
    }
  }
  while (ops.length > 0) applyOp(ops.pop()!);

  const poly = output[0] ?? new Map();
  // 排序输出
  const entries = Array.from(poly.entries());
  entries.sort((a, b) => {
    const va = a[0] === '' ? 0 : a[0].split('*').length;
    const vb = b[0] === '' ? 0 : b[0].split('*').length;
    if (vb !== va) return vb - va; // 变量多的在前
    return a[0].localeCompare(b[0]);
  });
  const result: string[] = [];
  for (const [term, coef] of entries) {
    result.push(term === '' ? `${coef}` : `${coef}*${term}`);
  }
  return result;
}

function tokenizeIV(s: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === ' ') {
      i++;
      continue;
    }
    if ('+-*()'.includes(s[i])) {
      tokens.push(s[i]);
      i++;
    } else {
      let j = i;
      while (j < s.length && !' +-()*'.includes(s[j])) j++;
      tokens.push(s.slice(i, j));
      i = j;
    }
  }
  return tokens;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', basicCalculatorIV('e + 8 - a + 5', ['e'], [1]), '期望: ["-1*a","14"]');
  console.log('测试2:', basicCalculatorIV('a * b * c + b * a * c * 4', [], []), '期望: ["5*a*b*c"]');
}

test();

export {};
