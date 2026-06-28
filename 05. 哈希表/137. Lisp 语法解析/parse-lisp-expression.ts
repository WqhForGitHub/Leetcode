// ============================================================
// 137. Lisp 语法解析
// ============================================================
// LeetCode 736. Parse Lisp Expression
// 解析 Lisp 表达式，支持 add、mult、let 和变量赋值。
// 表达式形式：(let v1 e1 v2 e2 ... expr) 或 (add e1 e2) 或 (mult e1 e2)
// 时间复杂度：O(n)，n 为表达式长度；空间复杂度：O(n)

function evaluate(expression: string): number {
  // 递归解析：返回 [解析值, 结束位置]
  const parse = (s: string, i: number, scope: Map<string, number>): [number, number] => {
    if (s[i] === "(") {
      // 跳过 "("
      i++;
      // 读取操作名
      const op = readToken(s, i);
      i = op.next;

      // 创建子作用域（变量查找链）
      const localScope = new Map(scope);

      if (op.token === "let") {
        let lastVal = 0;
        while (s[i] !== ")") {
          // 若下一个是表达式或值
          if (s[i] === "(") {
            const [v, ni] = parse(s, i, localScope);
            lastVal = v;
            i = ni;
          } else {
            // 读取变量名或值
            const varTok = readToken(s, i);
            i = varTok.next;
            if (s[i] === ")") {
              // 最后一个 expr
              if (/^-?\d+$/.test(varTok.token)) {
                lastVal = parseInt(varTok.token);
              } else {
                lastVal = localScope.get(varTok.token) ?? 0;
              }
            } else {
              // var = expr
              let val: number;
              if (s[i] === "(") {
                const [v, ni] = parse(s, i, localScope);
                val = v;
                i = ni;
              } else {
                const valTok = readToken(s, i);
                i = valTok.next;
                if (/^-?\d+$/.test(valTok.token)) {
                  val = parseInt(valTok.token);
                } else {
                  val = localScope.get(valTok.token) ?? 0;
                }
              }
              localScope.set(varTok.token, val);
            }
          }
          // 跳过空格
          while (i < s.length && s[i] === " ") i++;
        }
        return [lastVal, i + 1]; // 跳过 ")"
      } else if (op.token === "add" || op.token === "mult") {
        // 两个参数
        const [v1, i1] = parse(s, i, localScope);
        i = i1;
        while (s[i] === " ") i++;
        const [v2, i2] = parse(s, i, localScope);
        i = i2;
        while (s[i] === " ") i++;
        const result = op.token === "add" ? v1 + v2 : v1 * v2;
        return [result, i + 1]; // 跳过 ")"
      }
      return [0, i + 1];
    } else {
      // 数字或变量
      const tok = readToken(s, i);
      if (/^-?\d+$/.test(tok.token)) {
        return [parseInt(tok.token), tok.next];
      }
      return [scope.get(tok.token) ?? 0, tok.next];
    }
  };

  // 读取一个 token（变量名或数字），并返回结束位置（跳过空格）
  const readToken = (s: string, start: number): { token: string; next: number } => {
    let i = start;
    while (i < s.length && s[i] === " ") i++;
    let j = i;
    while (j < s.length && s[j] !== " " && s[j] !== ")" && s[j] !== "(") j++;
    return { token: s.slice(i, j), next: j };
  };

  return parse(expression, 0, new Map())[0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 137. Lisp 语法解析 =====");
console.log(evaluate("(add 1 2)")); // 期望: 3
console.log(evaluate("(mult 3 (add 2 3))")); // 期望: 15
console.log(evaluate("(let x 2 (mult x 5))")); // 期望: 10
console.log(evaluate("(let x 2 (mult x (let x 3 y 4 (add x y))))")); // 期望: 14
console.log(evaluate("(let x 3 x 2 x)")); // 期望: 2

export {};
