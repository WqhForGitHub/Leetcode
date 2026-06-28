// ============================================================
// 152. 匹配子序列的单词数
// ============================================================
// LeetCode 792. Number of Matching Subsequences
// 给定字符串 s 和单词数组 words，统计 words 中是 s 的子序列的单词数。
// 时间复杂度：O(n + sum(words[i].length))；空间复杂度：O(words.length)

function numMatchingSubseq(s: string, words: string[]): number {
  // 哈希表：单词 -> 出现次数（合并相同单词）
  const wordCount = new Map<string, number>();
  for (const w of words) {
    wordCount.set(w, (wordCount.get(w) || 0) + 1);
  }

  let result = 0;
  for (const [w, c] of wordCount) {
    if (isSubsequence(w, s)) {
      result += c;
    }
  }
  return result;
}

// 判断 word 是否为 s 的子序列
function isSubsequence(word: string, s: string): boolean {
  let i = 0;
  for (const ch of s) {
    if (i < word.length && ch === word[i]) i++;
  }
  return i === word.length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 152. 匹配子序列的单词数 =====");
console.log(
  numMatchingSubseq("abcde", ["a", "bb", "acd", "ace"]),
); // 期望: 3 (a, acd, ace)
console.log(
  numMatchingSubseq("dsahjpjauf", ["ahjpjau", "ja", "ahbwzgqnuk", "tnmlanowax"]),
); // 期望: 2

export {};
