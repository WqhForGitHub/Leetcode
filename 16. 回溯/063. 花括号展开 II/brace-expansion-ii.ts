// ============================================================
// 063. 花括号展开 II
// ============================================================
// LeetCode 1096. Brace Expansion II
// 给定带嵌套 {} 和逗号的表达式，返回展开后所有字符串的字典序排列。
// 语法：表达式由 ',' (并)、相邻拼接 (积)、{} (分组) 组合而成。
// 时间复杂度：O(结果总数 * 字符串长度), 空间复杂度：O(结果总数)

// 方法1：递归下降解析 + 回溯 (推荐)
// 用文法：expr := list(',' list)*  list := factor+  factor := '{' expr '}' | letter
// 时间复杂度 O(R * L), 空间复杂度 O(R)，R 为结果数
function braceExpansionII(expression: string): string[] {
  let pos = 0;
  const s = expression;
  const n = s.length;

  // 跳过空白
  const skip = (): void => {
    while (pos < n && s[pos] === " ") pos++;
  };

  // 解析 factor：返回字符串集合
  const parseFactor = (): string[] => {
    skip();
    if (s[pos] === "{") {
      pos++; // 跳过 '{'
      const res = parseExpr();
      skip();
      pos++; // 跳过 '}'
      return res;
    } else {
      // 单个字母
      const ch = s[pos++];
      return [ch];
    }
  };

  // 解析 list：若干 factor 的拼接（笛卡尔积）
  const parseList = (): string[] => {
    let result: string[] = [""];
    while (true) {
      skip();
      if (pos >= n) break;
      const ch = s[pos];
      if (ch === "}" || ch === ",") break;
      // 否则是 factor
      const factor = parseFactor();
      const next: string[] = [];
      for (const a of result) {
        for (const b of factor) {
          next.push(a + b);
        }
      }
      result = next;
    }
    return result;
  };

  // 解析 expr：list 用 ',' 分隔，做并集
  const parseExpr = (): string[] => {
    let result = parseList();
    while (true) {
      skip();
      if (pos < n && s[pos] === ",") {
        pos++; // 跳过 ','
        const next = parseList();
        result = result.concat(next);
      } else {
        break;
      }
    }
    return result;
  };

  const result = parseExpr();
  // 去重并排序
  return Array.from(new Set(result)).sort();
}

// 方法2：栈解析 + 集合运算
// 双栈：值栈与操作栈，操作符 ',' (并, 优先级1) 和 '+' (拼接, 优先级2)
// 通过 prevWasValue 标记判断隐式拼接
// 时间复杂度 O(R * L), 空间复杂度 O(R)
function braceExpansionII2(expression: string): string[] {
  const valStack: string[][] = [];
  const opStack: string[] = [];
  let prevWasValue = false;

  // 笛卡尔积
  const concat = (a: string[], b: string[]): string[] => {
    const res: string[] = [];
    for (const x of a) for (const y of b) res.push(x + y);
    return res;
  };
  // 并集
  const union = (a: string[], b: string[]): string[] => a.concat(b);

  // 应用栈顶操作符
  const applyOp = (): void => {
    const op = opStack.pop()!;
    const b = valStack.pop()!;
    const a = valStack.pop()!;
    if (op === ",") valStack.push(union(a, b));
    else valStack.push(concat(a, b));
  };

  // 压入一个值：若前一个是值，则需要隐式拼接
  const pushValue = (v: string[]): void => {
    if (prevWasValue) {
      opStack.push("+");
    }
    valStack.push(v);
    prevWasValue = true;
  };

  for (let i = 0; i < expression.length; i++) {
    const ch = expression[i];
    if (ch === "{") {
      // 若前一个是值，需要隐式拼接
      if (prevWasValue) opStack.push("+");
      opStack.push("{");
      prevWasValue = false;
    } else if (ch === "}") {
      // 应用栈内操作直到 '{'
      while (opStack.length && opStack[opStack.length - 1] !== "{") {
        applyOp();
      }
      opStack.pop(); // 弹出 '{'
      prevWasValue = true; // {} 整体是一个值
    } else if (ch === ",") {
      // ',' 是最低优先级，应用栈内所有操作直到 '{'
      while (opStack.length && opStack[opStack.length - 1] !== "{") {
        applyOp();
      }
      opStack.push(",");
      prevWasValue = false;
    } else if (ch !== " ") {
      pushValue([ch]);
    }
  }

  // 应用剩余操作
  while (opStack.length) {
    applyOp();
  }

  return Array.from(new Set(valStack[0] || [])).sort();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 063. 花括号展开 II =====");
console.log(braceExpansionII("{a,b}{c,{d,e}}")); // 期望结果: ["ac","ad","ae","bc","bd","be"]
console.log(braceExpansionII("{{a,z},a{b,c},{ab,z}}")); // 期望结果: ["a","ab","ac","z"]
console.log(braceExpansionII2("{a,b}{c,{d,e}}")); // 期望结果: ["ac","ad","ae","bc","bd","be"]

export {};
