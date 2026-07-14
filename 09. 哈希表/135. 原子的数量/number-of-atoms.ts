// ============================================================
// 135. 原子的数量
// ============================================================
// LeetCode 726. Number of Atoms
// 给定化学式字符串，返回每个原子的数量（按原子名字典序）。
// 支持括号、数字下标。如 "H2O" -> H:2,O:1；"Mg(OH)2" -> H:2,Mg:1,O:1
// 时间复杂度：O(n^2)，n 为公式长度；空间复杂度：O(n)

function countOfAtoms(formula: string): string {
  const n = formula.length;
  // 用栈处理括号，每层维护一个哈希表
  const stack: Map<string, number>[] = [new Map()];
  let i = 0;

  while (i < n) {
    const ch = formula[i];
    if (ch === "(") {
      stack.push(new Map());
      i++;
    } else if (ch === ")") {
      // 取出当前层
      const top = stack.pop()!;
      i++;
      // 读取数字
      let num = 0;
      while (i < n && /\d/.test(formula[i])) {
        num = num * 10 + parseInt(formula[i]);
        i++;
      }
      num = num || 1;
      // 合并到上层
      const upper = stack[stack.length - 1];
      for (const [atom, cnt] of top) {
        upper.set(atom, (upper.get(atom) || 0) + cnt * num);
      }
    } else if (/[A-Z]/.test(ch)) {
      // 读取原子名：大写 + 后续小写
      let j = i + 1;
      while (j < n && /[a-z]/.test(formula[j])) j++;
      const atom = formula.slice(i, j);
      // 读取数字
      let num = 0;
      while (j < n && /\d/.test(formula[j])) {
        num = num * 10 + parseInt(formula[j]);
        j++;
      }
      num = num || 1;
      const cur = stack[stack.length - 1];
      cur.set(atom, (cur.get(atom) || 0) + num);
      i = j;
    } else {
      i++;
    }
  }

  // 合并到顶层
  const final = stack[0];
  // 排序：原子名字典序
  const atoms = Array.from(final.keys()).sort();
  let result = "";
  for (const atom of atoms) {
    result += atom;
    const cnt = final.get(atom)!;
    if (cnt > 1) result += cnt;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 135. 原子的数量 =====");
console.log(countOfAtoms("H2O")); // 期望: "H2O"
console.log(countOfAtoms("Mg(OH)2")); // 期望: "H2MgO2"
console.log(countOfAtoms("K4(ON(SO3)2)2")); // 期望: "K4N2O14S4"

export {};
