// ============================================================
// 049. 原子的数量
// ============================================================
// LeetCode 726. Number of Atoms
// 给定一个化学式 formula，返回每种原子的数量（按原子名字字典序排列）。

// ------------------------------------------------------------
// 方法1：栈 + 哈希表
// ------------------------------------------------------------
// 解析原子名、数字、括号。遇 '(' 入栈当前 map，遇 ')' 把栈顶合并并乘以倍数。
// 时间 O(n^2)（拼接），空间 O(n)。
function countOfAtoms(formula: string): string {
  const stack: Map<string, number>[] = [new Map()];
  let i = 0;
  const n = formula.length;

  while (i < n) {
    if (formula[i] === "(") {
      stack.push(new Map());
      i++;
    } else if (formula[i] === ")") {
      i++;
      // 解析倍数
      let numStr = "";
      while (i < n && formula[i] >= "0" && formula[i] <= "9") {
        numStr += formula[i];
        i++;
      }
      const mult = numStr === "" ? 1 : parseInt(numStr, 10);
      const top = stack.pop()!;
      const cur = stack[stack.length - 1];
      for (const [atom, cnt] of top) {
        cur.set(atom, (cur.get(atom) || 0) + cnt * mult);
      }
    } else {
      // 原子名：大写 + 小写
      let atom = formula[i];
      i++;
      while (i < n && formula[i] >= "a" && formula[i] <= "z") {
        atom += formula[i];
        i++;
      }
      // 数字
      let numStr = "";
      while (i < n && formula[i] >= "0" && formula[i] <= "9") {
        numStr += formula[i];
        i++;
      }
      const cnt = numStr === "" ? 1 : parseInt(numStr, 10);
      const cur = stack[stack.length - 1];
      cur.set(atom, (cur.get(atom) || 0) + cnt);
    }
  }

  // 排序输出
  const finalMap = stack[0];
  const atoms = Array.from(finalMap.keys()).sort();
  let result = "";
  for (const atom of atoms) {
    result += atom;
    const cnt = finalMap.get(atom)!;
    if (cnt > 1) result += cnt;
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", countOfAtoms("H2O"), "期望: H2O");
  console.log("测试2:", countOfAtoms("Mg(OH)2"), "期望: H2MgO2");
  console.log("测试3:", countOfAtoms("K4(ON(SO3)2)2"), "期望: K4N2O14S4");
  console.log("测试4:", countOfAtoms("Be32"), "期望: Be32");
}

test();

export {};
