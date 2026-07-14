// ============================================================
// 081. 连接词
// ============================================================
// LeetCode 472. Concatenated Words
// 给定不含重复单词的字符串数组，返回所有由其他单词拼接而成的单词
// 时间复杂度：O(n * m^2)，其中 n 为单词数，m 为最长单词长度

// 方法1：动态规划 - Word Break（推荐）
// 对每个单词用 word break DP 判断能否由其他单词拼接而成
// 先按长度排序，保证只用更短的单词来拆分当前单词
// 时间复杂度 O(n * m^2)，空间复杂度 O(n * m)
function findAllConcatenatedWordsInADict(words: string[]): string[] {
  // 按长度排序，记录原始索引以便恢复顺序
  const indexed: [string, number][] = words.map((w: string, i: number): [string, number] => [w, i]);
  indexed.sort((a: [string, number], b: [string, number]) => a[0].length - b[0].length);

  const wordSet: Set<string> = new Set();
  const results: [string, number][] = [];

  for (const [word, originalIdx] of indexed) {
    if (word.length === 0) continue;
    // 用 word break DP 判断当前单词能否由已存在的更短单词拼接而成
    if (canBreak(word, wordSet)) {
      results.push([word, originalIdx]);
    }
    wordSet.add(word);
  }

  // 按原始索引排序，保持输入顺序
  results.sort((a: [string, number], b: [string, number]) => a[1] - b[1]);
  return results.map((r: [string, number]): string => r[0]);
}

// Word Break DP：判断 word 能否由 wordSet 中的单词拼接而成
// dp[i] 表示 word[0..i-1] 能否由字典中的词拼接
function canBreak(word: string, wordSet: Set<string>): boolean {
  if (wordSet.size === 0) return false;
  const n: number = word.length;
  const dp: boolean[] = new Array(n + 1).fill(false);
  dp[0] = true; // 空串可以拼接

  for (let i: number = 1; i <= n; i++) {
    for (let j: number = 0; j < i; j++) {
      // 状态转移：dp[j] 为真且 word[j..i-1] 在字典中
      if (dp[j] && wordSet.has(word.substring(j, i))) {
        dp[i] = true;
        break; // 只需找到一个有效分割即可
      }
    }
  }
  return dp[n];
}

// 方法2：DFS + 记忆化
// 对每个单词，用深度优先搜索尝试拆分，记忆化避免重复计算
// 时间复杂度 O(n * m^2)，空间复杂度 O(n * m)
function findAllConcatenatedWordsInADictDFS(words: string[]): string[] {
  const indexed: [string, number][] = words.map((w: string, i: number): [string, number] => [w, i]);
  indexed.sort((a: [string, number], b: [string, number]) => a[0].length - b[0].length);

  const wordSet: Set<string> = new Set();
  const results: [string, number][] = [];

  for (const [word, originalIdx] of indexed) {
    if (word.length === 0) continue;
    const memo: Map<number, boolean> = new Map();
    if (canForm(word, 0, wordSet, memo)) {
      results.push([word, originalIdx]);
    }
    wordSet.add(word);
  }

  results.sort((a: [string, number], b: [string, number]) => a[1] - b[1]);
  return results.map((r: [string, number]): string => r[0]);
}

// DFS 记忆化：从位置 start 开始，判断 word[start..] 能否由字典单词拼接
function canForm(
  word: string,
  start: number,
  wordSet: Set<string>,
  memo: Map<number, boolean>,
): boolean {
  if (start === word.length) return true;
  if (memo.has(start)) return memo.get(start)!;

  for (let end: number = start + 1; end <= word.length; end++) {
    if (wordSet.has(word.substring(start, end))) {
      if (canForm(word, end, wordSet, memo)) {
        memo.set(start, true);
        return true;
      }
    }
  }
  memo.set(start, false);
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 081. 连接词 =====");
console.log(
  JSON.stringify(
    findAllConcatenatedWordsInADict([
      "cat",
      "cats",
      "catsdogcats",
      "dog",
      "dogcatsdog",
      "hippopotamuses",
      "rat",
      "ratcatdogcat",
    ]),
  ),
); // 期望结果: ["catsdogcats","dogcatsdog","ratcatdogcat"]

console.log(JSON.stringify(findAllConcatenatedWordsInADict(["a", "b", "ab", "abc"]))); // 期望结果: ["ab"]

console.log(JSON.stringify(findAllConcatenatedWordsInADict([""]))); // 期望结果: []

console.log(
  JSON.stringify(
    findAllConcatenatedWordsInADictDFS([
      "cat",
      "cats",
      "catsdogcats",
      "dog",
      "dogcatsdog",
      "hippopotamuses",
      "rat",
      "ratcatdogcat",
    ]),
  ),
); // 期望结果: ["catsdogcats","dogcatsdog","ratcatdogcat"]

console.log(JSON.stringify(findAllConcatenatedWordsInADict(["a", "aa", "aaa", "aaaa"]))); // 期望结果: ["aa","aaa","aaaa"]

export {};
