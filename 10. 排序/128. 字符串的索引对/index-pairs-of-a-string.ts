// ============================================================
// 128. 字符串的索引对
// ============================================================
// LeetCode 1065. Index Pairs of a String
// 给定文本 text 与单词列表 words，返回所有 [start, end] 索引对，使得某个单词
// 在 text 的该区间出现。结果按 start 升序，再按 end 升序排列。

// 方法1：单词去重 + 暴力查找（时间 O(n * S)，S 为所有单词长度之和）
// 对每个单词用 indexOf 找出全部出现位置。
function indexPairs(text: string, words: string[]): number[][] {
  const wordSet = new Set(words); // 去重，避免重复索引对
  const result: number[][] = [];
  for (const w of wordSet) {
    let from = 0;
    let idx = text.indexOf(w, from);
    while (idx !== -1) {
      result.push([idx, idx + w.length - 1]);
      from = idx + 1;
      idx = text.indexOf(w, from);
    }
  }
  result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return result;
}

// 方法2：Trie 前缀树（时间 O(S + n^2)，S 为所有单词长度之和）
// 建立 words 的 Trie，从 text 每个起点 i 沿 Trie 走，命中单词即记录 [i, j]。
type TrieNode = { children: Map<string, TrieNode>; isWord: boolean };
function makeTrieNode(): TrieNode {
  return { children: new Map<string, TrieNode>(), isWord: false };
}

function indexPairs2(text: string, words: string[]): number[][] {
  const root = makeTrieNode();
  for (const w of new Set(words)) {
    let node = root;
    for (const ch of w) {
      let child = node.children.get(ch);
      if (!child) {
        child = makeTrieNode();
        node.children.set(ch, child);
      }
      node = child;
    }
    node.isWord = true;
  }

  const result: number[][] = [];
  const n = text.length;
  for (let i = 0; i < n; i++) {
    let node = root;
    for (let j = i; j < n; j++) {
      const child = node.children.get(text[j]);
      if (!child) break;
      node = child;
      if (node.isWord) result.push([i, j]);
    }
  }
  // 由生成顺序天然按 (i, j) 升序，排序保持稳健
  result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 128. 字符串的索引对 =====");
console.log("方法1:", indexPairs("ababa", ["aba", "ab"])); // 期望: [[0,1],[0,2],[2,3],[2,4]]
console.log("方法1:", indexPairs("thestoryofleetcodeandme", ["story", "of", "code", "me"])); // 期望: [[3,7],[8,9],[14,17],[21,22]]
console.log("方法2:", indexPairs2("ababa", ["aba", "ab"])); // 期望: [[0,1],[0,2],[2,3],[2,4]]
console.log("方法2:", indexPairs2("thestoryofleetcodeandme", ["story", "of", "code", "me"])); // 期望: [[3,7],[8,9],[14,17],[21,22]]

export {};
