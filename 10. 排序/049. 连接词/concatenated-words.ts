// ============================================================
// 049. 连接词
// ============================================================
// LeetCode 472. Concatenated Words
// 给定无重复单词字典，返回所有可以由字典中至少两个更短单词拼接而成的单词。

// 方法1：按长度排序 + DP 单词拆分（推荐，O(n * L^2 * Σ) 时间）
// 按长度升序处理，维护一个已处理（更短）单词的集合。
// 对每个单词用类似「单词拆分」的 DP 判断能否由集合中的单词拼成。
// 由于当前单词本身尚未加入集合，DP 成立即意味着至少由两个单词拼成。
function findAllConcatenatedWordsInADict(words: string[]): string[] {
  // 按长度升序排序，保证拆分时只能用到更短的单词
  const sorted = [...words].sort((a, b) => a.length - b.length);
  const wordSet = new Set<string>();
  const result: string[] = [];

  for (const word of sorted) {
    if (word.length === 0) {
      wordSet.add(word);
      continue;
    }
    if (canFormByDP(word, wordSet)) {
      result.push(word);
    }
    wordSet.add(word);
  }
  return result;
}

// DP：判断 word 能否由 wordSet 中的单词拼成
function canFormByDP(word: string, wordSet: Set<string>): boolean {
  if (wordSet.size === 0) return false;
  const n = word.length;
  const dp = new Array<boolean>(n + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(word.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[n];
}

// 方法2：按长度排序 + Trie + DFS（O(n * L) 时间）
// 将更短单词插入 Trie，对当前单词做 DFS：在 Trie 中匹配前缀，
// 遇到单词结尾就递归匹配剩余部分。用 memo 记录某起点是否可拆分。
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd: boolean = false;
}

function findAllConcatenatedWordsInADictTrie(words: string[]): string[] {
  const sorted = [...words].sort((a, b) => a.length - b.length);
  const root = new TrieNode();
  const result: string[] = [];

  for (const word of sorted) {
    if (word.length === 0) {
      insertTrie(root, word);
      continue;
    }
    const memo: (boolean | undefined)[] = new Array(word.length + 1).fill(undefined);
    memo[word.length] = true; // 空后缀可拆分
    if (canSegment(word, 0, root, memo)) {
      result.push(word);
    }
    insertTrie(root, word);
  }
  return result;
}

function insertTrie(root: TrieNode, word: string): void {
  let node = root;
  for (const ch of word) {
    if (!node.children.has(ch)) {
      node.children.set(ch, new TrieNode());
    }
    node = node.children.get(ch)!;
  }
  node.isEnd = true;
}

// 判断 word[start..) 能否由 Trie 中的单词拼成（至少一个单词）
function canSegment(
  word: string,
  start: number,
  root: TrieNode,
  memo: (boolean | undefined)[]
): boolean {
  if (memo[start] !== undefined) return memo[start];
  let node = root;
  for (let i = start; i < word.length; i++) {
    const ch = word[i];
    if (!node.children.has(ch)) break; // 无法继续匹配更长的前缀
    node = node.children.get(ch)!;
    if (node.isEnd && canSegment(word, i + 1, root, memo)) {
      memo[start] = true;
      return true;
    }
  }
  memo[start] = false;
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 049. 连接词 =====");

function sortStrArr(arr: string[]): string[] {
  return [...arr].sort();
}

console.log("DP [cat,cats,catsdogcats,dog,dogcatsdog,hippopotamuses,rat,ratcatdogcat]:",
  sortStrArr(findAllConcatenatedWordsInADict(
    ["cat", "cats", "catsdogcats", "dog", "dogcatsdog", "hippopotamuses", "rat", "ratcatdogcat"]
  ))); // 期望 [catsdogcats,dogcatsdog,ratcatdogcat]

console.log("DP [cat,dog,catdog]:",
  sortStrArr(findAllConcatenatedWordsInADict(["cat", "dog", "catdog"]))); // 期望 [catdog]

console.log("Trie [cat,cats,catsdogcats,dog,dogcatsdog,hippopotamuses,rat,ratcatdogcat]:",
  sortStrArr(findAllConcatenatedWordsInADictTrie(
    ["cat", "cats", "catsdogcats", "dog", "dogcatsdog", "hippopotamuses", "rat", "ratcatdogcat"]
  ))); // 期望 [catsdogcats,dogcatsdog,ratcatdogcat]

console.log("Trie [cat,dog,catdog]:",
  sortStrArr(findAllConcatenatedWordsInADictTrie(["cat", "dog", "catdog"]))); // 期望 [catdog]

export {};
