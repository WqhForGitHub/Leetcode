// ============================================================
// 061. 花括号展开
// ============================================================
// LeetCode 1087. Brace Expansion
// 给定形如 "{a,b}c{d,e}" 的表达式，展开为所有可能的字符串（字典序）。
// 本题允许 {} 嵌套，每个 {} 内以逗号分隔若干项。
// 时间复杂度：O(2^N * N), 空间复杂度：O(N)

// 方法1：回溯 (递归解析 + 展开) (推荐)
// 用递归解析表达式为分组列表；每个 {} 内可包含嵌套，递归处理
// 时间复杂度 O(2^N * N), 空间复杂度 O(N)
function expand(s: string): string[] {
  // pos 用于在递归中共享扫描位置
  let pos = 0;

  // 解析一个 {} 内部直到 '}'：返回由若干候选项组成的列表
  const parseGroup = (): string[] => {
    // 项的集合（每个项是字符串）
    const items: string[] = [];
    let cur = "";
    while (pos < s.length && s[pos] !== "}") {
      if (s[pos] === "{") {
        pos++; // 跳过 '{'
        // 若 cur 非空，先作为一个文字项
        if (cur.length > 0) {
          items.push(cur);
          cur = "";
        }
        const sub = parseGroup();
        pos++; // 跳过 '}'
        // sub 中每一项都可作为当前组的一个候选项
        for (const x of sub) items.push(x);
        // 跳过可能的逗号
        if (pos < s.length && s[pos] === ",") pos++;
      } else if (s[pos] === ",") {
        if (cur.length > 0) {
          items.push(cur);
          cur = "";
        }
        pos++;
      } else {
        cur += s[pos];
        pos++;
      }
    }
    if (cur.length > 0) items.push(cur);
    return items;
  };

  // 顶层解析：将整个表达式拆成一段段（每段是一组候选）
  const groups: string[][] = [];
  while (pos < s.length) {
    if (s[pos] === "{") {
      pos++; // 跳过 '{'
      const items = parseGroup();
      pos++; // 跳过 '}'
      groups.push(items.sort());
    } else {
      groups.push([s[pos]]);
      pos++;
    }
  }

  const result: string[] = [];
  const cur: string[] = [];

  const backtrack = (idx: number): void => {
    if (idx === groups.length) {
      result.push(cur.join(""));
      return;
    }
    for (const ch of groups[idx]) {
      cur.push(ch);
      backtrack(idx + 1);
      cur.pop();
    }
  };

  backtrack(0);
  return result.sort();
}

// 方法2：迭代 (栈解析)
// 用栈维护前缀与 {} 内已完成的候选项，顺序扫描字符
// 适用于无嵌套场景 (LeetCode 1087 标准用例)
// 时间复杂度 O(2^N * N), 空间复杂度 O(2^N)
function expand2(s: string): string[] {
  // 栈中元素：当前 {} 之外的前缀字符串集合 与 {} 内已收集的候选项集合
  const stack: { prefix: string[]; options: string[] }[] = [];
  let current: string[] = [""];

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "{") {
      // 入栈：保存当前前缀，开始收集新的候选项
      stack.push({ prefix: current, options: [] });
      current = [""];
    } else if (ch === "}") {
      // 出栈：将 current 加入候选项集合
      const top = stack[stack.length - 1];
      const options = top.options.concat(current);
      const prefix = top.prefix;
      stack.pop();
      // 前缀与候选项做笛卡尔积
      const next: string[] = [];
      for (const p of prefix) {
        for (const opt of options) {
          next.push(p + opt);
        }
      }
      current = next;
    } else if (ch === ",") {
      // 当前候选项结束，加入 options，重置 current
      const top = stack[stack.length - 1];
      top.options = top.options.concat(current);
      current = [""];
    } else {
      // 普通字符：拼接到每个 current
      const next: string[] = [];
      for (const c of current) {
        next.push(c + ch);
      }
      current = next;
    }
  }
  return Array.from(new Set(current)).sort();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 061. 花括号展开 =====");
console.log(expand("{a,b}c{d,e}")); // 期望结果: ["acd","ace","bcd","bce"]
console.log(expand("{a,b}{c,{d,e}}")); // 期望结果: ["ac","ad","ae","bc","bd","be"]
console.log(expand2("{a,b}c{d,e}")); // 期望结果: ["acd","ace","bcd","bce"]

export {};
