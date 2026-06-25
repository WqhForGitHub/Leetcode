// ============================================================
// 051. Lisp 语法解析
// ============================================================
// LeetCode 736. Parse Lisp Expression
// 给定一个 Lisp 表达式字符串，求值。支持 add、mult、let 及变量。

// ------------------------------------------------------------
// 方法1：栈 + 作用域
// ------------------------------------------------------------
// 用栈保存作用域（变量->值 的 Map 链）。递归/迭代解析子表达式。
// 时间 O(n^2)，空间 O(n)。
function evaluate(expression: string): number {
  function parse(tokens: string[], env: Map<string, number>[]): number {
    const token = tokens.shift()!;
    if (token === '(') {
      const op = tokens.shift()!;
      if (op === 'add') {
        const a = parse(tokens, env);
        const b = parse(tokens, env);
        tokens.shift(); // ')'
        return a + b;
      } else if (op === 'mult') {
        const a = parse(tokens, env);
        const b = parse(tokens, env);
        tokens.shift();
        return a * b;
      } else {
        // let
        const localEnv = new Map<string, number>();
        env.push(localEnv);
        let result = 0;
        while (true) {
          const t = tokens.shift()!;
          if (t === ')') break;
          if (t === '(') {
            tokens.unshift('(');
            result = parse(tokens, env);
          } else {
            // 变量名
            const next = tokens.shift()!;
            if (next === ')') {
              // t 是变量或值
              result = getValue(t, env);
              break;
            } else if (next === '(') {
              tokens.unshift('(');
              const val = parse(tokens, env);
              localEnv.set(t, val);
              result = val;
            } else {
              const val = getValue(next, env);
              localEnv.set(t, val);
            }
          }
        }
        env.pop();
        return result;
      }
    } else {
      return getValue(token, env);
    }
  }

  function getValue(token: string, env: Map<string, number>[]): number {
    if (/^-?\d+$/.test(token)) return parseInt(token, 10);
    for (let i = env.length - 1; i >= 0; i--) {
      if (env[i].has(token)) return env[i].get(token)!;
    }
    return 0;
  }

  const tokens = tokenize(expression);
  return parse(tokens, []);
}

// 分词
function tokenize(s: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === ' ') {
      i++;
      continue;
    }
    if (s[i] === '(' || s[i] === ')') {
      tokens.push(s[i]);
      i++;
    } else {
      let j = i;
      while (j < s.length && s[j] !== ' ' && s[j] !== '(' && s[j] !== ')') j++;
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
  console.log('测试1:', evaluate('(add 1 2)'), '期望: 3');
  console.log('测试2:', evaluate('(mult 3 (add 2 3))'), '期望: 15');
  console.log('测试3:', evaluate('(let x 2 (mult x 5))'), '期望: 10');
  console.log('测试4:', evaluate('(let x 2 (mult x (let x 3 y 4 (add x y))))'), '期望: 14');
}

test();

export {};
