// ============================================================
// 076. 词典中最长的单词
// ============================================================
// LeetCode 720. Longest Word in Dictionary
// 找出词典中可由其他单词每次添加一个字母（从首字母开始）构成的最长单词，长度相同取字典序最小。

// 方法1：排序 + 哈希集合（O(n log n * L)）
// 思路：按长度降序、字典序升序排序，依次检查每个单词所有前缀是否都在集合中。
function longestWord(words: string[]): string {
  const wordSet = new Set<string>(words);
  words.sort((a, b) => {
    if (a.length !== b.length) return b.length - a.length;
    return a < b ? -1 : a > b ? 1 : 0;
  });
  for (const word of words) {
    let valid = true;
    for (let i = 1; i < word.length; i++) {
      if (!wordSet.has(word.substring(0, i))) {
        valid = false;
        break;
      }
    }
    if (valid) return word;
  }
  return '';
}

// 方法2：字典树 + DFS（O(所有单词长度之和)）
// 思路：将所有单词插入字典树并标记单词结尾。DFS 时只向“构成完整单词”的子节点走，
// 路径上记录满足条件的最长（长度相同取字典序最小）单词。
interface TrieNode {
  children: Map<string, TrieNode>;
  word: string;
}

function longestWord2(words: string[]): string {
  const root: TrieNode = { children: new Map(), word: '' };
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      let child = node.children.get(ch);
      if (!child) {
        child = { children: new Map(), word: '' };
        node.children.set(ch, child);
      }
      node = child;
    }
    node.word = w;
  }

  let result = '';
  const dfs = (node: TrieNode): void => {
    if (
      node.word.length > result.length ||
      (node.word.length === result.length && node.word < result)
    ) {
      result = node.word;
    }
    for (const child of node.children.values()) {
      if (child.word.length > 0) dfs(child);
    }
  };
  dfs(root);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 076. 词典中最长的单词 =====");
console.log("方法1:", longestWord(["w", "wo", "wor", "worl", "world"])); // 期望 "world"
console.log("方法1:", longestWord(["a", "banana", "app", "appl", "ap", "apply", "apple"])); // 期望 "apple"
console.log("方法2:", longestWord2(["w", "wo", "wor", "worl", "world"])); // 期望 "world"
console.log("方法2:", longestWord2(["a", "banana", "app", "appl", "ap", "apply", "apple"])); // 期望 "apple"

export {};
