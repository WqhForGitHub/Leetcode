// ============================================================
// 157. 应用替换
// ============================================================
// 自定义题：n 个字符替换规则（字符 -> 字符串），对输入字符串递归展开。
// 思路：DFS 递归展开 + 拓扑排序检测环（存在环则无法完全展开）。
// 时间复杂度：O(结果长度)，空间复杂度：O(展开深度)。

type RuleMap = Map<string, string>;

// 方法1：DFS 递归展开
// 对每个字符递归应用规则展开，用 visited 集合检测环避免死循环。
function applyReplacementsDFS(s: string, rules: RuleMap): string {
  const visiting = new Set<string>();
  const memo = new Map<string, string>();
  const expand = (ch: string): string => {
    if (!rules.has(ch)) return ch;
    if (memo.has(ch)) return memo.get(ch)!;
    if (visiting.has(ch)) {
      // 检测到环，停止展开保留原字符
      return ch;
    }
    visiting.add(ch);
    const repl = rules.get(ch)!;
    let res = "";
    for (const c of repl) res += expand(c);
    visiting.delete(ch);
    memo.set(ch, res);
    return res;
  };
  let result = "";
  for (const c of s) result += expand(c);
  return result;
}

// 方法2：拓扑排序检测环 + 迭代展开
// 先建立字符依赖图检测环，若无环则迭代展开至稳定。
function applyReplacementsTopo(s: string, rules: RuleMap): string {
  // 检测环：对规则中每个字符，其替换字符串里的字符构成依赖边
  const hasCycle = (): boolean => {
    const adj = new Map<string, Set<string>>();
    const indeg = new Map<string, number>();
    const keys = [...rules.keys()];
    for (const k of keys) {
      if (!adj.has(k)) adj.set(k, new Set());
      indeg.set(k, indeg.get(k) ?? 0);
      for (const c of rules.get(k)!) {
        if (rules.has(c)) {
          if (!adj.has(c)) adj.set(c, new Set());
          if (!adj.get(k)!.has(c)) {
            adj.get(k)!.add(c);
            indeg.set(c, (indeg.get(c) ?? 0) + 1);
          }
        }
      }
    }
    const q: string[] = [];
    for (const k of indeg.keys()) if ((indeg.get(k) ?? 0) === 0) q.push(k);
    let cnt = 0;
    while (q.length > 0) {
      const cur = q.shift()!;
      cnt++;
      for (const nx of adj.get(cur) ?? []) {
        indeg.set(nx, (indeg.get(nx) ?? 0) - 1);
        if ((indeg.get(nx) ?? 0) === 0) q.push(nx);
      }
    }
    return cnt !== indeg.size;
  };
  const cycle = hasCycle();
  if (cycle) {
    // 有环时只展开一次避免无限递归
    let res = "";
    for (const c of s) res += rules.has(c) ? rules.get(c)! : c;
    return res;
  }
  // 无环：迭代展开至所有可替换字符都被处理
  let result = s;
  let changed = true;
  while (changed) {
    changed = false;
    let next = "";
    for (const c of result) {
      if (rules.has(c)) {
        next += rules.get(c)!;
        changed = true;
      } else {
        next += c;
      }
    }
    result = next;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 157. 应用替换 =====");
const rules1: RuleMap = new Map([
  ["a", "bc"],
  ["b", "d"],
]);
console.log("DFS:", applyReplacementsDFS("a", rules1)); // 期望 dc
console.log("Topo:", applyReplacementsTopo("a", rules1)); // 期望 dc
const rules2: RuleMap = new Map([
  ["a", "b"],
  ["b", "c"],
  ["c", "x"],
]);
console.log("DFS:", applyReplacementsDFS("a", rules2)); // 期望 x
console.log("Topo:", applyReplacementsTopo("a", rules2)); // 期望 x
const rules3: RuleMap = new Map([
  ["a", "b"],
  ["b", "a"],
]);
console.log("DFS:", applyReplacementsDFS("a", rules3)); // 期望 a（环保留）
console.log("Topo:", applyReplacementsTopo("a", rules3)); // 期望 b（环单次展开）
const rules4: RuleMap = new Map([
  ["x", "yz"],
  ["y", "ab"],
]);
console.log("DFS:", applyReplacementsDFS("x", rules4)); // 期望 abz
console.log("Topo:", applyReplacementsTopo("x", rules4)); // 期望 abz
console.log("DFS:", applyReplacementsDFS("hello", new Map())); // 期望 hello
console.log("Topo:", applyReplacementsTopo("hello", new Map())); // 期望 hello

export {};
