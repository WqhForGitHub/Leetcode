// ============================================================
// 078. 原子的数量
// ============================================================
// LeetCode 726. Number of Atoms
// 解析化学式，返回每个原子的数量，按原子名字典序拼接（数量为 1 省略）。

// 方法1：栈 + 解析（O(n²)，map 合并导致平方）
// 思路：遇到 '(' 压入新 map；遇到 ')' 弹出并乘以后缀数字后并入栈顶；
// 普通原子直接累加到栈顶。
function countOfAtoms(formula: string): string {
  const n = formula.length;
  let i = 0;

  const parseAtom = (): string => {
    const start = i;
    i++; // 首字母（大写）
    while (i < n && formula[i] >= 'a' && formula[i] <= 'z') i++;
    return formula.substring(start, i);
  };
  const parseNumber = (): number => {
    const start = i;
    while (i < n && formula[i] >= '0' && formula[i] <= '9') i++;
    return i === start ? 1 : parseInt(formula.substring(start, i), 10);
  };

  const stack: Map<string, number>[] = [new Map()];
  while (i < n) {
    const ch = formula[i];
    if (ch === '(') {
      stack.push(new Map());
      i++;
    } else if (ch === ')') {
      i++;
      const num = parseNumber();
      const top = stack.pop()!;
      const peek = stack[stack.length - 1];
      for (const [atom, count] of top) {
        peek.set(atom, (peek.get(atom) ?? 0) + count * num);
      }
    } else {
      const atom = parseAtom();
      const num = parseNumber();
      const peek = stack[stack.length - 1];
      peek.set(atom, (peek.get(atom) ?? 0) + num);
    }
  }

  return buildResult(stack[0]);
}

// 方法2：递归下降解析（O(n²)）
// 思路：递归解析括号子式，遇到 ')' 返回，调用方读取后缀数字并相乘合并。
function countOfAtoms2(formula: string): string {
  const n = formula.length;
  let i = 0;

  const parseAtom = (): string => {
    const start = i;
    i++;
    while (i < n && formula[i] >= 'a' && formula[i] <= 'z') i++;
    return formula.substring(start, i);
  };
  const parseNumber = (): number => {
    const start = i;
    while (i < n && formula[i] >= '0' && formula[i] <= '9') i++;
    return i === start ? 1 : parseInt(formula.substring(start, i), 10);
  };

  const parse = (): Map<string, number> => {
    const counts = new Map<string, number>();
    while (i < n && formula[i] !== ')') {
      if (formula[i] === '(') {
        i++; // 跳过 '('
        const sub = parse();
        i++; // 跳过 ')'
        const num = parseNumber();
        for (const [atom, c] of sub) {
          counts.set(atom, (counts.get(atom) ?? 0) + c * num);
        }
      } else {
        const atom = parseAtom();
        const num = parseNumber();
        counts.set(atom, (counts.get(atom) ?? 0) + num);
      }
    }
    return counts;
  };

  return buildResult(parse());
}

function buildResult(counts: Map<string, number>): string {
  const atoms = Array.from(counts.keys()).sort();
  let result = '';
  for (const atom of atoms) {
    result += atom;
    const c = counts.get(atom)!;
    if (c > 1) result += c.toString();
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 078. 原子的数量 =====");
console.log("方法1:", countOfAtoms("H2O")); // 期望 "H2O"
console.log("方法1:", countOfAtoms("Mg(OH)2")); // 期望 "H2MgO2"
console.log("方法1:", countOfAtoms("K4(ON(SO3)2)2")); // 期望 "K4N2O14S4"
console.log("方法2:", countOfAtoms2("H2O")); // 期望 "H2O"
console.log("方法2:", countOfAtoms2("Mg(OH)2")); // 期望 "H2MgO2"
console.log("方法2:", countOfAtoms2("K4(ON(SO3)2)2")); // 期望 "K4N2O14S4"

export {};
