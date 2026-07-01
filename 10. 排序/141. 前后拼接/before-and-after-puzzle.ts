// ============================================================
// 141. 前后拼接
// ============================================================
// LeetCode 1181. Before and After Puzzle
// 给定短语列表 phrases，若短语 A 的最后一个单词等于短语 B 的第一个单词，
// 则可将二者拼接（共用该单词）形成 puzzle。返回所有去重后按字典序排序的 puzzle。

// 方法1：HashMap 按首/尾词分组（时间 O(n * L)，L 为短语平均长度）
// 用两个 Map 分别记录每个首词对应的所有短语索引、每个尾词对应的所有短语索引，
// 然后遍历所有可能的"尾词 == 首词"配对拼接。
function beforeAndAfterPuzzles(phrases: string[]): string[] {
  const n = phrases.length;
  // 预处理：每个短语的首词与尾词
  const firstWord: string[] = new Array(n);
  const lastWord: string[] = new Array(n);
  const tokens: string[][] = new Array(n);

  for (let i = 0; i < n; i++) {
    const words = phrases[i].split(" ");
    tokens[i] = words;
    firstWord[i] = words[0];
    lastWord[i] = words[words.length - 1];
  }

  // 按首词分组：firstWord -> 短语索引列表
  const byFirst = new Map<string, number[]>();
  for (let i = 0; i < n; i++) {
    if (!byFirst.has(firstWord[i])) byFirst.set(firstWord[i], []);
    byFirst.get(firstWord[i])!.push(i);
  }

  const resultSet = new Set<string>();

  for (let i = 0; i < n; i++) {
    const w = lastWord[i];
    const candidates = byFirst.get(w);
    if (!candidates) continue;
    for (const j of candidates) {
      if (i === j) continue; // 同一短语不能与自己拼接（题目要求）
      // 拼接：phrases[i] 去掉最后一个词 + phrases[j]
      const left = tokens[i].slice(0, tokens[i].length - 1);
      const combined = [...left, ...tokens[j]].join(" ");
      resultSet.add(combined);
    }
  }

  const result = Array.from(resultSet);
  result.sort();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 141. 前后拼接 =====");
console.log(
  "方法1:",
  beforeAndAfterPuzzles(["writing code", "code rocks"])
); // 期望: ["writing code rocks"]
console.log(
  "方法1:",
  beforeAndAfterPuzzles(["a", "b", "a"])
); // 期望: ["a"] （"a" 与 "a" 共用单词合并后仍是 "a"）
console.log(
  "方法1:",
  beforeAndAfterPuzzles(["a b", "b c", "c d"])
); // 期望: ["a b c","b c d"]
console.log(
  "方法1:",
  beforeAndAfterPuzzles(["mission statement", "a quick bite to eat", "a chip off the old block"])
); // 期望: [] （不存在首尾词相同的可拼接对）

export {};
