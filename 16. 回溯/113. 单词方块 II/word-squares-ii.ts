// ============================================================
// 113. 单词方块 II
// ============================================================
// LeetCode 425. Word Squares
// 给定一组可能含重复的单词，返回所有不同的单词方块。
// 单词方块：k×k 网格，第 i 行等于第 i 列。

// 时间复杂度：O(N * L * 4^L) 最坏，N 单词数，L 单词长度
// 空间复杂度：O(N * L) Trie 节点数

// ============================================================
// Trie 节点定义
// ============================================================
class TrieNode {
  children: Map<string, TrieNode>;
  words: number; // 以此节点为前缀的单词个数（用于去重计数）

  constructor() {
    this.children = new Map<string, TrieNode>();
    this.words = 0;
  }
}

// 方法1：回溯 + Trie (推荐)
// 用 Trie 快速查询以某前缀开头的所有单词，逐行填入单词方块。
// 因为输入可能含重复单词，用计数方式去重。
// 时间复杂度 O(N * L + 分支^L), 空间复杂度 O(N * L)
function wordSquaresII(words: string[]): string[][] {
  const L: number = words.length > 0 ? words[0].length : 0;
  // 统计每个不同单词出现次数
  const countMap: Map<string, number> = new Map();
  for (const w of words) {
    countMap.set(w, (countMap.get(w) ?? 0) + 1);
  }
  const uniqueWords: string[] = Array.from(countMap.keys());

  // 构建 Trie，每个节点记录以此为前缀的（去重后）单词列表
  const root: TrieNode = new TrieNode();
  const _prefixWords: Map<string, string[]> = new Map();
  for (const w of uniqueWords) {
    let node: TrieNode = root;
    for (let i: number = 0; i < w.length; i++) {
      const ch: string = w[i];
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch)!;
    }
    node.words += countMap.get(w)!;
  }

  // 用前缀哈希获取候选单词（更直接，效率好）
  const prefixMap: Map<string, string[]> = new Map();
  for (const w of uniqueWords) {
    let pre: string = "";
    for (let i: number = 0; i <= w.length; i++) {
      if (!prefixMap.has(pre)) prefixMap.set(pre, []);
      prefixMap.get(pre)!.push(w);
      if (i < w.length) pre += w[i];
    }
  }

  const square: string[] = [];
  const result: string[][] = [];
  // 记录每个单词当前可用次数
  const usedCount: Map<string, number> = new Map();

  function getWordsWithPrefix(prefix: string): string[] {
    return prefixMap.get(prefix) ?? [];
  }

  function backtrack(step: number): void {
    if (step === L) {
      // 找到一个完整方块，根据每个单词剩余可用次数组合所有不同方块
      // 但这里因为单词可重复，我们用多重集方式枚举
      // 为简化，本方法直接在选词时考虑重复计数
      result.push([...square]);
      return;
    }
    // 构造当前行必须满足的前缀：前 step 行的第 step 列
    let prefix: string = "";
    for (let i: number = 0; i < step; i++) {
      prefix += square[i][step];
    }
    const candidates: string[] = getWordsWithPrefix(prefix);
    for (const cand of candidates) {
      const remaining: number = (countMap.get(cand) ?? 0) - (usedCount.get(cand) ?? 0);
      if (remaining <= 0) continue;
      usedCount.set(cand, (usedCount.get(cand) ?? 0) + 1);
      square.push(cand);
      backtrack(step + 1);
      square.pop();
      usedCount.set(cand, (usedCount.get(cand) ?? 0) - 1);
    }
  }

  backtrack(0);
  return result;
}

// 方法2：回溯 + 前缀哈希
// 与方法1类似，但完全不使用 Trie，只用 Map<string, string[]> 做前缀索引。
// 时间复杂度 O(N*L^2 + 分支^L), 空间复杂度 O(N*L)
function wordSquaresII2(words: string[]): string[][] {
  if (words.length === 0) return [];
  const L: number = words[0].length;

  // 统计次数
  const countMap: Map<string, number> = new Map();
  for (const w of words) {
    countMap.set(w, (countMap.get(w) ?? 0) + 1);
  }
  const uniqueWords: string[] = Array.from(countMap.keys());

  // 构建前缀到单词列表的映射
  const prefixMap: Map<string, string[]> = new Map();
  for (const w of uniqueWords) {
    let pre: string = "";
    for (let i: number = 0; i <= w.length; i++) {
      if (!prefixMap.has(pre)) prefixMap.set(pre, []);
      prefixMap.get(pre)!.push(w);
      if (i < w.length) pre += w[i];
    }
  }

  const square: string[] = [];
  const result: string[][] = [];
  const usedCount: Map<string, number> = new Map();

  function backtrack(step: number): void {
    if (step === L) {
      result.push([...square]);
      return;
    }
    let prefix: string = "";
    for (let i: number = 0; i < step; i++) {
      prefix += square[i][step];
    }
    const candidates: string[] = prefixMap.get(prefix) ?? [];
    for (const cand of candidates) {
      const remaining: number = (countMap.get(cand) ?? 0) - (usedCount.get(cand) ?? 0);
      if (remaining <= 0) continue;
      usedCount.set(cand, (usedCount.get(cand) ?? 0) + 1);
      square.push(cand);
      backtrack(step + 1);
      square.pop();
      usedCount.set(cand, (usedCount.get(cand) ?? 0) - 1);
    }
  }

  backtrack(0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 113. 单词方块 II =====");
console.log(wordSquaresII(["ab", "ba", "ac", "ca"]));
// 期望结果: [["ab","ba"],["ac","ca"]] (顺序可不同)
console.log(wordSquaresII(["ab", "ba", "ab"]));
// 含重复 "ab"，可形成 [ab,ba] 方块（使用一个 ab）
console.log(wordSquaresII2(["ab", "ba", "ac", "ca"]));

export {};
